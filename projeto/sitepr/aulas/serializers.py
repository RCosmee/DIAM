from rest_framework import serializers
from .models import Modalidade, Aula, Marcacao, Comentario, Avaliacao
from django.contrib.auth.models import User


class ModalidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidade
        fields = ('id', 'nome', 'descricao')


class AulaSerializer(serializers.ModelSerializer):
    modalidade = serializers.SlugRelatedField(
        queryset=Modalidade.objects.all(),
        slug_field='nome'  # Usa o campo 'nome' para identificar a modalidade
    )
    data = serializers.DateField(format="%Y-%m-%d")  # Use formato ISO para entrada/saída
    hora_inicio = serializers.TimeField(format="%H:%M")
    hora_fim = serializers.TimeField(format="%H:%M")

    class Meta:
        model = Aula
        fields = (
            'id',
            'modalidade',
            'data',
            'hora_inicio',
            'hora_fim',
            'max_participantes',
        )

class MarcacaoSerializer(serializers.ModelSerializer):
    atleta = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all())

    class Meta:
        model = Marcacao
        fields = (
            'id',
            'aula',
            'atleta',
            'marcada_em',
            'status'
        )

class ComentarioSerializer(serializers.ModelSerializer):
    autor = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all())

    class Meta:
        model = Comentario
        fields = (
            'id',
            'aula',
            'autor',
            'texto',
            'criado_em'
        )

class AvaliacaoSerializer(serializers.ModelSerializer):
    atleta = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all())

    class Meta:
        model = Avaliacao
        fields = (
            'id',
            'aula',
            'atleta',
            'nota',
            'comentario',
            'criado_em'
        )
