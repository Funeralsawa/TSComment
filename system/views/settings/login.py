from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student
from django.contrib.auth.models import User

def signin(request):
    data = request.GET
    username = data.get('username')
    password = data.get('password')
    who = data.get('who')

    if username == 'acs':
        user = authenticate(username=username, password=password)
        if user: 
            login(request, user)
            return JsonResponse({
                'result': 'success',
            })

    user = User.objects.filter(username=username, password=password)
    if user:
        user = user[0]
        if who == 'teacher':
            user = Teacher.objects.filter(user=user)
        else:
            user = Student.objects.filter(user=user)
    if not user:
        return JsonResponse({
            'result': "用户名或密码不正确",
        })
    user = User.objects.filter(username=username, password=password)
    login(request, user[0])
    request.session.set_expiry(0)
    return JsonResponse({
        'result': 'success',
    })