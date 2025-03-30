from django.http import JsonResponse
from django.contrib.auth.models import User
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt

class Register(APIView):

    def post(self, request):
        data = request.data
        username = data['username']
        password = data['password']
        IdentifyPassword = data['IdentifyPassword']
        select = data.get('select')
        if not username or not password or not IdentifyPassword:
            return Response({
                'result': "数据不许为空!"
            })
        if password != IdentifyPassword:
            return Response({
                'result': "两次输入密码不一致!"
            })
        if User.objects.filter(username=username):
            return Response({
                'result': "用户已注册!"
            })
        user = User.objects.create_user(username=username, password=password)
        if select == 'Student':
            Student.objects.create(user=user, photo='https://img.tukuppt.com/ad_preview/01/01/33/3DjnJcLeIP.jpg!/fw/260')
        else:
            Teacher.objects.create(user=user, photo='https://tse4-mm.cn.bing.net/th/id/OIP-C.5NSM0Kb1mSR3J6K31nHiIgAAAA?rs=1&pid=ImgDetMain')
        return Response({
            'result': 'success',
        })
        
