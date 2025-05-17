# urls.py
from django.urls import path
from . import views

app_name = 'database'

urlpatterns = [
    path('chats/', views.chat_list),
    path('chat/<int:chat_id>/', views.chat_detail),
    path('messages/<int:chat_id>/', views.message_list),
    path('message/<int:message_id>/', views.message_detail),
    path('chats/<int:chat_id>/participants/', views.chat_participants),
    path('chats/<int:chat_id>/remove_participant/', views.remove_participant),
    path('chats/<int:chat_id>/add_participant/', views.add_participant),
    path('chats/create_chat_without_name_avatar/', views.create_chat_without_name_avatar),

]
