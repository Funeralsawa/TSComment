from django.http import JsonResponse
from django.contrib.auth import logout as LogOut
from system.models.teacher.teacher import Teacher
from system.models.questionnaire.questionnaire import Questionnaire
from openai import OpenAI
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import math
import random

def logout(request):
    LogOut(request)
    return JsonResponse({
        'result': "success",
    })

class send_question(APIView):
    def post(self, request):
        data = request.data
        if not data.get('question'):
            return Response({
                'result': "数据不允许为空",
            })
        client = OpenAI(api_key="sk-e7ce7c118b50415db425e1ceea5704fe", base_url="https://api.deepseek.com")
        questionnaire = "给我生成一份关于“{content}”的小调查问卷，以html格式输出，使用中文" \
                        "所有的高度和宽度采用相对于父元素的高度和宽度".format(content=data['question'])
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
            if not l and questionnaire[i:i+4] == "html":
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
        user, data = request.user, request.POST
        flag = False
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            Questionnaire.objects.create(text=data['text'], owner=teacher, name=data['questionnaireName'])
            flag = True
        if flag:
            print("save success")
            return JsonResponse({
                'result': "success",
            })
        else:
            return JsonResponse({
                'result': "fail",
            })
