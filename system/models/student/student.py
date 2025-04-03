from django.db import models
from django.contrib.auth.models import User
from system.models.class_info.class_info import Class

class Student(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    photo = models.URLField(max_length = 256, blank = True)
    name = models.CharField(verbose_name='姓名', max_length=200, blank=True, null=True, default=None)
    cls = models.ForeignKey(Class, on_delete=models.PROTECT, blank=False, null=False)

    def __str__(self):
        return str(self.user)
