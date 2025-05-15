from django.db import models
from django.contrib.auth.models import User

class Atleta(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # outros campos específicos, se necessário
    #altura = models.FloatField(null=True, blank=True)

class PersonalTrainer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # outros campos específicos, se necessário
    #especialidade = models.CharField(max_length=100, blank=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='imagens_perfil/', default='imagens_perfil/default.png', blank=True, null=True)

  