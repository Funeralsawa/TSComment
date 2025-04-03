from django.db import models
from django.contrib.auth.models import User

class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    photo = models.URLField(max_length = 256, blank = True)
    name = models.CharField(max_length = 200, verbose_name='姓名', blank=True, null=True, default=None)

    def __str__(self):
        return str(self.user)
