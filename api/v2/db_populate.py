import apiv2.wsgi

# rm core/migrations/* db.sqlite3 -rf && touch core/migrations/__init__.py && python3 manage.py makemigrations && python3 manage.py migrate    

from core.models import *
from random import choices, randint

sub_dit = {
    "Python" : 0,
    "Java" : 0,
    "JavaScript" : 0
}

for i in range(200):
    sub = choices(["Python", "Java", "JavaScript"])[0]
    sub_dit[sub] += 1
    marks = [0,0,0,0]
    marks[randint(0,3)] = 1
    Questions.objects.create(question_data=f"This Is Question {i}",question_id=i, subject=sub, level=choices([1,2,3])[0])
    for j in range(4):
        Options.objects.create(option_data=f"Option {j} for Question {i} {marks[j]}", marks=marks[j], question_id=i)


print(sub_dit)
    # Options.objects.create(option_data=f"Option 2 for Question {i} {}", marks=marks[1], question_id=i)
    # Options.objects.create(option_data=f"Option 3 for Question {i} {}", marks=marks[2], question_id=i)
    # Options.objects.create(option_data=f"Option 4 for Question {i} {}", marks=marks[3], question_id=i)


for p in Questions.objects.raw('SELECT * FROM questions'):
    print(p)


for o in Options.objects.raw('SELECT * FROM options'):
    print(o)
