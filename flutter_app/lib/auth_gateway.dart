import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/student_screen.dart';
import 'screens/guard_screen.dart';
import 'screens/admin_dashboard.dart';
import 'screens/register_screen.dart';

enum UserRole { student, guard, admin }

class AuthStateProvider extends ChangeNotifier {
  UserRole _role = UserRole.student;
  String _userId = 'CSC/2023/1124';
  String _userName = 'John Mukono';
  String? _jwtToken = 'jwt_token_sample';

  // Role Metadata
  String? _course;
  String? _laptopModel;
  String? _laptopSerial;
  String? _gateAssigned;

  UserRole get role => _role;
  String get userId => _userId;
  String get userName => _userName;
  String? get jwtToken => _jwtToken;
  bool get isAuthenticated => _jwtToken != null;

  String? get course => _course;
  String? get laptopModel => _laptopModel;
  String? get laptopSerial => _laptopSerial;
  String? get gateAssigned => _gateAssigned;

  void registerUser({
    required String id,
    required String name,
    required UserRole role,
    String? course,
    String? laptopModel,
    String? laptopSerial,
    String? gateAssigned,
  }) {
    _userId = id;
    _userName = name;
    _role = role;
    _course = course;
    _laptopModel = laptopModel;
    _laptopSerial = laptopSerial;
    _gateAssigned = gateAssigned;
    _jwtToken = 'jwt_mmust_${DateTime.now().millisecondsSinceEpoch}';
    notifyListeners();
  }

  void switchRole(UserRole newRole, {String? id, String? name}) {
    _role = newRole;
    if (id != null) _userId = id;
    if (name != null) _userName = name;
    notifyListeners();
  }

  void logout() {
    _jwtToken = null;
    notifyListeners();
  }

  void login(String id, String password, UserRole selectedRole) {
    _userId = id;
    _role = selectedRole;
    _jwtToken = 'jwt_token_${DateTime.now().millisecondsSinceEpoch}';
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
        // Guard can only access Scanner & Gate check, cannot access Admin or bulk data
        return const GuardScannerScreen();

      case UserRole.admin:
        // Admin gets the full Administrative Dashboard
        return const AdminDashboardScreen();
    }
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _idController = TextEditingController(text: 'CSC/2023/1124');
  final _passController = TextEditingController(text: 'password123');
  UserRole _selectedRole = UserRole.student;

  @override
  Widget build(BuildContext context) {
    final auth = context.read<AuthStateProvider>();

    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset('assets/images/mmust_logo.png', height: 80, errorBuilder: (_, __, ___) {
                    return const Icon(Icons.school, size: 70, color: Color(0xFF0B4F9C));
                  }),
                  const SizedBox(height: 12),
                  const Text(
                    'MMUST Digital Clearance',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0B4F9C)),
                  ),
                  const Text('Masinde Muliro University', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  const SizedBox(height: 24),
                  
                  SegmentedButton<UserRole>(
                    segments: const [
                      ButtonSegment(value: UserRole.student, label: Text('Student')),
                      ButtonSegment(value: UserRole.guard, label: Text('Guard')),
                      ButtonSegment(value: UserRole.admin, label: Text('Admin')),
                    ],
                    selected: {_selectedRole},
                    onSelectionChanged: (set) => setState(() => _selectedRole = set.first),
                  ),
                  const SizedBox(height: 20),

                  TextField(
                    controller: _idController,
                    decoration: InputDecoration(
                      labelText: _selectedRole == UserRole.student ? 'Registration No.' : 'Officer / Staff ID',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      prefixIcon: const Icon(Icons.badge),
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _passController,
                    obscureText: true,
                    decoration: InputDecoration(
                      labelText: 'Password / Portal PIN',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      prefixIcon: const Icon(Icons.lock),
                    ),
                  ),
                  const SizedBox(height: 20),

                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        auth.login(_idController.text, _passController.text, _selectedRole);
                      },
                      child: const Text('Log In to Clearance System'),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Button to Register by Role
                  TextButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const RegisterScreen()),
                      );
                    },
                    icon: const Icon(Icons.person_add),
                    label: const Text('New user? Register by Role'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
