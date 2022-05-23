import re
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from core.serializers import *
from core.models import *
from django.db import connection
import logging
import os
from apiv2.settings import BASE_DIR, LOGGING
from rest_framework import generics, permissions, mixins
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from django.db.models import Q, Prefetch
from django.db import connection, reset_queries

User = get_user_model()

logger = logging.getLogger("django")


class CustomTokenObtainPairView(TokenObtainPairView):

    serializer_class = CustomTokenObtainPairSerializer
    token_obtain_pair = TokenObtainPairView.as_view()
    
class RegisterApi(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message": "User Created Successfully. Now perform Login to get your token",
        })

@api_view(['POST'])
def submit(request):
    # print(request.headers)
    marks = 0
    try:
        answer = Options.objects.all()
    except:
        return Response("Error")
    serializer = GetAnswersSerializer(answer, many=True)
    answers = {}
    for i in serializer.data:
        answers.update(i)
    # print(request.headers["X-Score-ID"])
    data = request.data["answers"]
    for ans in data.values():
        try:
            marks += answers[ans]
        except:
            answers[ans] = 0
            continue
    if request.user.is_authenticated:
        print(request.data["level"] == 2, request.data["level"], request.headers["X-Score-ID"])
        if request.data["level"] == 1:
            Scores.objects.filter(hash=request.headers["X-Score-ID"]).update(level_1=marks)
        elif request.data["level"] == 2:
            Scores.objects.filter(hash=request.headers["X-Score-ID"]).update(level_2=marks)
        elif request.data['level'] == 3:
            Scores.objects.filter(hash=request.headers["X-Score-ID"]).update(level_3=marks)
        else:
            return Response({'message' : "Incorrect Level"})
    return Response(marks)

@api_view(['GET'])
def check(request):
    if request.user.is_authenticated:
        # print(request.user.id)
        return Response({"logged" : "True"})
    return Response({"logged" : "False"})

@api_view(['GET'])
def ans(request):
    answer = Options.objects.all()
    serializer = OptionsSerializer(answer, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def quesall(request):
    try:
        question = Questions.objects.all()
    except:
        return Response('Error')
    serializer = Questions2Serializer(question, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def ping(request):
    # print(request.headers)
    res = Response("pong")
    # print(res.headers)
    res.headers["Set-Test"]  = "lol123"
    return res


@api_view(['GET'])
def scores(request):
    # parents = User.objects.filter(scores__score=1).annotate(score=F('scores__score'))
    # print(parents.query)
    # data = Scores.objects.filter(hash = 'cace784405bee2fad705ad5b17f5b71b').first()
    # print(data.score)
    # s = ScoreSerializer(data)
    # return Response(s.data)
    if request.user.is_authenticated:
        data = User.objects.filter(id=request.user.id).prefetch_related(
            Prefetch('scores', queryset=Scores.objects.filter(~Q(level_1=-1) & Q(subject="Python")), to_attr="pf_python"), 
            Prefetch('scores', queryset=Scores.objects.filter(~Q(level_1=-1) & Q(subject="Java")), to_attr='pf_java'),
            Prefetch('scores', queryset=Scores.objects.filter(~Q(level_1=-1) & Q(subject="JavaScript")), to_attr='pf_javascript')) # Get Parent Objects while filtering child objects in sublist
        # print(connection.queries)
        # print(len(connection.queries))
        # for i in connection.queries:
        #     print(i["sql"])
        serializer = User2Serializer(data,many=True)
        return Response(serializer.data)
    else:
        return redirect("http://localhost:3000/Login")
    # parents = User.objects.filter(id=request.user.id).prefetch_related(Prefetch(
    #     'scores',
    #     queryset=Scores.objects.filter(Q(user_id=request.user.id)))) #~Q(score=-1) & 
    
    # print(data.query)
    
    # scores1 = Scores.objects.filter(Q(user_id = 1) & Q(hash='bce1dfd35dec787a1aa334a607c88141'))[0]
    # print(scores.query)
    # sc2 = Scores.objects.filter(Q(score = 1)).values_list('user_id', flat=True)
    # ur1 = User.objects.filter(id__in=sc2)
    # print(ur1)
    # test = ScoreSerializer(scores, many=True)
    # print(test.data)
    # u = User.objects.filter(scores = scores1)
    # u.scores.filter(score = 1)
    # print(u.query)
    # print(UserSerializer(u, many=True).data)
    # user = User.objects.filter(Q(id = 1) & Q(scores__score = 1) & Q(scores__user_id = 1)).distinct()
    # print(user.query)
    # serializer = User2Serializer(data, many=True)
    # return Response(serializer.data)

# @api_view(['GET'])
# def quesall(request):
#     question = Questions.objects.filter(subject = "Python")[:20]
#     serializer = Questions2Serializer(question, many=True)
#     return Response(serializer.data)


@api_view(['GET'])
def ques(request, sub="Python", level=1):
    scr_id = -1
    logger.info(f'{sub} {level}')
    question = Questions.objects.filter(subject = sub, level=level)
    serializer = Questions2Serializer(question, many=True)
    response = Response({
        "data" : serializer.data,
    })
    if request.user.is_authenticated:
        # print("sefjsbefjsbefjsbfjkesbf")
        try:
            # print("sefjsbefjsbefjsbfjkesbf")
            score = Scores.objects.filter(hash = request.headers["X-Score-ID"])[0]
            # print("sefjsbefjsbefjsbfjkesbf")
            # # print(score)
            s = ScoreSerializer(score)
            # print(s.data)
            # print("sefjsbefjsbefjsbfjkesbf")
            # print(s.data)
            # print(s , s.data['user'] == request.user.id)
            if s and s.data['user'] == request.user.id:
                scr_id = s.data['hash']
                # print("New2")
                # if level == 1 and s.data['level_1'] != -1:
                #     raise Exception
                # elif level == 2 and s.data['level_1'] != -1:
                #     raise Exception
                # elif level == 3 and s.data['level_1'] != -1:
                #      raise Exception
                # else:
                #     scr_id = s.data['hash']
            else:
                # print("New3")
                raise Exception
            # print("sefjsbefjsbefjsbfjkesbf")
        except Exception as e:
            print(e, "error")
            user_score = Scores(user_id=request.user.id, subject=sub)
            user_score.save()
            scr_id = user_score.hash
    response.headers["X-Score-ID"] = scr_id
    return response


@api_view(['GET'])
def python(request):
    question = Questions.objects.filter(subject = "Python")[:20]
    serializer = Questions2Serializer(question, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def front(request):
    return redirect("http://localhost:9009/")
