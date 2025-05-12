from django.db import models
<<<<<<< Updated upstream


STATUS_CHOICES = [
    ('Online', 'Online'),
    ('Offline', 'Offline'),
]

# Questao: texto da questão e data de publicação
class Questao(models.Model):
    questao_texto = models.CharField(max_length=200)
    pub_data = models.DateTimeField('data de publicacao')
# Opcao: texto da opção e número de votos
#  chave estrangeira muitos-para-um - uma Questao pode ter várias instâncias de Opcao
class Opcao(models.Model):
    questao = models.ForeignKey(Questao, on_delete=models.CASCADE)
    opcao_texto = models.CharField(max_length=200)
    votos = models.IntegerField(default=0)
<<<<<<< Updated upstream
=======


class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    avatar = models.URLField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Offline')

    def __str__(self):
        return self.name

class Message(models.Model):
    group = models.ForeignKey(Group, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender}: {self.content[:20]}'
>>>>>>> Stashed changes
=======

class Group(models.Model):
    STATUS_CHOICES = [
        ("A", "Ativo"),
        ("I", "Inativo"),
    ]

    nome = models.CharField(max_length=100)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default="A")

    def __str__(self):
        return self.nome
>>>>>>> Stashed changes
