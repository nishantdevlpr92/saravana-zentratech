from django.urls import path, include
from apiv1 import views
from apiv1 import auth
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = DefaultRouter()

# Chat router
router.register(r'chats', views.ChatViewSet)

urlpatterns = [
    # Auth
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("register/", name="register", view=auth.RegisterView.as_view()),

    path('', include(router.urls)),
]

