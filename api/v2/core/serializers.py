from dataclasses import field
from rest_framework import serializers

from core.models import *
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password  # Register serializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # token['is_staff'] = user.is_staff
        token['username'] = user.username
        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password=validated_data['password'], email=validated_data['email'])
        return user
        

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ScoreSerializer(serializers.ModelSerializer):
    score = serializers.ReadOnlyField()
    # scores = UserSerializer(read_only=True)
    class Meta:
        model = Scores
        fields = '__all__'
        # fields = [
        #     # "scores",
        #     "score",
        #     "level"
        # ]
        
class Score2Serializer(serializers.ModelSerializer):
    score = serializers.ReadOnlyField()
    class Meta:
        model = Scores
        fields = [
            "score",
            "level_1",
            "level_2",
            "level_3",
            # "subject",
            "created_at",
        ]

class User2Serializer(serializers.ModelSerializer):
    # options = OptionsOnlySerializer(many=True, read_only=True)
    # scores = Score2Serializer(many=True)
    python = Score2Serializer(source='pf_python', many=True)
    java = Score2Serializer(source='pf_java', many=True)
    javascript = Score2Serializer(source='pf_javascript', many=True)
    # javascript = serializers.SerializerMethodField()
    # score2 = Score2Serializer(many=True)
    class Meta:
        model = User
        # fields = '__all__'
        fields = [
            # "username",
            # "email",
            "python",
            "java",
            "javascript",
        ]
        
    def get_python(self, obj):
        return Score2Serializer(obj.testing, many=True).data
    
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     return dir(instance.id)
        
class User3Serializer(serializers.ModelSerializer):
    # options = OptionsOnlySerializer(many=True, read_only=True)
    python = serializers.SerializerMethodField()
    java = serializers.SerializerMethodField()
    javascript = serializers.SerializerMethodField()
    scores = Score2Serializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "scores"
        ]
        
    def get_python(self, obj):
        print(dir(obj))
        return [
            obj
        ]
        

# class ScoreSerializer(serializers.ModelSerializer):
#     # scores = UserSerializer(read_only=True)
#     class Meta:
#         model = Scores
#         fields = '__all__'
#         # fields = [
#         #     "scores",
#         #     "score",
#         #     "level"
#         # ]

class OptionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Options
        fields = '__all__'


class OptionsOnlySerializer(serializers.ModelSerializer):

    class Meta:
        model = Options
        exclude = [
            # 'marks',
            'question'
        ]
        # fields = "__all__"


class QuestionSerializer(serializers.ModelSerializer):
    # For Future
    # """
    # Subjects = (
    #    ('P', 'Python'),
    #    ('J', 'Java'),
    #    ('JS', 'JavaScript')
    # )
    # subject = serializers.ChoiceField(Subjects)
    # """
    class Meta:
        model = Questions
        fields = '__all__'


# class AnswersSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Answers
#         fields = '__all__'


# class TestSerializer(serializers.ModelSerializer):
#     # questions = serializers.SerializerMethodField()
#     questions = QuestionSerializer(many=True, read_only=True)
#     class Meta:
#         model = Answers
#         fields = '__all__'

#     def get_questions(self, obj):
#         return obj.question.qas


# class TestSerializer(serializers.ModelSerializer):
#     data = serializers.SerializerMethodField()
#     # questions = QuestionSerializer(many=True, read_only=True)
#     class Meta:
#         model = Answers
#         fields = [
#             'data'
#         ]


    def get_data(self, obj):

        return {
            str(obj.question.question_id): {
                obj.ans: obj.marks
            }
        }


# class TestSerializer(serializers.ModelSerializer):
#     questions = serializers.SerializerMethodField()
#     # questions = QuestionSerializer(many=True, read_only=True)
#     class Meta:
#         model = Answers
#         fields = [
#             'questions'
#         ]

#     def get_questions(self, obj):
#         return obj.question.qas


class Questions2Serializer(serializers.ModelSerializer):
    # questions = serializers.SerializerMethodField()
    options = OptionsOnlySerializer(many=True, read_only=True)
    # options = serializers.SerializerMethodField()

    class Meta:
        model = Questions
        exclude = [
            'level',
            'subject',
            'question_id'
        ]
        # fields = '__all__'

    # def get_options(self, obj):
    #     return {
    #         obj.options.op1,
    #         obj.options.op2,
    #         obj.options.op3,
    #         obj.options.op4
    #     }


class GetAnswersSerializer(serializers.ModelSerializer):
    # answers = serializers.SerializerMethodField()
    # obj.id = serializers.ReadOnlyField(source='id')

    class Meta:
        model = Options
        # fields = [
        #     'popularity',
        #     'answers'
        # ]

    def to_representation(self, obj):
        return {
            obj.id: obj.marks
        }

    # def get_answers(self, obj):
    #     return {
    #         obj.id : obj.marks
    #     }
