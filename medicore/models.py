# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Appointment(models.Model):
    appt_id = models.AutoField(primary_key=True)
    appt_date = models.DateField()
    appt_time = models.TimeField()
    status = models.CharField(max_length=9, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    doctor = models.ForeignKey('Doctor', models.DO_NOTHING)
    patient = models.ForeignKey('Patient', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'appointment'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Bed(models.Model):
    bed_id = models.AutoField(primary_key=True)
    ward = models.CharField(max_length=50)
    bed_number = models.CharField(max_length=10)
    bed_type = models.CharField(max_length=12, blank=True, null=True)
    status = models.CharField(max_length=11, blank=True, null=True)
    hospital = models.ForeignKey('Hospital', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'bed'
        unique_together = (('hospital', 'bed_number'),)


class Bloodbank(models.Model):
    bank_id = models.AutoField(primary_key=True)
    blood_type = models.CharField(max_length=3)
    units_available = models.IntegerField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    hospital = models.ForeignKey('Hospital', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'bloodbank'
        unique_together = (('hospital', 'blood_type'),)


class Department(models.Model):
    dept_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    hospital = models.ForeignKey('Hospital', models.DO_NOTHING)
    head_doctor = models.CharField(max_length=100, blank=True, null=True)
    floor_number = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'department'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Doctor(models.Model):
    doctor_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    speciality = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=150, blank=True, null=True)
    dept = models.ForeignKey(Department, models.DO_NOTHING)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    available_days = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'doctor'


class Donor(models.Model):
    donor_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    blood_type = models.CharField(max_length=3)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=6, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    last_donated = models.DateField(blank=True, null=True)
    hospital = models.ForeignKey('Hospital', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'donor'


class Hospital(models.Model):
    hospital_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=80)
    state = models.CharField(max_length=80)
    pincode = models.CharField(max_length=10, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'hospital'


class Patient(models.Model):
    patient_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=6, blank=True, null=True)
    blood_type = models.CharField(max_length=3, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    emergency_contact = models.CharField(max_length=15, blank=True, null=True)
    priority = models.CharField(max_length=9, blank=True, null=True)
    hospital = models.ForeignKey(Hospital, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'patient'

class VwHospitalBedSummary(models.Model):
    hospital_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=80)
    total_beds = models.IntegerField()
    available = models.IntegerField()
    occupied = models.IntegerField()
    maintenance = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'vw_hospital_bed_summary'
