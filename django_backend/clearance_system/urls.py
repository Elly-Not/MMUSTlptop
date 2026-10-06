from django.urls import path
from . import views

urlpatterns = [
    # Role-based Registration Endpoints
    path('auth/register/student/', views.register_student_role, name='register_student'),
    path('auth/register/guard/', views.register_guard_role, name='register_guard'),
    path('auth/register/admin/', views.register_admin_role, name='register_admin'),

    # Student laptop registration & QR code generation
    path('laptops/register/', views.register_laptop_with_qr, name='register_laptop_qr'),
    
    # Gate scanner verification (Blacklist & clearance check)
    path('gate/verify/', views.verify_gate_scan, name='verify_gate_scan'),
    
    # Guard offline synchronization
    path('guard/sync-offline-logs/', views.sync_offline_logs, name='sync_offline_logs'),
    
    # Admin actions
    path('admin/blacklist-laptop/', views.admin_blacklist_laptop, name='admin_blacklist_laptop'),
    path('admin/export-logs-csv/', views.export_gate_logs_csv, name='export_gate_logs_csv'),
]
