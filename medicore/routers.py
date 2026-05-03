from rest_framework.routers import DefaultRouter
from django.urls import path
from .viewsets import *
from .views import home

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'blood', BloodbankViewSet)
router.register(r'donors', DonorViewSet)
router.register(r'hospital_beds', VwHospitalBedSummaryViewSet)
urlpatterns = [
    path('', home),  
] + router.urls
