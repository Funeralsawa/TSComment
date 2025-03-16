class Menu {
    constructor(root) {
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
            </div>
        `);

        this.$Menu_logout_button = this.$menu.find('.Menu-logout');
        this.$save_button = this.$menu.find('.save_button');
        this.$teacher_menu = this.$menu.find('.teacher_menu');
        this.$teacher_menu_input = this.$menu.find('.teacher_menu_input');
        this.$textArea = this.$menu.find('.textArea');
        this.$teacher_menu_leftMenu = this.$menu.find('.teacher_menu_leftMenu');

        this.root.$tsc.append(this.$menu);

        this.$teacher_menu.hide();
        this.$textArea.hide();
        this.$save_button.hide();
        this.hide();

        this.start();
    }

    start() {
        this.add_event_listenings();
    }

    add_event_listenings() {
        let outer = this;
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
            $.ajax({
                url: "http://47.115.43.91:8000/menu/save_text/",
                type: "POST",
                data: {
                    text: outer.questionnaire,
                    csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val(),
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
        $.ajax({
            url: "http://47.115.43.91:8000/menu/send_question/",
            type: "POST",
            data: {
                question: question,
                csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val(),
            },
            success: function (resp) {
                if (resp.result === "success") {
                    outer.questionnaire = resp.questionnaire;
                    outer.$textArea.html(resp.questionnaire);
                    outer.$textArea.show();
                    outer.num = 0;
                    console.log("已完成！");
                }
            },
        });
    }

    logout(os) {
        if (os === "WEB") {
            $.ajax({
                url: "http://47.115.43.91:8000/menu/logout/",
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
        if (this.root.settings.is_teacher === "true") {
            this.$teacher_menu.show();
            this.$save_button.show();
            setTimeout(() => {
                outer.$teacher_menu_input.focus();
            }, 50);
        }
    }
}
