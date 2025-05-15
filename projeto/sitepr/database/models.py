from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)  # avatar do grupo
    participants = models.ManyToManyField(User, related_name='chats')  # lista de usuários
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes

>>>>>>> Stashed changes
    def __str__(self):
        return self.name or "Chat sem nome"


class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        return f'{self.sender.username}: {self.content[:20]}'
=======
        return f'{self.sender.username}: {self.content[:20]}'
>>>>>>> Stashed changes
=======
        return f'{self.sender.username}: {self.content[:20]}'
>>>>>>> Stashed changes
