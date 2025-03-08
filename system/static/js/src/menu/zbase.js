class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="Menu">
                <nav>
                    <div class="Menu-logout">登出</div>
                </nav>
                <hr>
                <section class="teacher_menu">
                    <div class="teacher_menu_leftMenu"></div>
                    <div class="teacher_menu_rightMenu">
                        <div class="teacher_menu_questionnaire">
                            <p>请输入你要生成的问卷形式:</p>
                            <input type="text" class="teacher_menu_input" placeholder="键入回车以提交噢！">
                        </div>
                        <div class="textArea"></div>
                    </div>
                </section>
            </div>
        `);
        
        this.hide();
        this.$Menu_logout_button = this.$menu.find('.Menu-logout');
        this.$teacher_menu = this.$menu.find('.teacher_menu');
        this.$teacher_menu_input = this.$menu.find('.teacher_menu_input');
        this.$textArea = this.$menu.find('.textArea');

        this.root.$tsc.append(this.$menu);
        
        this.$teacher_menu.hide();
        
        this.start();
    }

    start() {
        this.add_event_listenings();
    }

    add_event_listenings() {
        let outer = this;
        this.$Menu_logout_button.on('click', function() {
            outer.logout(outer.root.os);
        });

        this.$teacher_menu_input.on('keydown', function(e) {
            if(e.keyCode === 13) {
                console.log("回车");
                outer.send_question();
            }
        })
    }

    send_question() {
        let outer = this;
        let question = this.$teacher_menu_input.val();
        if(question === null) return false;
        $.ajax({
            url: "http://47.115.43.91:8000/menu/send_question/",
            type: "POST",
            data: {
                question: question,
                csrfmiddlewaretoken: $("[name='csrfmiddlewaretoken']").val(),
            },
            success: function(resp) {
                if(resp.result === "success")
                {
                    outer.$textArea.html(resp.questionnaire);
                }
            },
        });
    }

    logout(os) {
        if(os === "WEB") {
            $.ajax({
                url: "http://47.115.43.91:8000/menu/logout/",
                type: "GET",
                success: function(resp) {
                    if(resp.result === "success") location.reload();
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
        if(this.root.settings.is_teacher) {
            this.$teacher_menu.show();
            setTimeout(() => {
                outer.$teacher_menu_input.focus();
            }, 50);
        }
    }
}