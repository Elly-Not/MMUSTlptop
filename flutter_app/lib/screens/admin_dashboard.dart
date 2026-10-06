import 'package:flutter/material.dart';
import '../main.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final List<Map<String, dynamic>> _logs = [
    {
      'time': '09:12 AM',
      'student': 'Brian Mwangi',
      'reg': 'STU/2023/0014',
      'laptop': 'HP ProBook 450 G9',
      'sn': 'HP934821',
      'status': 'Cleared',
      'guard': 'Guard: P. Okoth'
    },
    {
      'time': '08:55 AM',
      'student': 'Sheila Atieno',
      'reg': 'STU/2022/0891',
      'laptop': 'Dell Latitude 5520',
      'sn': 'DL779102',
      'status': 'Stolen',
      'guard': 'Guard: J. Barasa'
    },
    {
      'time': '08:43 AM',
      'student': 'Kevin Otieno',
      'reg': 'STU/2024/0326',
      'laptop': 'Lenovo ThinkPad E14',
      'sn': 'LN112938',
      'status': 'Cleared',
      'guard': 'Guard: P. Okoth'
    },
    {
      'time': '08:21 AM',
      'student': 'Faith Akinyi',
      'reg': 'MMUST/2024/11903',
      'laptop': 'HP Pavilion 15',
      'sn': 'HPP-772103',
      'status': 'Cleared',
      'guard': 'Guard: R. Wanyama'
    },
    {
      'time': '07:59 AM',
      'student': 'David Kipkoech',
      'reg': 'STU/2024/0019',
      'laptop': 'HP EliteBook 840',
      'sn': 'HP220991',
      'status': 'Stolen',
      'guard': 'Guard: J. Barasa'
    },
  ];

  @override
  Widget build(BuildContext context) {
    final bool isWide = MediaQuery.of(context).size.width > 700;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('MMUST Admin Dashboard'),
        backgroundColor: MMUSTColors.primaryBlue,
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            tooltip: 'Export CSV',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Gate clearance logs exported to CSV!')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Dashboard Overview',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
            ),
            const Text(
              'Welcome back, Admin. System overview for today — 23 Sep 2026',
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 20),

            // 4 Summary Metrics (Image 5 & Image 2)
            GridView.count(
              crossAxisCount: isWide ? 4 : 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _metricCard('1240', 'Total Students', Icons.group, const Color(0xFF0060DF), const Color(0xFFE3F2FD), '▲ +12 today'),
                _metricCard('980', 'Laptops Registered', Icons.laptop_chromebook, const Color(0xFF0284C7), const Color(0xFFE0F2FE), '▲ +5 today'),
                _metricCard('56', 'Cleared Today', Icons.check_circle_outline, MMUSTColors.clearedGreen, const Color(0xFFDCFCE7), '↑ 12% today'),
                _metricCard('3', 'Blacklisted', Icons.shield_outlined, MMUSTColors.blacklistedRed, const Color(0xFFFEE2E2), 'Requires action'),
              ],
            ),
            const SizedBox(height: 28),

            // Recent Gate Logs Table
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text(
                          'Recent Gate Logs',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.file_download, size: 16),
                          label: const Text('Export CSV'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0060DF),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),

                    ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _logs.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (ctx, i) {
                        final log = _logs[i];
                        final bool isCleared = log['status'] == 'Cleared';
                        return ListTile(
                          contentPadding: const EdgeInsets.symmetric(vertical: 4),
                          leading: CircleAvatar(
                            backgroundColor: isCleared ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                            child: Icon(
                              isCleared ? Icons.check : Icons.warning,
                              color: isCleared ? MMUSTColors.clearedGreen : MMUSTColors.blacklistedRed,
                            ),
                          ),
                          title: Text(
                            '${log['student']} • ${log['laptop']}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                          subtitle: Text('${log['reg']} • SN: ${log['sn']} • ${log['guard']}'),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: isCleared ? MMUSTColors.clearedGreen : MMUSTColors.blacklistedRed,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  log['status'],
                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(log['time'], style: const TextStyle(fontSize: 10, color: Colors.grey)),
                            ],
                          ),
                        );
                      },
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

  Widget _metricCard(String val, String title, IconData icon, Color primary, Color bg, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          CircleAvatar(backgroundColor: bg, child: Icon(icon, color: primary)),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(val, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF0F172A))),
              Text(title, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
              const SizedBox(height: 4),
              Text(subtitle, style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: primary)),
            ],
          ),
        ],
      ),
    );
  }
}
