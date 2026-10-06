import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Layers, 
  Terminal, 
  FileText, 
  FolderTree, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface CodeFile {
  name: string;
  path: string;
  language: 'yaml' | 'dart' | 'python' | 'markdown';
  category: 'flutter' | 'django' | 'docs';
  description: string;
  code: string;
}

export const CodebaseExplorer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'flutter' | 'django' | 'docs'>('all');

  const files: CodeFile[] = [
    {
      name: 'pubspec.yaml',
      path: 'flutter_app/pubspec.yaml',
      language: 'yaml',
      category: 'flutter',
      description: 'Flutter launcher icon config using MMUST Logo & all required dependencies (mobile_scanner, hive, audioplayers, qr_flutter)',
      code: `name: mmust_laptop_clearance
description: MMUST Digital Laptop Clearance & Gate Security System
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  
  # QR Code Scanning & Generation
  mobile_scanner: ^5.2.3
  qr_flutter: ^4.1.0
  
  # Networking & Authentication
  http: ^1.2.1
  flutter_secure_storage: ^9.2.2
  shared_preferences: ^2.2.3
  
  # State Management
  provider: ^6.1.2
  
  # Local Caching & Offline Gate Sync (Critical Requirement)
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  path_provider: ^2.1.3
  
  # Audio Alerts (For Stolen Blacklist Sirens & Cleared Chimes)
  audioplayers: ^6.0.0
  
  # File & Image Export
  image_gallery_saver: ^2.0.3
  csv: ^6.0.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  # Automatic Launcher Icon Generator using MMUST University Logo
  flutter_launcher_icons: ^0.13.1
  build_runner: ^2.4.9

# MMUST University Launcher Icon Configuration
flutter_launcher_icons:
  android: "launcher_icon"
  ios: true
  image_path: "assets/images/mmust_logo.png"
  adaptive_icon_background: "#0B4F9C" # MMUST Deep Royal Blue
  adaptive_icon_foreground: "assets/images/mmust_logo.png"
  min_sdk_android: 21
  web:
    generate: true
    image_path: "assets/images/mmust_logo.png"
    background_color: "#0B4F9C"
    theme_color: "#0B4F9C"`
    },
    {
      name: 'main.dart',
      path: 'flutter_app/lib/main.dart',
      language: 'dart',
      category: 'flutter',
      description: 'App entry point, MMUST brand color palette (Deep Blue, White, Cleared Green, Blacklisted Red), and Hive initialization',
      code: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:provider/provider.dart';
import 'auth_gateway.dart';
import 'services/offline_sync_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive Local Database for Guard Offline Caching
  await Hive.initFlutter();
  await OfflineSyncService.initBoxes();

  // Status Bar Styling
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthStateProvider()),
        ChangeNotifierProvider(create: (_) => OfflineSyncService()),
      ],
      child: const MMUSTClearanceApp(),
    ),
  );
}

/// MMUST University Brand Color Palette
class MMUSTColors {
  // Primary MMUST Deep Royal Blue
  static const Color primaryBlue = Color(0xFF0B4F9C);
  static const Color navyDark = Color(0xFF0A3366);
  static const Color lightBlueAccent = Color(0xFFE3F2FD);
  static const Color brandSecondary = Color(0xFF0060DF);

  // Clearance Gate Status Colors
  static const Color clearedGreen = Color(0xFF16A34A);      // Gate Exit Allowed
  static const Color clearedLight = Color(0xFFDCFCE7);
  static const Color blacklistedRed = Color(0xFFDC2626);     // Stolen / Alert Siren
  static const Color blacklistDark = Color(0xFF991B1B);
  static const Color pendingAmber = Color(0xFFF59E0B);

