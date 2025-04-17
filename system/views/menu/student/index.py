from django.http import JsonResponse
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student
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

class attend_class(APIView):
    permission_classes = ([IsAuthenticated])

    def put(self, request):
        user = request.user
        if not Student.objects.filter(user=user):
            return Response({
                'result': "你不是学生哦！"
            })
        try:
            student = Student.objects.get(user=user);
            data = request.data
            cls = data.get('class_name')
            cls = Class.objects.filter(ClassName=cls)
            if not cls:
                return Response({
                    'result': "找不到该班级"
                })
            cls = cls[0]
            student.cls = cls
            student.save()
            return Response({
                'result': "success"
            })
        except:
            return Response({
                'result': "failed!"
            })

