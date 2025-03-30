from system.models.questionnaire.questionnaire import Questionnaire
from system.models.teacher.teacher import Teacher
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse

class SetMenuEventListening(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = request.GET
        name = data['name']
        user = request.user
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            text = Questionnaire.objects.filter(owner=teacher, name=name)
            if not text:
                return Response({
                    'result': "未找到该问卷",
                })
            text = list(text.values())[0].get('content')
            return Response({
                'result': "success",
                'content': text,
            })
        else:
            return Response({
                'result': "你是老师吗？",
            })
