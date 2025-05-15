
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_profile'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='imagem',
            field=models.ImageField(blank=True, default='imagens_perfil/default.png', null=True, upload_to='imagens_perfil/'),
        ),
    ]
