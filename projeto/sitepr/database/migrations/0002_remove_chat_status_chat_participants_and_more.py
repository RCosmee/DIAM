import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='status',
        ),
        migrations.AddField(
            model_name='chat',
            name='participants',
            field=models.ManyToManyField(related_name='chats', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='chat',
            name='avatar',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='chat',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='message',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to=settings.AUTH_USER_MODEL),
        ),
    ]