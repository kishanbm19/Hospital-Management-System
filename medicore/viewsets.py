from rest_framework import viewsets
from .models import Hospital, Doctor, Patient, Appointment, Bloodbank, Department, Donor, VwHospitalBedSummary
from .serializer import *

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class =AppointmentSerializer

class BloodbankViewSet(viewsets.ModelViewSet):
    queryset = Bloodbank.objects.all()
    serializer_class = BloodbankSerializer

class DonorViewSet(viewsets.ModelViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer

class VwHospitalBedSummaryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VwHospitalBedSummary.objects.all()
    serializer_class = VwHospitalBedSummarySerializer