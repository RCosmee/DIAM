# Generated by Django 5.2 on 2025-05-15 16:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('aulas', '0002_rename_data_avaliacao_criado_em_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aula',
            name='descricao',
        ),
    ]
