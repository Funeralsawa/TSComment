from django.http import JsonResponse
from django.contrib.auth import logout as LogOut
from openai import OpenAI

def logout(request):
    LogOut(request)
    return JsonResponse({
        'result': "success",
    })

def send_question(request):
    data = request.POST
    client = OpenAI(api_key="sk-e7ce7c118b50415db425e1ceea5704fe", base_url="https://api.deepseek.com")
    questionnaire = "给我生成一份关于“{content}”的调查问卷，以html格式输出，" \
                    "所有的高度和宽度采用相对于父元素的高度和宽度".format(content=data['question'])
    print(questionnaire)
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
        
    print(questionnaire)
    return JsonResponse({
        'result': "success",
        'questionnaire': questionnaire,
    })
