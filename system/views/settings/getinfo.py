from django.http import JsonResponse
from system.models.student.student import Student
from system.models.teacher.teacher import Teacher
from system.models.questionnaire.questionnaire import Questionnaire
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class getinfo(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            return Response({
                'result': "success",
                'is_teacher': 1,
                'name': teacher.name,
            })
        elif Student.objects.filter(user=user):
            student = Student.objects.get(user=user)
            return Response({
                'result': "success",
                'name': student.name,
                'is_teacher': 0,
            })

class GetClassInfo(APIView):
    permission_classes = ([IsAuthenticated])

    def get(self, request):
        user = request.user
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            cls = teacher.classes.all()
            return Response({
                'result': "success",
                'classes': list(cls.values('ClassName')),
            })
        elif Student.objects.filter(user=user):
            student = Student.objects.get(user=user)
            if student.cls: cls = student.cls.ClassName
            else: cls = None
            return Response({
                'result': "success",
                'classes': [
                    {'ClassName': cls}
                ]
            })

