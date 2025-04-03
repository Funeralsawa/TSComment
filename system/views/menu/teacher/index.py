from django.http import JsonResponse
from system.models.teacher.teacher import Teacher
from system.models.questionnaire.questionnaire import Questionnaire
from openai import OpenAI
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from system.models.class_info.class_info import Class
from django.conf import settings
import math
import random

class send_question(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not Teacher.objects.filter(user=user):
            return Response({
                'result': "只有老师才能生成问卷噢！",
            })
        data = request.data
        if not data.get('question'):
            return Response({
                'result': "数据不允许为空",
            })
        client = OpenAI(api_key=settings.API_KEY, BAse_url="https://api.deepseek.com")
        questionnaire = "给我生成一份关于“{content}”的调查问卷的json配置，用于微信小程序前端动态展示，使用中文" \
                "包括3个单选题，2个多选题以及一个简答题，支持wx:for绑定数据, 两个主要的字段是'title'与'components'".format(content=data['question'])

        file = open("TSComment/medias/log.txt", mode='a', encoding='utf-8')
        file.write(questionnaire + '\n')
        file.close()
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专业的调查问卷生成专家"},
                {"role": "user", "content": questionnaire},
            ],
            stream=False
        )
        questionnaire = response.choices[0].message.content
        l, r = 0, len(questionnaire) - 1
        for i in range(len(questionnaire)):
            if not l and questionnaire[i:i+4] == "json":
                l = i + 4
            elif l and questionnaire[i:i+3] == "```":
                r = i
                break
        questionnaire = questionnaire[l:r]
        return Response({
            'result': "success",
            'questionnaire': questionnaire,
        })

def getRandomNum():
    num = ''
    for i in range(20):
        num = num + str(math.floor(random.random() * 9))
    return num

class save_text(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user, data = request.user, request.data
        flag = False
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            cls = teacher.classes.all()
            cname = data.get('className')
            if not cls.filter(ClassName=cname):
                return Response({
                    'result': "找不到该班级！"
                })
            cls = cls.filter(ClassName=cname)[0]

            if Questionnaire.objects.filter(owner=teacher, name=data.get('questionnaireName'), cls=cls):
                return JsonResponse({
                    'result': "当前问卷已存在！",
                })
            Questionnaire.objects.create(content=data['content'], owner=teacher, name=data['questionnaireName'], cls=cls)
            flag = True
        if flag:
            print("save success")
            return JsonResponse({
                'result': "success",
            })
        else:
            return JsonResponse({
                'result': "没有当前老师存在",
            })

class add_class(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        teacher = Teacher.objects.filter(user=request.user)
        if not teacher:
            return Response({
                'result': "只有老师可以添加班级噢！",
            })
        teacher = teacher[0]
        data = request.data
        name = data.get('name')
        if not name:
            return Response({
                'result': "班级名字不可以为空噢！",
            })
        if teacher.classes.filter(ClassName=name):
            return Response({
                'result': "已经拥有该班级！",
            })
        cls = Class.objects.create(ClassName=name)
        cls.teacher.add(teacher)
        return Response({
            'result': "success",
        })

class tGetQuestionnaire(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not Teacher.objects.filter(user=user):
            return Response({
                'result': "你不是老师为什么要访问这个API",
            })
        teacher = Teacher.objects.get(user=user)
        cname = request.get('className')
        cls = teacher.classes.filter(ClassName=cname)
        if not cls:
            return Response({
                'result': "你当前还没有班级噢！",
            })
        cls = cls[0]
        questionnaire = Questionnaire.objects.filter(owner=teacher, cls=cls)
        return Response({
            'result': "success",
            'questionnaire': list(questionnaire.values('name'))
        })
