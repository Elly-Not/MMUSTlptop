import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:provider/provider.dart';
import '../services/offline_sync_service.dart';
import '../main.dart';

class GuardScannerScreen extends StatefulWidget {
  const GuardScannerScreen({super.key});

  @override
  State<GuardScannerScreen> createState() => _GuardScannerScreenState();
}

class _GuardScannerScreenState extends State<GuardScannerScreen> {
  final MobileScannerController _scannerController = MobileScannerController();
  final AudioPlayer _audioPlayer = AudioPlayer();

  // Scanned Student State (Defaults to Sarah Otieno matching Image 3)
  String studentName = 'Sarah Otieno';
  String studentId = 'CSC/2022/0879';
  String laptopModel = 'HP ProBook 450 G9';
  String serialNumber = 'HP450G9-KEN-8821';
  String studentPhotoUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';
  bool isCleared = true;
  bool isBlacklisted = false;
  String stolenIncidentReason = '';
  String lastLoggedTime = '10:24 AM • 23 Sep 2026';

  @override
  void dispose() {
    _scannerController.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }

  // Handle incoming QR scan
  void _processQrCode(String rawPayload) async {
    try {
      final Map<String, dynamic> data = jsonDecode(rawPayload);
      final serial = data['sn'] ?? '';
      final offlineService = context.read<OfflineSyncService>();

      // 1. Check Blacklist (Online API or Local Cached Blacklist DB)
      final bool isStolen = await offlineService.isLaptopBlacklisted(serial);

      setState(() {
        studentName = data['name'] ?? 'Unknown Student';
        studentId = data['reg'] ?? 'STU/UNKNOWN';
        laptopModel = data['model'] ?? 'Unknown Laptop';
        serialNumber = serial;
        isBlacklisted = isStolen;
        isCleared = !isStolen;
        stolenIncidentReason = isStolen ? 'Device reported stolen. Impound immediately.' : '';
      });

      if (isStolen) {
        // TRIGGER CRITICAL AUDITORY & VISUAL SIREN
        await _audioPlayer.play(AssetSource('audio/security_siren.mp3'));
      } else {
        await _audioPlayer.play(AssetSource('audio/success_chime.mp3'));
      }
    } catch (_) {
      // Handle non-JSON or standard barcode
    }
  }

