from rest_framework.routers import DefaultRouter
from django.urls import path
from .viewsets import *
from .views import home

router = DefaultRouter()
router.register(r'hospitals', HospitalViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'blood', BloodbankViewSet)
urlpatterns = [
    path('', home),  
] + router.urls