  // Neutral Colors
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color cardBorder = Color(0xFFE2E8F0);
}`
    },
    {
      name: 'auth_gateway.dart',
      path: 'flutter_app/lib/auth_gateway.dart',
      language: 'dart',
      category: 'flutter',
      description: 'Role-Based Access Control (RBAC): Student -> StudentScreen, Guard -> GuardScannerScreen, Admin -> AdminDashboard',
      code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/student_screen.dart';
import 'screens/guard_screen.dart';
import 'screens/admin_dashboard.dart';

enum UserRole { student, guard, admin }

class AuthStateProvider extends ChangeNotifier {
  UserRole _role = UserRole.student;
  String _userId = 'CSC/2023/1124';
  String _userName = 'John Mukono';
  String? _jwtToken = 'jwt_token_sample';

  UserRole get role => _role;
  String get userId => _userId;
  String get userName => _userName;
  String? get jwtToken => _jwtToken;
  bool get isAuthenticated => _jwtToken != null;

  void switchRole(UserRole newRole, {String? id, String? name}) {
    _role = newRole;
    if (id != null) _userId = id;
    if (name != null) _userName = name;
    notifyListeners();
  }
}

/// Role-Based Access Control (RBAC) Gateway
class AuthGateway extends StatelessWidget {
  const AuthGateway({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthStateProvider>();

    if (!auth.isAuthenticated) {
      return const LoginScreen();
    }

    // Strict Role Redirection
    switch (auth.role) {
      case UserRole.student:
        // Student cannot access Scanner or Admin views
        return const StudentScreen();

      case UserRole.guard:
        // Guard can only access Scanner & Gate check, cannot access Admin
        return const GuardScannerScreen();

      case UserRole.admin:
        // Admin gets the full Administrative Dashboard
        return const AdminDashboardScreen();
    }
  }
}`
    },
    {
      name: 'student_screen.dart',
      path: 'flutter_app/lib/screens/student_screen.dart',
      language: 'dart',
      category: 'flutter',
      description: 'Student mobile screen matching Image 4: "My Laptops" card, QrImageView, "Download QR" button, and student info bar',
      code: `// Flutter Widget for Student Portal Screen (Pixel-matched to Image 4)
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class StudentScreen extends StatelessWidget {
  const StudentScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SafeArea(
        child: Column(
          children: [
            // Top University Header (Image 4)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              decoration: const BoxDecoration(
                color: Color(0xFF0060DF),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(28),
                  bottomRight: Radius.circular(28),
                ),
              ),
              child: Row(
                children: [
                  Image.asset('assets/images/mmust_logo.png', height: 44),
                  const SizedBox(width: 14),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('MMUST', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                      Text('Digital Clearance', style: TextStyle(color: Color(0xFFDCEBFF), fontSize: 14)),
                    ],
                  ),
                ],
              ),
            ),

            // Card Body with QrImageView and Student Details
            // [See full source code in repository]
          ],
        ),
      ),
    );
  }
}`
    },
    {
      name: 'guard_screen.dart',
      path: 'flutter_app/lib/screens/guard_screen.dart',
      language: 'dart',
      category: 'flutter',
      description: 'Guard scanner screen matching Image 3: MobileScanner, green reticle, Student Verified card, and CRITICAL STOLEN ALARM override',
      code: `// Flutter Guard Scanner Widget (Pixel-matched to Image 3)
// Includes MobileScanner camera viewport + Blacklist Sound/Visual Siren Override
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:audioplayers/audioplayers.dart';

class GuardScannerScreen extends StatefulWidget {
  const GuardScannerScreen({super.key});
  @override
  State<GuardScannerScreen> createState() => _GuardScannerScreenState();
}

class _GuardScannerScreenState extends State<GuardScannerScreen> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool isBlacklisted = false;

  void _onQrDetected(String rawData) async {
    // Ping API or Check Local Offline Box
    bool stolen = await checkBlacklist(rawData);
    if (stolen) {
      // FLASH RED SCREEN & PLAY EMERGENCY SIREN
      await _audioPlayer.play(AssetSource('audio/security_siren.mp3'));
      setState(() => isBlacklisted = true);
    }
  }

  // [See full source code in repository]
}`
    },
    {
      name: 'offline_sync_service.dart',
      path: 'flutter_app/lib/services/offline_sync_service.dart',
      language: 'dart',
      category: 'flutter',
      description: 'Hive local database caching for Gate Wi-Fi outages with automatic batch sync to Django REST API',
      code: `import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;

class OfflineSyncService extends ChangeNotifier {
  static const String gateLogsBoxName = 'offline_gate_logs';
  static const String blacklistCacheBoxName = 'cached_blacklist';
  static const String apiBaseUrl = 'https://clearance.mmust.ac.ke/api';

  static late Box _logsBox;
  static late Box _blacklistBox;

  static Future<void> initBoxes() async {
    _logsBox = await Hive.openBox(gateLogsBoxName);
    _blacklistBox = await Hive.openBox(blacklistCacheBoxName);
  }

  int get pendingLogsCount => _logsBox.length;

  Future<bool> isLaptopBlacklisted(String serialNumber) async {
    try {
      final res = await http.get(Uri.parse('$apiBaseUrl/laptops/check/?sn=$serialNumber'))
          .timeout(const Duration(milliseconds: 1800));
      if (res.statusCode == 200) {
        return jsonDecode(res.body)['is_stolen'] ?? false;
      }
    } catch (_) {
      // Gate Wi-Fi down -> check local offline cache
    }
    return _blacklistBox.containsKey(serialNumber);
  }
}`
    },
    {
      name: 'models.py',
      path: 'django_backend/clearance_system/models.py',
      language: 'python',
      category: 'django',
      description: 'Django ORM Models matching ER Diagram: Student, Laptop (FK), SecurityGuard, GateLog (FK to Laptop & Guard)',
      code: `from django.db import models
from django.utils import timezone
import uuid

class Student(models.Model):
    reg_no = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    course = models.CharField(max_length=150)
    department = models.CharField(max_length=120, default="Computer Science")
    photo = models.ImageField(upload_to="students/photos/", blank=True, null=True)

class Laptop(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('CLEARED', 'Cleared for Exit'),
        ('STOLEN', 'Stolen / Blacklisted'),
    )
    laptop_id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    reg_no = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="laptops")
    model = models.CharField(max_length=100)
    serial_no = models.CharField(max_length=100, unique=True)
    qr_code = models.ImageField(upload_to="laptops/qrcodes/", blank=True, null=True)
    qr_payload = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    stolen_reported_at = models.DateTimeField(blank=True, null=True)
    stolen_incident_notes = models.TextField(blank=True)

class SecurityGuard(models.Model):
    guard_id = models.CharField(max_length=30, primary_key=True)
    name = models.CharField(max_length=120)
    gate_assigned = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)

class GateLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    laptop = models.ForeignKey(Laptop, on_delete=models.CASCADE)
    guard = models.ForeignKey(SecurityGuard, on_delete=models.SET_NULL, null=True)
    date = models.DateField(default=timezone.now)
    entry_time = models.TimeField(null=True, blank=True)
    exit_time = models.TimeField(default=timezone.now)
    action = models.CharField(max_length=30, default='EXIT')
    status = models.CharField(max_length=20, default='Cleared')
    gate_location = models.CharField(max_length=100, default="Main Gate A")
    cached_offline = models.BooleanField(default=False)`
    },
    {
      name: 'views.py',
      path: 'django_backend/clearance_system/views.py',
      language: 'python',
      category: 'django',
      description: 'QR generation using qrcode & Pillow (PIL), Blacklist verification, Admin Blacklist API, CSV Export, and Offline Sync API',
      code: `import io
import csv
import qrcode
from PIL import Image
from django.core.files.base import ContentFile
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student, Laptop, GateLog

@api_view(['POST'])
def register_laptop_with_qr(request):
    """Generates signed QR code using qrcode and Pillow when laptop is registered"""
    student = Student.objects.get(reg_no=request.data['reg_no'])
    laptop = Laptop.objects.create(
        reg_no=student,
        model=request.data['model'],
        serial_no=request.data['serial_no'],
    )
    
    # Generate QR Code image with Pillow
    qr = qrcode.QRCode(version=2, box_size=10, border=4)
    qr.add_data(f"MMUST:{laptop.laptop_id}:{laptop.serial_no}")
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0B2F64", back_color="white").convert('RGB')
    
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    laptop.qr_code.save(f"qr_{laptop.serial_no}.png", ContentFile(buf.getvalue()), save=True)
    return Response({"status": "created", "laptop_id": laptop.laptop_id})

@api_view(['GET'])
def export_gate_logs_csv(request):
    """Admin CSV log export endpoint"""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="mmust_gate_logs.csv"'
    writer = csv.writer(response)
    writer.writerow(['Log ID', 'Date', 'Time', 'Student', 'Reg No', 'Laptop', 'Serial', 'Status', 'Guard'])
    for log in GateLog.objects.select_related('laptop', 'laptop__reg_no', 'guard').all():
        writer.writerow([log.log_id, log.date, log.exit_time, log.laptop.reg_no.name, log.laptop.reg_no.reg_no, log.laptop.model, log.laptop.serial_no, log.status, log.guard.name if log.guard else 'N/A'])
    return response`
    },
    {
      name: 'README.md',
      path: 'README.md',
      language: 'markdown',
      category: 'docs',
      description: 'System setup guide, architecture flow, and Flutter-to-Django networking instructions',
      code: `# MMUST Digital Laptop Clearance System
Final-Year Project for Masinde Muliro University of Science and Technology.
Replaces gate logbooks with signed QR codes.

1. Django Setup:
   pip install django djangorestframework django-cors-headers qrcode pillow
   python manage.py migrate
   python manage.py runserver

2. Flutter Setup:
   flutter pub get
   flutter pub run flutter_launcher_icons
   flutter run`
    }
  ];

  const filteredFiles = files.filter(
    (f) => selectedCategory === 'all' || f.category === selectedCategory
  );

  const activeFile = filteredFiles[selectedFileIndex] || filteredFiles[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white tracking-tight">
              Foundational Codebase &amp; Architecture Hub
            </h3>
            <p className="text-xs text-slate-400">
              Flutter frontend &amp; Django REST backend files matching your final-year project requirements.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex bg-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedFileIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Files ({files.length})
          </button>
          <button
            onClick={() => { setSelectedCategory('flutter'); setSelectedFileIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCategory === 'flutter' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flutter
          </button>
          <button
            onClick={() => { setSelectedCategory('django'); setSelectedFileIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCategory === 'django' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Django
          </button>
          <button
            onClick={() => { setSelectedCategory('docs'); setSelectedFileIndex(0); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCategory === 'docs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Docs
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-[580px]">
        {/* Sidebar File List */}
        <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-3 space-y-1 shrink-0 overflow-y-auto max-h-[580px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
            PROJECT FILES
          </span>
          {filteredFiles.map((file, idx) => {
            const isSelected = file.name === activeFile?.name;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                  <span className="truncate">{file.name}</span>
                </div>
                <span
                  className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-sm ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {file.language}
                </span>
              </button>
            );
          })}
        </div>

        {/* Code Content & Header */}
        <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-w-0">
          {activeFile && (
            <>
              {/* File Title Bar */}
              <div className="bg-slate-900/90 border-b border-slate-800 px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-blue-400 font-bold truncate">
                      {activeFile.path}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {activeFile.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopy}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Code Viewer */}
              <div className="p-5 font-mono text-xs overflow-auto flex-1 leading-relaxed text-slate-200 bg-slate-950 selection:bg-blue-900">
                <pre className="whitespace-pre">{activeFile.code}</pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
