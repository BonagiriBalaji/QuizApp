# Generated by Django 3.2 on 2022-04-20 11:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_scores_score'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='scores',
            name='score',
        ),
    ]
