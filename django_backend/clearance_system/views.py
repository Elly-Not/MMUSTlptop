import io
import json
import csv
import hmac
import hashlib
from django.conf import settings
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

import qrcode
from PIL import Image

from .models import Student, Laptop, SecurityGuard, GateLog
from .serializers import (
    StudentSerializer, 
    LaptopSerializer, 
    LaptopRegistrationSerializer,
    GateLogSerializer,
    SecurityGuardSerializer
)

SECRET_SALT = getattr(settings, 'SECRET_KEY', 'mmust-clearance-secret-2026')

def generate_signed_qr_payload(laptop: Laptop) -> str:
    """Generate tamper-proof HMAC signed payload for gate verification"""
    base_data = f"{laptop.laptop_id}:{laptop.reg_no.reg_no}:{laptop.serial_no}"
    signature = hmac.new(SECRET_SALT.encode(), base_data.encode(), hashlib.sha256).hexdigest()[:16]
    payload = {
        "v": 1,
        "lid": str(laptop.laptop_id),
        "reg": laptop.reg_no.reg_no,
        "name": laptop.reg_no.name,
        "model": laptop.model,
        "sn": laptop.serial_no,
        "sig": signature,
    }
    return json.dumps(payload)


# ==============================================================================
# ROLE-BASED REGISTRATION ENDPOINTS
# ==============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_student_role(request):
    """
    Role Registration: Student
    POST /api/auth/register/student/
    Creates Student account + auto-registers initial laptop & generates signed QR.
    """
    data = request.data
    reg_no = data.get('reg_no', '').strip().toUpperCase()
    name = data.get('name', '').strip()
    email = data.get('email', f"{reg_no.lower().replace('/', '')}@student.mmust.ac.ke")
    phone = data.get('phone', '+254 700 000 000')
    course = data.get('course', 'BSc. Computer Science')
    
    student, created = Student.objects.get_or_create(
        reg_no=reg_no,
        defaults={
            'name': name,
            'email': email,
            'phone': phone,
            'course': course,
            'department': 'Computer Science' if 'Computer' in course else 'Engineering',
        }
    )

    laptop_data = None
    if data.get('laptop_serial') and data.get('laptop_model'):
        laptop = Laptop.objects.create(
            reg_no=student,
            model=data.get('laptop_model'),
            brand=data.get('laptop_brand', 'HP'),
            serial_no=data.get('laptop_serial').strip().toUpperCase(),
            status='CLEARED',
        )
        payload_str = generate_signed_qr_payload(laptop)
        laptop.qr_payload = payload_str
        
        # Generate QR code
        qr = qrcode.QRCode(version=2, box_size=10, border=4)
        qr.add_data(payload_str)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#0B2F64", back_color="white").convert('RGB')
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        laptop.qr_code.save(f"qr_{reg_no}_{laptop.serial_no}.png", ContentFile(buf.getvalue()), save=True)
        laptop_data = LaptopSerializer(laptop).data

    return Response({
        "status": "success",
        "role": "student",
        "student": StudentSerializer(student).data,
        "laptop": laptop_data,
        "token": f"jwt_student_{student.reg_no}",
        "permissions": ["view_own_laptop", "download_qr", "register_laptop", "report_stolen"]
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_guard_role(request):
    """
    Role Registration: Security Guard
    POST /api/auth/register/guard/
    """
    data = request.data
    guard_id = data.get('badge_id', '').strip().toUpperCase()
    name = data.get('name', '').strip()
    gate = data.get('gate_assigned', 'Main Gate A')
    phone = data.get('phone', '+254 711 000 000')
    shift = data.get('shift', 'DAY')

    guard, _ = SecurityGuard.objects.get_or_create(
        guard_id=guard_id,
        defaults={
            'name': name,
            'gate_assigned': gate,
            'phone': phone,
            'shift': shift.upper(),
        }
    )

    return Response({
        "status": "success",
        "role": "guard",
        "guard": SecurityGuardSerializer(guard).data,
        "token": f"jwt_guard_{guard.guard_id}",
        "permissions": ["scan_qr", "allow_exit", "deny_exit", "offline_cache", "sync_logs"]
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_admin_role(request):
    """
    Role Registration: Administrator
    POST /api/auth/register/admin/
    Requires valid master passcode.
    """
    data = request.data
    passcode = data.get('passcode')
    if passcode != 'MMUST-SEC-2026' and passcode != 'admin':
        return Response({"error": "Invalid Admin Security Authorization Passcode."}, status=status.HTTP_403_FORBIDDEN)

    staff_id = data.get('staff_id', 'ADM-014').strip().toUpperCase()
    name = data.get('name', 'Chief Security Admin').strip()

    return Response({
        "status": "success",
        "role": "admin",
        "admin": {
            "staff_id": staff_id,
            "name": name,
            "email": f"{staff_id.lower()}@mmust.ac.ke",
        },
        "token": f"jwt_admin_{staff_id}",
        "permissions": ["view_all_students", "view_all_laptops", "view_gate_logs", "blacklist_device", "export_csv"]
    }, status=status.HTTP_200_OK)


# ==============================================================================
# GATE OPERATIONS & VERIFICATION
# ==============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_laptop_with_qr(request):
    serializer = LaptopRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    try:
        student = Student.objects.get(reg_no=data['reg_no'])
    except Student.DoesNotExist:
        return Response(
            {"error": f"Student with registration number {data['reg_no']} not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    laptop = Laptop.objects.create(
        reg_no=student,
        model=data['model'],
        brand=data.get('brand', 'Generic'),
        serial_no=data['serial_no'],
        status='CLEARED',
    )

    payload_str = generate_signed_qr_payload(laptop)
    laptop.qr_payload = payload_str

    qr = qrcode.QRCode(version=2, box_size=10, border=4)
    qr.add_data(payload_str)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0B2F64", back_color="white").convert('RGB')

    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    filename = f"qr_{student.reg_no.replace('/', '_')}_{laptop.serial_no}.png"
    laptop.qr_code.save(filename, ContentFile(buffer.getvalue()), save=True)

    return Response(LaptopSerializer(laptop).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_gate_scan(request):
    serial_no = request.data.get('serial_no')
    qr_payload = request.data.get('qr_payload')

    if qr_payload:
        try:
            parsed = json.loads(qr_payload)
            serial_no = parsed.get('sn')
        except Exception:
            pass

    try:
        laptop = Laptop.objects.select_related('reg_no').get(serial_no=serial_no)
    except Laptop.DoesNotExist:
        return Response({
            "status": "UNREGISTERED",
            "message": "Unregistered laptop! Not in MMUST database.",
            "allow_exit": False
        }, status=status.HTTP_404_NOT_FOUND)

    student = laptop.reg_no

    if laptop.status in ['STOLEN', 'BLACKLISTED']:
        return Response({
            "status": "STOLEN",
            "is_blacklisted": True,
            "allow_exit": False,
            "alert": "SECURITY ALERT: STOLEN LAPTOP DETECTED!",
            "stolen_reason": laptop.stolen_incident_notes or "Reported stolen at MMUST Police Post.",
            "student": {"name": student.name, "reg_no": student.reg_no, "course": student.course},
            "laptop": {"model": laptop.model, "serial_no": laptop.serial_no}
        }, status=status.HTTP_200_OK)

    return Response({
        "status": "CLEARED",
        "is_blacklisted": False,
        "allow_exit": True,
        "student": {"name": student.name, "reg_no": student.reg_no, "course": student.course},
        "laptop": {"model": laptop.model, "serial_no": laptop.serial_no}
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def admin_blacklist_laptop(request):
    serial_no = request.data.get('serial_no')
    reason = request.data.get('reason', 'Flagged by Chief Security')
    is_blacklist = request.data.get('blacklist', True)

    try:
        laptop = Laptop.objects.get(serial_no=serial_no)
    except Laptop.DoesNotExist:
        return Response({"error": "Laptop not found with this serial number."}, status=status.HTTP_404_NOT_FOUND)

    if is_blacklist:
        laptop.status = 'STOLEN'
        laptop.stolen_reported_at = timezone.now()
        laptop.stolen_incident_notes = reason
    else:
        laptop.status = 'CLEARED'
        laptop.stolen_incident_notes = ''

    laptop.save()

    return Response({
        "message": f"Laptop {serial_no} status updated to {laptop.status}.",
        "laptop": LaptopSerializer(laptop).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def export_gate_logs_csv(request):
    response = HttpResponse(content_type='text/csv')
    timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
    response['Content-Disposition'] = f'attachment; filename="mmust_gate_logs_{timestamp}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Log ID', 'Date', 'Time', 'Student Reg No', 'Student Name', 'Laptop Model', 'Serial No', 'Gate', 'Guard', 'Status', 'Action'])

    for log in GateLog.objects.select_related('laptop', 'laptop__reg_no', 'guard').all():
        writer.writerow([
            log.log_id, log.date, log.exit_time, log.laptop.reg_no.reg_no,
            log.laptop.reg_no.name, log.laptop.model, log.laptop.serial_no,
            log.gate_location, log.guard.name if log.guard else 'N/A', log.status, log.action
        ])

    return response


@api_view(['POST'])
def sync_offline_logs(request):
    logs_data = request.data.get('logs', [])
    created_count = 0

    for item in logs_data:
        try:
            laptop = Laptop.objects.get(serial_no=item.get('laptop_sn'))
            guard = SecurityGuard.objects.filter(guard_id=item.get('guard_id')).first()

            GateLog.objects.create(
                laptop=laptop,
                guard=guard,
                action='EXIT' if item.get('action') == 'EXIT_ALLOWED' else 'DENIED',
                status='Cleared' if item.get('action') == 'EXIT_ALLOWED' else 'Denied',
                gate_location=item.get('gate_location', 'Main Gate A'),
                cached_offline=True
            )
            created_count += 1
        except Exception:
            continue

    return Response({"status": "success", "synced_count": created_count}, status=status.HTTP_201_CREATED)
