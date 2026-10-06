import 'package:flutter/material.dart';
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
}

class MMUSTClearanceApp extends StatelessWidget {
  const MMUSTClearanceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MMUST Digital Laptop Clearance System',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: MMUSTColors.background,
        colorScheme: ColorScheme.fromSeed(
          seedColor: MMUSTColors.primaryBlue,
          primary: MMUSTColors.primaryBlue,
          secondary: MMUSTColors.brandSecondary,
          error: MMUSTColors.blacklistedRed,
          surface: MMUSTColors.surface,
        ),
        fontFamily: 'Roboto',
        appBarTheme: const AppBarTheme(
          backgroundColor: MMUSTColors.primaryBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: true,
          titleTextStyle: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: MMUSTColors.brandSecondary,
            foregroundColor: Colors.white,
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            textStyle: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        cardTheme: CardTheme(
          color: Colors.white,
          elevation: 2,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: MMUSTColors.cardBorder, width: 1),
          ),
        ),
      ),
      home: const AuthGateway(),
    );
  }
}
