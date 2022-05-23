import apiv2.wsgi

# rm core/migrations/* db.sqlite3 -rf && touch core/migrations/__init__.py && python3 manage.py makemigrations && python3 manage.py migrate

from core.models import *

from django.db.models import Q

from random import choices, randint

from time import sleep

sub_dit = {
    "user1": {
        "Python": {
            1: 0,
            2: 0,
            3: 0
        },
        "Java": {
            1: 0,
            2: 0,
            3: 0
        },
        "JavaScript": {
            1: 0,
            2: 0,
            3: 0
        }
    },
    "user2": {
        "Python": {
            1: 0,
            2: 0,
            3: 0
        },
        "Java": {
            1: 0,
            2: 0,
            3: 0
        },
        "JavaScript": {
            1: 0,
            2: 0,
            3: 0
        }
    },
    "user3": {
        "Python": {
            1: 0,
            2: 0,
            3: 0
        },
        "Java": {
            1: 0,
            2: 0,
            3: 0
        },
        "JavaScript": {
            1: 0,
            2: 0,
            3: 0
        }
    }
}

for i in range(100):
    sleep(randint(1, 10))
    uid = choices([1, 2, 3])[0]
    sub = choices(["Python", "Java", "JavaScript"])[0]
    lvl = choices([1, 2, 3])[0]
    user_score = Scores(
        user_id=uid, 
        subject=sub, 
        level=lvl,
        score=randint(1,20)
    )
    user_score.save()
    sub_dit[f"user{uid}"][sub][lvl] += 1
