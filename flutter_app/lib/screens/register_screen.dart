import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../auth_gateway.dart';
import '../main.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  UserRole _selectedRole = UserRole.student;

  // Student Fields
  final _studentNameController = TextEditingController();
  final _studentRegNoController = TextEditingController();
  final _studentPhoneController = TextEditingController(text: '+254 7');
  final _laptopModelController = TextEditingController();
  final _laptopSerialController = TextEditingController();
  String _selectedCourse = 'BSc. Computer Science';

  // Guard Fields
  final _guardNameController = TextEditingController();
  final _guardBadgeController = TextEditingController();
  String _guardGate = 'Main Gate A';
  String _guardShift = 'Day';

  // Admin Fields
  final _adminNameController = TextEditingController();
  final _adminIdController = TextEditingController();
  final _adminSecretController = TextEditingController();
  String? _adminError;

  @override
  void dispose() {
    _studentNameController.dispose();
    _studentRegNoController.dispose();
    _studentPhoneController.dispose();
    _laptopModelController.dispose();
    _laptopSerialController.dispose();
    _guardNameController.dispose();
    _guardBadgeController.dispose();
    _adminNameController.dispose();
    _adminIdController.dispose();
    _adminSecretController.dispose();
    super.dispose();
  }

  void _submitRegistration() {
    final auth = context.read<AuthStateProvider>();

    if (_selectedRole == UserRole.student) {
      if (_studentNameController.text.isEmpty || _studentRegNoController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill student name and registration number.')),
        );
        return;
      }

      auth.registerUser(
        id: _studentRegNoController.text.trim().toUpperCase(),
        name: _studentNameController.text.trim(),
        role: UserRole.student,
        course: _selectedCourse,
        laptopModel: _laptopModelController.text.trim(),
        laptopSerial: _laptopSerialController.text.trim().toUpperCase(),
      );
    } else if (_selectedRole == UserRole.guard) {
      if (_guardNameController.text.isEmpty || _guardBadgeController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill officer name and badge number.')),
        );
        return;
      }

      auth.registerUser(
        id: _guardBadgeController.text.trim().toUpperCase(),
        name: _guardNameController.text.trim(),
        role: UserRole.guard,
        gateAssigned: _guardGate,
      );
    } else if (_selectedRole == UserRole.admin) {
      if (_adminSecretController.text != 'MMUST-SEC-2026') {
        setState(() => _adminError = 'Invalid Admin Passcode (Demo: MMUST-SEC-2026)');
        return;
      }

      auth.registerUser(
        id: _adminIdController.text.trim().toUpperCase().isNotEmpty ? _adminIdController.text.trim() : 'ADM-014',
        name: _adminNameController.text.trim().isNotEmpty ? _adminNameController.text.trim() : 'Admin Officer',
        role: UserRole.admin,
      );
    }

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Register by University Role'),
        backgroundColor: MMUSTColors.primaryBlue,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Your Role',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 4),
            const Text(
              'Your assigned role dictates permissions, screen views, and security clearances.',
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 16),

            // Role Selector
            SegmentedButton<UserRole>(
              segments: const [
                ButtonSegment(
                  value: UserRole.student,
                  label: Text('Student'),
                  icon: Icon(Icons.school, size: 18),
                ),
                ButtonSegment(
                  value: UserRole.guard,
                  label: Text('Guard'),
                  icon: Icon(Icons.security, size: 18),
                ),
                ButtonSegment(
                  value: UserRole.admin,
                  label: Text('Admin'),
                  icon: Icon(Icons.admin_panel_settings, size: 18),
                ),
              ],
              selected: {_selectedRole},
              onSelectionChanged: (set) => setState(() {
                _selectedRole = set.first;
                _adminError = null;
              }),
            ),
            const SizedBox(height: 24),

            // STUDENT FORM
            if (_selectedRole == UserRole.student) ...[
              TextField(
                controller: _studentNameController,
                decoration: InputDecoration(
                  labelText: 'Student Full Name *',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.person),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _studentRegNoController,
                decoration: InputDecoration(
                  labelText: 'Registration Number * (e.g. CSC/2024/0981)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.badge),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _selectedCourse,
                decoration: InputDecoration(
                  labelText: 'Academic Program',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                items: const [
                  DropdownMenuItem(value: 'BSc. Computer Science', child: Text('BSc. Computer Science')),
                  DropdownMenuItem(value: 'BSc. Information Technology', child: Text('BSc. Information Technology')),
                  DropdownMenuItem(value: 'BSc. Electrical & Electronic Eng.', child: Text('BSc. Electrical Engineering')),
                ],
                onChanged: (val) => setState(() => _selectedCourse = val!),
              ),
              const SizedBox(height: 16),
              Card(
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: const BorderSide(color: Color(0xFFBFDBFE)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Laptop Hardware Details',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0B4F9C)),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _laptopModelController,
                        decoration: InputDecoration(
                          labelText: 'Laptop Model (e.g. HP ProBook 450 G9)',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: _laptopSerialController,
                        decoration: InputDecoration(
                          labelText: 'Hardware Serial Number (S/N) *',
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],

            // GUARD FORM
            if (_selectedRole == UserRole.guard) ...[
              TextField(
                controller: _guardNameController,
                decoration: InputDecoration(
                  labelText: 'Officer Full Name *',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.shield),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _guardBadgeController,
                decoration: InputDecoration(
                  labelText: 'Security Service / Badge ID * (e.g. G-204)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.badge),
                ),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: _guardGate,
                decoration: InputDecoration(
                  labelText: 'Assigned Gate',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
                items: const [
                  DropdownMenuItem(value: 'Main Gate A', child: Text('Main Gate A (Kakamega-Webuye Rd)')),
                  DropdownMenuItem(value: 'Engineering Gate B', child: Text('Engineering Complex Gate B')),
                  DropdownMenuItem(value: 'Rosterman Gate C', child: Text('Rosterman Gate C')),
                ],
                onChanged: (val) => setState(() => _guardGate = val!),
              ),
            ],

            // ADMIN FORM
            if (_selectedRole == UserRole.admin) ...[
              TextField(
                controller: _adminNameController,
                decoration: InputDecoration(
                  labelText: 'Staff Name *',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.admin_panel_settings),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _adminIdController,
                decoration: InputDecoration(
                  labelText: 'Staff ID (e.g. ADM-014)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.badge),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _adminSecretController,
                obscureText: true,
                decoration: InputDecoration(
                  labelText: 'Admin Authorization Passcode (Demo: MMUST-SEC-2026)',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  prefixIcon: const Icon(Icons.lock),
                  errorText: _adminError,
                ),
              ),
            ],

            const SizedBox(height: 28),

            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: _submitRegistration,
                icon: const Icon(Icons.how_to_reg),
                label: const Text('Complete Role Registration & Enter App', style: TextStyle(fontSize: 15)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _selectedRole == UserRole.student
                      ? MMUSTColors.brandSecondary
                      : _selectedRole == UserRole.guard
                          ? MMUSTColors.clearedGreen
                          : Colors.indigo,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
