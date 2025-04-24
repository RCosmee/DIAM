from django.db import models 
from django.utils import timezone 
from votacao.models import Questao, Opcao 
from datetime import timedelta

#a
def listar_questoes():
    questoes = Questao.objects.all()  # Buscar todas as questões na BD
    for questao in questoes:
        print(questao.questao_texto)

#b
def listar_opcoes_gostas_de():
    questoes = Questao.objects.filter(questao_texto__startswith="Gostas de")
    for questao in questoes:
        opcoes = Opcao.objects.filter(questao=questao)
        for opcao in opcoes:
            print(opcao.opcao_texto)
        

#c        
def listar_opcoes_gostas_de2():
    questoes = Questao.objects.filter(questao_texto__startswith="Gostas de")
    for questao in questoes:
        opcoes = Opcao.objects.filter(questao=questao, votos__gt=2)
        for opcao in opcoes:
            print(opcao.opcao_texto)


#d
def listar_questoes_ultimos_tres_anos():
    tres_anos_atras = timezone.now() - timedelta(days=3*365)
    questoes = Questao.objects.filter(pub_data__gte=tres_anos_atras)
    for questao in questoes:
        print(questao.questao_texto, questao.pub_data)      

#e
def total_votos():
    total = Opcao.objects.aggregate(total_votos=models.Sum('votos'))['total_votos'] or 0
    print(total)        

#f    
def opcao_mais_votada_por_questao():
    questoes = Questao.objects.all()
    for questao in questoes:
        opcao_mais_votada = questao.opcao_set.order_by('-votos').first()
        if opcao_mais_votada:
            print(f"Questão: {questao.questao_texto} -> Opção mais votada: {opcao_mais_votada.opcao_texto} ({opcao_mais_votada.votos} votos)")
        else:
            print(f"Questão: {questao.questao_texto} -> Sem opções disponíveis")


#Para correr e testar
listar_questoes()
listar_opcoes_gostas_de()
listar_opcoes_gostas_de2()
listar_questoes_ultimos_tres_anos()
total_votos()
opcao_mais_votada_por_questao()