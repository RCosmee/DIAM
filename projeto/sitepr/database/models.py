from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField  
from django.db.models import JSONField 

class Chat(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    avatar = models.CharField(blank=True, null=True)  # avatar do grupo
    participants = JSONField(default=list) 

    def __str__(self):
        return self.name or "Chat sem nome"


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.IntegerField()  # id do usuário que enviou a mensagem
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'User {self.sender}: {self.content[:20]}'