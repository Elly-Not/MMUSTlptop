import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;

/// Guard Offline Mode & Caching Service
/// Solves requirement 5: Guards can scan even when MMUST Gate Wi-Fi is down.
class OfflineSyncService extends ChangeNotifier {
  static const String gateLogsBoxName = 'offline_gate_logs';
  static const String blacklistCacheBoxName = 'cached_blacklist';
  static const String apiBaseUrl = 'https://api.clearance.mmust.ac.ke/api';

  static late Box _logsBox;
  static late Box _blacklistBox;

  static Future<void> initBoxes() async {
    _logsBox = await Hive.openBox(gateLogsBoxName);
    _blacklistBox = await Hive.openBox(blacklistCacheBoxName);

    // Seed default known blacklisted laptops for offline verification
    if (_blacklistBox.isEmpty) {
      await _blacklistBox.putAll({
        'DL779102': {'model': 'Dell Latitude 5520', 'reason': 'Library theft report OB/12'},
        'HP220991': {'model': 'HP EliteBook 840', 'reason': 'Hostel Hall 3 burglary report'},
      });
    }
  }

  int get pendingLogsCount => _logsBox.length;

  /// Check if laptop is blacklisted (checks local cache if offline, pings API if online)
  Future<bool> isLaptopBlacklisted(String serialNumber) async {
    try {
      // Attempt quick ping to Django REST API
      final res = await http.get(
        Uri.parse('$apiBaseUrl/laptops/check-blacklist/?serial=$serialNumber'),
      ).timeout(const Duration(milliseconds: 1800));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final bool isStolen = data['is_stolen'] ?? false;
        if (isStolen) {
          await _blacklistBox.put(serialNumber, {'model': data['model'], 'reason': data['reason']});
        }
        return isStolen;
      }
    } catch (_) {
      // Gate Wi-Fi is down -> fallback to local cached blacklist
    }

    return _blacklistBox.containsKey(serialNumber);
  }

  /// Store gate clearance action locally or post directly
  Future<void> cacheOrUploadLog(Map<String, dynamic> logPayload) async {
    try {
      final res = await http.post(
        Uri.parse('$apiBaseUrl/gate-logs/create/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(logPayload),
      ).timeout(const Duration(milliseconds: 1800));

      if (res.statusCode != 201) {
        throw Exception('Server rejected log');
      }
    } catch (_) {
      // Internet down -> save to local Hive box
      await _logsBox.add(logPayload);
      notifyListeners();
    }
  }

  /// Sync all queued logs when Gate Wi-Fi returns
  Future<bool> syncPendingLogs() async {
    if (_logsBox.isEmpty) return true;

    try {
      final List<dynamic> queuedLogs = _logsBox.values.toList();
      final res = await http.post(
        Uri.parse('$apiBaseUrl/guard/sync-offline-logs/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'logs': queuedLogs}),
      );

      if (res.statusCode == 200 || res.statusCode == 201) {
        await _logsBox.clear();
        notifyListeners();
        return true;
      }
    } catch (_) {
      // Still offline
    }
    return false;
  }
}
