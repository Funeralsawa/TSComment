from django.db import models
from system.models.questionnaire.questionnaire import Questionnaire

class Answer(models.Model):
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=100, blank=False, null=False)
    answers = models.JSONField(blank=False, null=False)
    submitted_at = models.DateTimeField(auto_now_add=True)
