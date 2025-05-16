from rest_framework import serializers
from .models import Modalidade, Aula, Marcacao, Comentario, Avaliacao
from django.contrib.auth.models import User


class ModalidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidade
        fields = ('id', 'nome', 'descricao')


class AulaSerializer(serializers.ModelSerializer):
    # Para leitura: mostra o objeto Modalidade completo
    modalidade = ModalidadeSerializer(read_only=True)

    # Para escrita: aceita o nome da modalidade para criar/atualizar
    modalidade_nome = serializers.SlugRelatedField(
        queryset=Modalidade.objects.all(),
        slug_field='nome',
        write_only=True  # Só para escrita, não aparece no output
    )

    data = serializers.DateField(format="%Y-%m-%d")
    hora_inicio = serializers.TimeField(format="%H:%M")
    hora_fim = serializers.TimeField(format="%H:%M")

    class Meta:
        model = Aula
        fields = (
            'id',
            'modalidade',
            'modalidade_nome',  # campo só para input
            'data',
            'hora_inicio',
            'hora_fim',
            'max_participantes',
        )

    def create(self, validated_data):
        modalidade_nome = validated_data.pop('modalidade_nome')
        modalidade = Modalidade.objects.get(nome=modalidade_nome)
        aula = Aula.objects.create(modalidade=modalidade, **validated_data)
        return aula

    def update(self, instance, validated_data):
        modalidade_nome = validated_data.pop('modalidade_nome', None)
        if modalidade_nome:
            modalidade = Modalidade.objects.get(nome=modalidade_nome)
            instance.modalidade = modalidade
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

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
