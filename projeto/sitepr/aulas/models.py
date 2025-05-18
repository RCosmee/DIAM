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
    participantes_atual = models.PositiveIntegerField(default=0)
    pt = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)  # Campo PT (Personal Trainer)


    def __str__(self):
        return f"{self.modalidade.nome} em {self.data} às {self.hora_inicio}"

    def foi_realizada_recentemente(self):
        agora = timezone.now().date()
        return self.data >= agora - datetime.timedelta(days=1)

    def media_avaliacoes(self):
        avaliacoes = self.comentarios.exclude(nota__isnull=True)
        if avaliacoes.exists():
            return round(sum(c.nota for c in avaliacoes) / avaliacoes.count(), 1)
        return None


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
    aula = models.ForeignKey(Aula, related_name='comentarios', on_delete=models.CASCADE)
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    texto = models.TextField(blank=True)  # texto opcional
    nota = models.PositiveSmallIntegerField()  # nota obrigatória, não aceita null nem blank
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('aula', 'autor')  # 1 comentário/avaliação por usuário

    def __str__(self):
        return f"{self.autor.username} - Aula {self.aula.id} - Nota: {self.nota}"
