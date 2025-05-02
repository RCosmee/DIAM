from django.db import models

# Users e grupos
class Chat(models.Model):
    name = models.CharField(max_length=100, unique=True)
    avatar = models.URLField()
    status = models.CharField(max_length=10, choices=[('online', 'Online'),('offline', 'Offline')])

    def __str__(self):
        return self.name


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField()
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender}: {self.content[:20]}'