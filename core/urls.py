
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .token_claims import MyTokenObtainPairSerializer
from .views import RegisterView, TimeSlotViewSet, BookingViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"slots", TimeSlotViewSet, basename="slots")
router.register(r"bookings", BookingViewSet, basename="bookings")

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("", include(router.urls)),
]
