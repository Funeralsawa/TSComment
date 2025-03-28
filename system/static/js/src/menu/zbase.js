class Menu {
    constructor(root) {
        let outer = this;
        this.root = root;
        this.num = 0;
        this.$menu = $(`
            <div class="Menu">
                <nav>
                    <div class="Menu-logout">登出</div>
                    <div type="button" class="btn save_button">保存为模板</div>
                </nav>
                <hr>             
                <section class="teacher_menu">
                    <div class="teacher_menu_leftMenu"></div>
                    <div class="teacher_menu_rightMenu">
                        <div class="teacher_menu_questionnaire">
                            <p>请输入你的学科:</p>
                            <input type="text" class="teacher_menu_input" placeholder="键入回车以提交噢！">
                        </div>
                        <div class="textArea"></div>
                    </div>
                </section>
                <div class="modal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">起名谢谢</h5>
                                <button type="button" class="btn-close close_questionnaire_name" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <input type="text" placeholder="输入你的问卷名称" value="${outer.getDate()}" class="questionnaireName">
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary close_questionnaire_name" data-bs-dismiss="modal">关闭</button>
                                <button type="button" class="btn btn-primary save_questionnaire_name">保存</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.$Menu_logout_button = this.$menu.find('.Menu-logout');
        this.$save_button = this.$menu.find('.save_button');
        this.$teacher_menu = this.$menu.find('.teacher_menu');
        this.$teacher_menu_input = this.$menu.find('.teacher_menu_input');
        this.$textArea = this.$menu.find('.textArea');
        this.$teacher_menu_leftMenu = this.$menu.find('.teacher_menu_leftMenu');
        this.$modal = this.$menu.find('.modal');
        this.$questionnaireName = this.$menu.find('.questionnaireName');
        this.$save_questionnaire_name = this.$menu.find('.save_questionnaire_name');
        this.$close_questionnaire_name = this.$menu.find('.close_questionnaire_name');

        this.root.$tsc.append(this.$menu);

        this.$teacher_menu.hide();
        this.$textArea.hide();
        this.$save_button.hide();
        
        this.hide();

        this.start();
    }

    start() {
        this.add_event_listenings();
        this.$modal.hide();
    }

    getDate() {
        const now = new Date();
        let year = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, '0');
        let day = String(now.getDate()).padStart(2, '0');
        let hour = String(now.getHours()).padStart(2, '0');
        let min = String(now.getMinutes()).padStart(2, '0');
        let second = String(now.getSeconds()).padStart(2, '0');
        let millsecond = String(now.getMilliseconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${min}:${second}:${millsecond}`;
    }

    add_event_listenings() {
        let outer = this;

        //模态框需要初始化
        document.addEventListener('DOMContentLoaded', function() {
            var modal = new bootstrap.Modal(document.querySelector('.modal'), {
                keyboard: true,
                backdrop: true
            });
        });

        this.$Menu_logout_button.on('click', function () {
            outer.logout(outer.root.os);
        });

        this.$teacher_menu_input.on('keydown', function (e) {
            if (e.keyCode === 13) {
                if (outer.num != 0) {
                    console.log("请不要重复提交！");
                    return false;
                }
                outer.num++;
                console.log("生成ing");
                outer.$textArea.html("<font color='red' size='4vh'>你的问卷正在生成中，请不要重复提交！</font>");
                if (outer.textArea_none) clearTimeout(outer.textArea_none);
                outer.$textArea.show();
                outer.send_question();
            }
        });

        this.$save_button.on('click', function () {
            if(outer.$textArea.html() === "<font color=\"red\" size=\"4vh\">你的问卷正在生成中，请不要重复提交！</font>") {
                return false;
            }
            if (!outer.questionnaire) {
                if (outer.textArea_none) clearTimeout(outer.textArea_none);
                outer.$textArea.html("你还没有生成问卷噢！");
                outer.$textArea.show();
                outer.textArea_none = setTimeout(function () {
                    outer.$textArea.html("");
                    outer.$textArea.fadeOut();
                }, 3000);
                return false;
            }
            outer.$modal.show();
        });

        this.$close_questionnaire_name.on('click', function() {
            outer.$modal.hide();
        });

        this.$save_questionnaire_name.on('click', function() {
            let questionnaireName = outer.$questionnaireName.val();
            $.ajax({
                url: "https://app7431.acapp.acwing.com.cn/menu/save_text/",
                type: "POST",
                data: {
                    questionnaireName: questionnaireName,
                    text: outer.questionnaire,
                    csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val(),
                },
                headers: {
                    'Authorization': "Bearer " + localStorage.getItem("access"),
                },
                success: function (resp) {
                    if (resp.result === "success") {
                        console.log("save success");
                        outer.questionnaire = null;
                        outer.$textArea.html("问卷已保存！");
                        setTimeout(() => {
                            location.reload();
                        }, 3000);
                    }
                    else {
                        console.log("save failed");
                        outer.$textArea.html("问卷保存失败");
                    }
                }
            });
        });
    }

    send_question() {
        let outer = this;
        let question = this.$teacher_menu_input.val();
        if (question === null) return false;
        console.log(this.getDate());
        $.ajax({
            url: "https://app7431.acapp.acwing.com.cn/menu/send_question/",
            type: "POST",
            data: {
                question: question,
            },
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("access"),
            },
            success: function (resp) {
                if (resp.result === "success") {
                    outer.questionnaire = resp.questionnaire;
                    outer.$textArea.html(resp.questionnaire);
                    outer.$textArea.show();
                    outer.num = 0;
                    console.log("已完成！");
                }
                else outer.$textArea.html(resp.result);
            },
            error: () => {
                outer.$textArea.html("请求超时请重新发送");
                console.log(this.getDate())
            }
        });
    }

    logout(os) {
        if (os === "WEB") {
            $.ajax({
                url: "https://app7431.acapp.acwing.com.cn/menu/logout/",
                type: "GET",
                success: function (resp) {
                    if (resp.result === "success") location.reload();
                    else console.log("登出失败");
                },
            });
        }
    }

    hide() {
        this.$menu.hide();
    }

    show() {
        let outer = this;
        this.$menu.show();
        this.$teacher_menu.hide();
        this.$save_button.hide();
        if (this.root.settings.is_teacher === 1) {
            this.$teacher_menu.show();
            this.$save_button.show();
            setTimeout(() => {
                outer.$teacher_menu_input.focus();
            }, 50);
        }
    }
}
