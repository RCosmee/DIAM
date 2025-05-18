from rest_framework import serializers
from .models import Modalidade, Aula, Marcacao, Comentario, Avaliacao
from django.contrib.auth.models import User


class ModalidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidade
        fields = ['id', 'nome', 'descricao']


class AulaSerializer(serializers.ModelSerializer):
    # Modalidade será exibida como objeto completo na leitura
    modalidade = ModalidadeSerializer(read_only=True)

    # Para escrita, permite receber o nome da modalidade para associar
    modalidade_nome = serializers.SlugRelatedField(
        queryset=Modalidade.objects.all(),
        slug_field='nome',
        write_only=True
    )

    data = serializers.DateField(format="%Y-%m-%d")
    hora_inicio = serializers.TimeField(format="%H:%M")
    hora_fim = serializers.TimeField(format="%H:%M")
    participantes_atual = serializers.IntegerField(read_only=True)

    class Meta:
        model = Aula
        fields = [
            'id',
            'modalidade',
            'modalidade_nome',
            'data',
            'hora_inicio',
            'hora_fim',
            'max_participantes',
            'participantes_atual',
        ]

    def create(self, validated_data):
        modalidade = validated_data.pop('modalidade_nome')
        aula = Aula.objects.create(modalidade=modalidade, **validated_data)
        return aula

    def update(self, instance, validated_data):
        modalidade = validated_data.pop('modalidade_nome', None)
        if modalidade:
            instance.modalidade = modalidade
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class MarcacaoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all())

    aula_detalhes = AulaSerializer(source='aula', read_only=True)
    user_nome = serializers.StringRelatedField(source='user', read_only=True)

    class Meta:
        model = Marcacao
        fields = [
            'id',
            'aula',
            'aula_detalhes',
            'user',
            'user_nome',
            'marcada_em',
            'status',
        ]
        read_only_fields = ['marcada_em']


class ComentarioSerializer(serializers.ModelSerializer):
    autor = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all())
    autor_nome = serializers.StringRelatedField(source='autor', read_only=True)

    class Meta:
        model = Comentario
        fields = [
            'id',
            'aula',
            'autor',
            'autor_nome',
            'texto',
            'criado_em',
        ]
        read_only_fields = ['criado_em']


class AvaliacaoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    aula = serializers.PrimaryKeyRelatedField(queryset=Aula.objects.all())

    user_nome = serializers.StringRelatedField(source='user', read_only=True)

    class Meta:
        model = Avaliacao
        fields = [
            'id',
            'aula',
            'user',
            'user_nome',
            'nota',
            'comentario',
            'criado_em',
        ]
        read_only_fields = ['criado_em']
