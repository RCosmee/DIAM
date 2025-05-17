from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
import datetime

class Modalidade(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField()

    def __str__(self):
        return self.nome


class Aula(models.Model):
    modalidade = models.ForeignKey(Modalidade, on_delete=models.CASCADE)
    data = models.DateField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    max_participantes = models.PositiveIntegerField()
    

    def __str__(self):
        return f"{self.modalidade.nome} em {self.data} às {self.hora_inicio}"

    def foi_realizada_recentemente(self):
        agora = timezone.now().date()
        return self.data >= agora - datetime.timedelta(days=1)



class Marcacao(models.Model):
    STATUS_CHOICES = [
        ('por_marcar', 'Por Marcar'),
        ('marcada', 'Marcada'),
        ('cancelada', 'Cancelada'),
    ]
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    marcada_em = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='por_marcar')

    class Meta:
        unique_together = ('aula', 'user')

    def __str__(self):
        return f"{self.user.username} - {self.aula} ({self.status})"

class Comentario(models.Model):
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    texto = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentário por {self.autor.username} em {self.aula}"


class Avaliacao(models.Model):
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE)
    atleta = models.ForeignKey(User, on_delete=models.CASCADE)
    nota = models.IntegerField()
    comentario = models.TextField(blank=True, null=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Avaliação {self.nota}/5 por {self.atleta.username} em {self.aula}"
