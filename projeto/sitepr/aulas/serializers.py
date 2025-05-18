from rest_framework import serializers
from .models import Modalidade, Aula, Marcacao, Comentario
from django.contrib.auth.models import User


class ModalidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modalidade
        fields = ['id', 'nome', 'descricao']


from django.contrib.auth.models import User

class AulaSerializer(serializers.ModelSerializer):
    # Modalidade será exibida como objeto completo na leitura
    modalidade = ModalidadeSerializer(read_only=True)
    pt = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    # Para escrita, permite receber o nome da modalidade para associar
    modalidade_nome = serializers.SlugRelatedField(
        queryset=Modalidade.objects.all(),
        slug_field='nome',
        write_only=True
    )

    # Para escrita, permite receber o PT (Personal Trainer) pelo ID do usuário
    pt_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='pt', write_only=True, required=False, allow_null=True)

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
            'pt',  # Adiciona o campo pt para leitura
            'pt_id',  # Adiciona o campo pt_id para escrita
            'data',
            'hora_inicio',
            'hora_fim',
            'max_participantes',
            'participantes_atual',
        ]

    def create(self, validated_data):
        modalidade = validated_data.pop('modalidade_nome')
        pt = validated_data.pop('pt', None)  # Pega o PT, se fornecido
        aula = Aula.objects.create(modalidade=modalidade, pt=pt, **validated_data)
        return aula

    def update(self, instance, validated_data):
        modalidade = validated_data.pop('modalidade_nome', None)
        if modalidade:
            instance.modalidade = modalidade
        
        pt = validated_data.pop('pt', None)
        if pt is not None:
            instance.pt = pt

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
    nota = serializers.IntegerField(min_value=1, max_value=5) 
    texto = serializers.CharField(allow_blank=True, required=False)
    criado_em = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comentario
        fields = [
            'id',
            'aula',
            'autor',
            'autor_nome',
            'texto',
            'nota',
            'criado_em',
        ]
        read_only_fields = ['criado_em']
