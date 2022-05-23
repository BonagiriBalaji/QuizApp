import requests
from random import randint, choices

sub_dit = {
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

for i in range(100):
    sub = choices(["Python", "Java", "JavaScript"])[0]
    lvl = randint(1,3)
    requests.get(f'http://localhost:9003/ques/{sub}/{lvl}')
    sub_dit[sub][lvl] += 1

print(sub_dit)