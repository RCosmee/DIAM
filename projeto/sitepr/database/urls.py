# database/urls.py
from django.urls import path
from . import views

app_name = 'database'

urlpatterns = [
    path('chats/', views.chat_list),
    path('chat/<int:chat_id>/', views.chat_detail),
    path('messages/<int:chat_id>/', views.message_list),
    path('message/<int:message_id>/', views.message_detail),
]
