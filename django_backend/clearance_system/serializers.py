from rest_framework import serializers
from .models import Student, Laptop, SecurityGuard, GateLog

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['reg_no', 'name', 'email', 'phone', 'course', 'department', 'id_number', 'photo']


class LaptopSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='reg_no.name')
    student_reg_no = serializers.ReadOnlyField(source='reg_no.reg_no')

    class Meta:
        model = Laptop
        fields = [
            'laptop_id', 'reg_no', 'student_name', 'student_reg_no', 
            'model', 'brand', 'serial_no', 'photo', 'qr_code', 
            'qr_payload', 'status', 'stolen_reported_at', 
            'stolen_incident_notes', 'registered_at'
        ]


class LaptopRegistrationSerializer(serializers.Serializer):
    reg_no = serializers.CharField(max_length=50)
    model = serializers.CharField(max_length=100)
    brand = serializers.CharField(max_length=50, required=False, default='HP')
    serial_no = serializers.CharField(max_length=100)


class SecurityGuardSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityGuard
        fields = ['guard_id', 'name', 'gate_assigned', 'phone', 'shift', 'is_active']


class GateLogSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='laptop.reg_no.name')
    student_reg_no = serializers.ReadOnlyField(source='laptop.reg_no.reg_no')
    laptop_model = serializers.ReadOnlyField(source='laptop.model')
    serial_no = serializers.ReadOnlyField(source='laptop.serial_no')
    guard_name = serializers.ReadOnlyField(source='guard.name')

    class Meta:
        model = GateLog
        fields = [
            'log_id', 'laptop', 'guard', 'student_name', 'student_reg_no',
            'laptop_model', 'serial_no', 'guard_name', 'date', 
            'entry_time', 'exit_time', 'action', 'status', 
            'gate_location', 'cached_offline', 'created_at'
        ]