  void _recordGateExit(bool allowed) async {
    final offlineService = context.read<OfflineSyncService>();
    final now = DateTime.now();

    await offlineService.cacheOrUploadLog({
      'laptop_sn': serialNumber,
      'student_id': studentId,
      'guard_id': 'G204',
      'action': allowed ? 'EXIT_ALLOWED' : 'EXIT_DENIED',
      'timestamp': now.toIso8601String(),
    });

    setState(() {
      lastLoggedTime = 'Action logged • ${now.hour}:${now.minute.toString().padLeft(2, '0')}';
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(allowed ? 'Exit Cleared & Logged!' : 'Exit Denied & Flagged to Security!'),
        backgroundColor: allowed ? MMUSTColors.clearedGreen : MMUSTColors.blacklistedRed,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // Header (Matching Image 3)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios, color: Colors.white, size: 20),
                        onPressed: () => Navigator.maybePop(context),
                      ),
                      const Expanded(
                        child: Column(
                          children: [
                            Text(
                              'Security Guard Interface',
                              style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              'MMUST Digital Laptop Clearance System',
                              style: TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 40),
                    ],
                  ),
                ),

                // Live Camera View Area (Matching Image 3)
                Expanded(
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      MobileScanner(
                        controller: _scannerController,
                        onDetect: (capture) {
                          final List<Barcode> barcodes = capture.barcodes;
                          for (final barcode in barcodes) {
                            if (barcode.rawValue != null) {
                              _processQrCode(barcode.rawValue!);
                              break;
                            }
                          }
                        },
                      ),

                      // "LIVE SCANNING" indicator pill
                      Positioned(
                        top: 16,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.65),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.greenAccent.withOpacity(0.6)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.fiber_manual_record, color: Colors.greenAccent, size: 10),
                              SizedBox(width: 6),
                              Text(
                                'LIVE SCANNING',
                                style: TextStyle(color: Colors.greenAccent, fontSize: 10, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Green Scanner Reticle Box with Corners
                      Container(
                        width: 250,
                        height: 250,
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.greenAccent.withOpacity(0.4), width: 2),
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Stack(
                          children: [
                            // 4 Corner Brackets
                            Positioned(top: 0, left: 0, child: _corner(true, true)),
                            Positioned(top: 0, right: 0, child: _corner(true, false)),
                            Positioned(bottom: 0, left: 0, child: _corner(false, true)),
                            Positioned(bottom: 0, right: 0, child: _corner(false, false)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                // Bottom Verification Card (Matching Image 3)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.fromLTRB(20, 14, 20, 18),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(32),
                      topRight: Radius.circular(32),
                    ),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      // Pull pill
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                      ),
                      const SizedBox(height: 12),

                      // Status Header
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 20),
                              SizedBox(width: 8),
                              Text(
                                'Scanning... QR detected',
                                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: MMUSTColors.clearedGreen,
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: const Row(
                              children: [
                                Text('Cleared', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                SizedBox(width: 4),
                                Icon(Icons.check_circle, color: Colors.white, size: 12),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Student Details Card
                      Row(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundImage: NetworkImage(studentPhotoUrl),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Student: $studentName',
                                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'ID: $studentId',
                                  style: const TextStyle(fontSize: 12, color: Colors.grey, fontFamily: 'monospace'),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.laptop, size: 15, color: Colors.black54),
                                    const SizedBox(width: 4),
                                    Text('Laptop: $laptopModel', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                                  ],
                                ),
                                const SizedBox(height: 3),
                                const Row(
                                  children: [
                                    Icon(Icons.verified, size: 13, color: Color(0xFF16A34A)),
                                    SizedBox(width: 4),
                                    Text('Verified • Cleared to exit', style: TextStyle(fontSize: 11, color: Color(0xFF16A34A))),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 18),

                      // Primary Buttons: Allow Exit & Deny Exit
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: ElevatedButton.icon(
                          onPressed: () => _recordGateExit(true),
                          icon: const Icon(Icons.check_circle, color: Colors.white),
                          label: const Text('Allow Exit', style: TextStyle(fontSize: 16)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF16A34A),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),

                      Text(
                        lastLoggedTime,
                        style: const TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            // CRITICAL BLACKLIST SCREEN OVERRIDE (Image 3 Blacklist Alert requirement)
            if (isBlacklisted)
              Positioned.fill(
                child: Container(
                  color: Colors.red.shade700,
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.warning_amber_rounded, size: 80, color: Colors.white),
                      const SizedBox(height: 16),
                      const Text(
                        'SECURITY ALERT: STOLEN LAPTOP!',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        stolenIncidentReason,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.white70, fontSize: 13),
                      ),
                      const SizedBox(height: 24),
                      Card(
                        color: Colors.white,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            children: [
                              Text('Reported Owner: $studentName', style: const TextStyle(fontWeight: FontWeight.bold)),
                              Text('Student ID: $studentId'),
                              Text('Laptop S/N: $serialNumber', style: const TextStyle(fontFamily: 'monospace')),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        height: 52,
                        child: ElevatedButton(
                          onPressed: () {
                            _recordGateExit(false);
                            setState(() => isBlacklisted = false);
                          },
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.black),
                          child: const Text('IMPOUND DEVICE & ALERT CHIEF SECURITY'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _corner(bool top, bool left) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        border: Border(
          top: top ? const BorderSide(color: Colors.greenAccent, width: 4) : BorderSide.none,
          bottom: !top ? const BorderSide(color: Colors.greenAccent, width: 4) : BorderSide.none,
          left: left ? const BorderSide(color: Colors.greenAccent, width: 4) : BorderSide.none,
          right: !left ? const BorderSide(color: Colors.greenAccent, width: 4) : BorderSide.none,
        ),
      ),
    );
  }
}
