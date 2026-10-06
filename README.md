# MMUST Digital Laptop Clearance & Gate Security System
**Masinde Muliro University of Science and Technology (Kakamega, Kenya)**  
*Final-Year Capstone Project — Department of Computer Science & ICT*

---

## 📌 Executive Summary
The MMUST Digital Laptop Clearance System replaces outdated paper logbooks at university gates (Main Gate A, Engineering Gate B, and Rosterman Gate C) with an automated, cryptographically signed QR-code clearance system.

### Key Capabilities
1. **Student Web & Mobile Portal**: Students register laptops with make, model, and serial numbers. The system generates high-resolution signed QR passes for gate clearance.
2. **Security Guard Scanner App**: Guards scan student QR passes in real-time. The app renders photo, student identity, and laptop details, offering **Allow Exit** and **Deny Exit** actions.
3. **Blacklist & Stolen Alarm Override**: When a reported missing laptop is scanned, the app overrides standard verification with a flashing **RED ALARM SCREEN** and an audible **Security Siren Buzzer**.
4. **Gate Offline Mode**: When campus Wi-Fi drops at the perimeter gates, the Flutter app caches clearance actions locally using **Hive / SQLite** and syncs when connectivity is restored.
5. **Admin Analytics Dashboard**: Real-time university gate logs, device statistics, instant device blacklisting, and CSV export.

---

## 🏗️ System Architecture & ER Diagram
```
+-----------------------------------------------------------------------------------+
|                           PRESENTATION LAYER                                      |
|  [Student Portal (Web/App)]   [Guard Scanner (Flutter)]   [Admin Dashboard (Web)] |
+------------------------------------------+----------------------------------------+
                                           | HTTPS REST API (JWT Authenticated)
+------------------------------------------v----------------------------------------+
|                           APPLICATION LAYER (Django)                              |
|   • Django REST API       • JWT Auth Token Service       • QR Generator (Pillow)  |
|   • Blacklist Logic Engine                               • Offline Log Sync Queue |
+------------------------------------------+----------------------------------------+
                                           | Django ORM / PostgreSQL / MySQL
+------------------------------------------v----------------------------------------+
|                                DATA LAYER                                         |
|   • Student (reg_no, name, email, phone, course, photo)                           |
|   • Laptop (laptop_id, reg_no FK, model, serial_no, qr_code, status)              |
|   • SecurityGuard (guard_id, name, gate_assigned, phone, shift)                   |
|   • GateLog (log_id, laptop_id FK, guard_id FK, entry_time, exit_time, status)    |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 How to Connect Flutter Frontend to Django Backend

### 1. Configure Django API Endpoint
In `flutter_app/lib/services/offline_sync_service.dart`, set your university server IP or domain:
```dart
// For local physical device testing on same Wi-Fi:
static const String apiBaseUrl = 'http://192.168.1.50:8000/api';

// For Android Emulator:
static const String apiBaseUrl = 'http://10.0.2.2:8000/api';

// For MMUST Production Cloud Run / Campus Server:
static const String apiBaseUrl = 'https://clearance.mmust.ac.ke/api';
```

### 2. Set Up Django Backend
```bash
cd django_backend
python3 -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers qrcode pillow
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 3. Generate MMUST Launcher Icons & Run Flutter
```bash
cd flutter_app
flutter pub get
# Automatically create Android/iOS launcher icons from MMUST logo:
flutter pub run flutter_launcher_icons
flutter run
```

---

## 🛡️ Security Architecture
- **HMAC Signatures**: QR code payloads are signed with a university secret salt, preventing forged screenshots or fake serial numbers.
- **Role-Based Routing (RBAC)**: Enforced in `auth_gateway.dart`. Students cannot view gate scanner screens or admin tables; guards cannot modify student databases.
- **Offline Persistence**: Guard app saves up to 5,000 logs in encrypted local storage (`offline_gate_logs` box) during gate power outages.
