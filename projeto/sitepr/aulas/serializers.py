from rest_framework import serializers
from .models import Modalidade, Aula, Marcacao, Comentario, Avaliacao
from django.contrib.auth.models import User


class ModalidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidade
        fields = ('id', 'nome', 'descricao')


class AulaSerializer(serializers.ModelSerializer):
    modalidade = ModalidadeSerializer(read_only=True)

    class Meta:
        model = Aula
        fields = (
            'id',
            'modalidade',
            'data',
            'hora_inicio',
            'hora_fim',
            'max_participantes',
            'descricao'
        )


class MarcacaoSerializer(serializers.ModelSerializer):
    atleta = serializers.StringRelatedField(read_only=True)
    aula = serializers.StringRelatedField(read_only=True)

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
    autor = serializers.StringRelatedField(read_only=True)
    aula = serializers.StringRelatedField(read_only=True)

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
    atleta = serializers.StringRelatedField(read_only=True)
    aula = serializers.StringRelatedField(read_only=True)

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
