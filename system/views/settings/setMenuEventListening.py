from system.models.questionnaire.questionnaire import Questionnaire
from system.models.teacher.teacher import Teacher
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse

class SetMenuEventListening(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = request.data
        name = data.get('name')
        user = request.user
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            cname = data.get('className', ' ')
            cls = teacher.classes.filter(ClassName=cname)
            if not cls:
                return Response({
                    'result': '你要找的是哪个班级的问卷呢？',
                })
            cls = cls[0]
            text = Questionnaire.objects.filter(owner=teacher, name=name, cls=cls)
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
