from django.db import models
from django.utils import timezone
import uuid

class Student(models.Model):
    """
    Masinde Muliro University Student Profile
    ER Diagram: Student Table (PK: reg_no)
    """
    reg_no = models.CharField(max_length=50, primary_key=True, help_text="e.g. CSC/2023/1124")
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    course = models.CharField(max_length=150, help_text="e.g. BSc. Computer Science")
    department = models.CharField(max_length=120, default="Computer Science")
    id_number = models.CharField(max_length=20, blank=True, null=True, help_text="National ID / Passport")
    photo = models.ImageField(upload_to="students/photos/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.reg_no})"


class Laptop(models.Model):
    """
    Registered Student Laptop Computer
    ER Diagram: Laptop Table (FK: reg_no -> Student)
    """
    STATUS_CHOICES = (
        ('ACTIVE', 'Active / In Possession'),
        ('CLEARED', 'Cleared for Gate Exit'),
        ('STOLEN', 'Stolen / Blacklisted'),
        ('PENDING', 'Pending Physical Inspection'),
    )

    laptop_id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4, editable=False)
    reg_no = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE, 
        related_name="laptops", 
        db_column="reg_no"
    )
    model = models.CharField(max_length=100, help_text="e.g. HP ProBook 450 G9")
    brand = models.CharField(max_length=50, default="HP")
    serial_no = models.CharField(max_length=100, unique=True, help_text="Hardware Serial Number")
    photo = models.ImageField(upload_to="laptops/photos/", blank=True, null=True)
    qr_code = models.ImageField(upload_to="laptops/qrcodes/", blank=True, null=True)
    qr_payload = models.TextField(blank=True, help_text="Signed JSON payload inside QR code")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    
    # Incident report fields if stolen
    stolen_reported_at = models.DateTimeField(blank=True, null=True)
    stolen_incident_notes = models.TextField(blank=True, help_text="Police OB No. and theft location")
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.model} [{self.serial_no}] - {self.reg_no.name}"


class SecurityGuard(models.Model):
    """
    MMUST Campus Security Officer
    ER Diagram: SecurityGuard Table
    """
    guard_id = models.CharField(max_length=30, primary_key=True, help_text="e.g. G204")
    name = models.CharField(max_length=120)
    gate_assigned = models.CharField(max_length=100, help_text="e.g. Main Gate A, Engineering Gate B")
    phone = models.CharField(max_length=20)
    shift = models.CharField(max_length=20, choices=(('DAY', 'Day Shift'), ('NIGHT', 'Night Shift')), default='DAY')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.gate_assigned})"


class GateLog(models.Model):
    """
    Real-Time Gate Clearance Logs
    ER Diagram: GateLog Table (FK: laptop_id, guard_id)
    """
    STATUS_CHOICES = (
        ('Cleared', 'Cleared'),
        ('Stolen', 'Stolen / Blocked'),
        ('Denied', 'Denied'),
        ('Pending', 'Pending'),
    )
    ACTION_CHOICES = (
        ('EXIT', 'Gate Exit'),
        ('ENTRY', 'Gate Entry'),
        ('BLACKLIST_INTERCEPT', 'Stolen Intercept'),
        ('DENIED', 'Inspection Denied'),
    )

    log_id = models.AutoField(primary_key=True)
    laptop = models.ForeignKey(
        Laptop, 
        on_delete=models.CASCADE, 
        related_name="logs",
        db_column="laptop_id"
    )
    guard = models.ForeignKey(
        SecurityGuard, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name="logs",
        db_column="guard_id"
    )
    date = models.DateField(default=timezone.now)
    entry_time = models.TimeField(null=True, blank=True)
    exit_time = models.TimeField(default=timezone.now)
    action = models.CharField(max_length=30, choices=ACTION_CHOICES, default='EXIT')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Cleared')
    gate_location = models.CharField(max_length=100, default="Main Gate A")
    cached_offline = models.BooleanField(default=False, help_text="Logged during Wi-Fi outage")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.laptop.model} at {self.gate_location} ({self.status})"
