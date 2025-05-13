from django.urls import path
from . import views

urlpatterns = [
    path("api/signup/", views.signup),
    path("api/login/", views.login_view),
    path("api/logout/", views.logout_view),
    path('api/reset-password/', views.reset_password),
    path('api/user/', views.user_data),
    path('api/user/update/', views.update_user_profile),
]