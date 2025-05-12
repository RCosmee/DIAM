from django.db import models

# Opções de status usadas pelo modelo Group com avatar
STATUS_CHOICES_EXT = [
    ('Online', 'Online'),
    ('Offline', 'Offline'),
]

# Opções de status usadas pelo outro modelo Group
STATUS_CHOICES_SIMPLE = [
    ('A', 'Ativo'),
    ('I', 'Inativo'),
]

# Questao: texto da questão e data de publicação
class Questao(models.Model):
    questao_texto = models.CharField(max_length=200)
    pub_data = models.DateTimeField('data de publicacao')

# Opcao: texto da opção e número de votos
class Opcao(models.Model):
    questao = models.ForeignKey(Questao, on_delete=models.CASCADE)
    opcao_texto = models.CharField(max_length=200)
    votos = models.IntegerField(default=0)

# Group com avatar e status Online/Offline
class Group(models.Model):
    name = models.CharField(max_length=100, unique=True)
    avatar = models.URLField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES_EXT, default='Offline')

    def __str__(self):
        return self.name

# Message associada a um Group
class Message(models.Model):
    group = models.ForeignKey(Group, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender}: {self.content[:20]}'

# Se você preferir usar o modelo Group simples com status A/I:
# Substitua o modelo acima por este:

# class Group(models.Model):
#     nome = models.CharField(max_length=100)
#     status = models.CharField(max_length=1, choices=STATUS_CHOICES_SIMPLE, default="A")
# 
#     def __str__(self):
#         return self.nome
