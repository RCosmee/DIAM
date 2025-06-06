from django.urls import path
from . import views

urlpatterns = [
    path("api/signup/", views.signup),
    path("api/login/", views.login_view),
    path("api/logout/", views.logout_view),
    path("api/reset-password/", views.reset_password),
    path("api/user/", views.user_data),
    path("api/profile/", views.profile_view),
    path('api/user/by-email/', views.get_user_by_email),
    path('api/user/', views.current_user),
    path('api/users/', views.list_all_users),

]