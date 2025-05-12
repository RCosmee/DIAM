from django.urls import path
from . import views

urlpatterns = [
    path("api/signup/", views.signup),
    path("api/login/", views.login_view),
    path("api/logout/", views.logout_view),
]