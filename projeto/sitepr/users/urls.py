from django.urls import path
from . import views
from .views import get_user_by_email

urlpatterns = [
    path("api/signup/", views.signup),
    path("api/login/", views.login_view),
    path("api/logout/", views.logout_view),
    path("api/reset-password/", views.reset_password),
    path("api/user/", views.user_data),
    path("api/profile/", views.profile_view),
    path('api/user/by-email/', get_user_by_email),
]
