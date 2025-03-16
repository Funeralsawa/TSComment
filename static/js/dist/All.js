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
                url: "http://47.115.43.91:8000/menu/save_text/",
                type: "POST",
                data: {
                    questionnaireName: questionnaireName,
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
class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.os != "WEB") this.platform = "OTHER";
        this.username = "";
        this.photo = "";
        this.is_teacher = null;
        this.$settings = $(`
            <div class="TSC_menu">
                <div class="login">
                    <button class="Teacher_login">教师登录</button>
                    <button class="Student_login">学生登录</button>
                    <button class="Register">注册</button>
                </div>
                <div class="Teacher_login_template">
                    <div>老师您好!</div>
                    <span class="Teacher_login_item">
                        <input class="Teacher_login_account_input" placeholder="请输入账号">
                        <input type="password" class="Teacher_login_password_input" placeholder="请输入密码">
                    </span>
                    <button>登录</button>
                    <div class="Teacher_login_error_message"></div>
                </div>
                <div class="Student_login_template">
                    <div>学生您好!</div>
                    <span class="Student_login_item">
                        <input class="Student_login_account_input" placeholder="请输入账号">
                        <input type="password" class="Student_login_password_input" placeholder="请输入密码">
                    </span>
                    <button>登录</button>
                    <div class="Student_login_error_message"></div>
                </div>
                <div class="Register_template">
                    <h2>欢迎!</h2>
                    <input type="text" class="Register_account" placeholder="请输入账号名">
                    <input type="password" class="Register_password" placeholder="请输入密码">
                    <input type="password" class="Register_identify_password" placeholder="请输入确认密码">
                    <select name="Imt">
                        <option selected value="Student">我是学生</option>
                        <option value="Teacher">我是教师</option>
                    </select>
                    <button class="Register_sumbit_button">注册</button>
                    <div class="Register_error_messages"></div>
                </div>
            </div>
        `);
        this.$login = this.$settings.find('.login');

        this.$Teacher_login = this.$settings.find(".Teacher_login");
        this.$Student_login = this.$settings.find(".Student_login");

        this.$Register = this.$settings.find(".Register");

        this.$Teacher_login_template = this.$settings.find('.Teacher_login_template');
        this.$Teacher_login_account_input = this.$settings.find('.Teacher_login_account_input');
        this.$Teacher_login_password_input = this.$settings.find('.Teacher_login_password_input');
        this.$Teacher_login_template_button = this.$settings.find('.Teacher_login_template > button')
        this.$Teacher_login_error_message = this.$settings.find('.Teacher_login_error_message');

        this.$Student_login_template = this.$settings.find('.Student_login_template');
        this.$Student_login_account_input = this.$settings.find('.Student_login_account_input');
        this.$Student_login_password_input = this.$settings.find('.Student_login_password_input');
        this.$Student_login_error_message = this.$settings.find('.Student_login_error_message');
        this.$Student_login_template_button = this.$settings.find('.Student_login_template > button');

        this.$Register_template = this.$settings.find('.Register_template');
        this.$Register_sumbit_button = this.$settings.find('.Register_sumbit_button');
        this.$Register_account = this.$settings.find('.Register_account');
        this.$Register_password = this.$settings.find('.Register_password');
        this.$Register_identify_password = this.$settings.find('.Register_identify_password');
        this.$h2 = this.$settings.find('.Register_template > h2');
        this.$select = this.$settings.find('.Register_template > select');
        this.$Register_error_messages = this.$settings.find('.Register_error_messages');

        this.$Teacher_login_template.hide();
        this.$Student_login_template.hide();
        this.$Register_template.hide();
        this.root.$tsc.append(this.$settings);
        
        this.start();
    }

    start() {
        this.add_event_listenings();
        this.getinfo_web();
    }

    getinfo_web() {
        let outer = this;
        $.ajax({
            url: "http://47.115.43.91:8000/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.is_teacher = resp.is_teacher;
                    console.log(outer.is_teacher);
                    outer.hide();
                    outer.root.menu.show();
                    if(resp.is_teacher === "true" && resp.questionnaire) {
                        let $left_menu = outer.root.menu.$teacher_menu_leftMenu;
                        let $ul = $("<ul></ul>");
                        for(let i of resp.questionnaire) {
                            let $li = $("<li></li>").text(i.name);
                            $ul.append($li);
                        }
                        $left_menu.html($ul);
                        outer.setMenuEventListening();
                    }
                }
                else outer.$login.show();
            },
        });
    }

    add_event_listenings() {
        this.add_listening_events_login();
        this.add_listening_events_register();
    }

    add_listening_events_login() {
        let outer = this;
        this.$Student_login.on('click', function() {
            outer.$login.hide();
            outer.login_on_remote("student");
        });

        this.$Teacher_login.on('click', function() {
            outer.$login.hide();
            outer.login_on_remote("teacher");
        });

        this.$Teacher_login_template_button.on('click', function() {
            outer.login("teacher");
        });

        this.$Student_login_template_button.on('click', function() {
            outer.login("student");
        });
    }

    setMenuEventListening() {
        let outer = this;
        let $li = this.root.menu.$teacher_menu_leftMenu.find("li");
        $li.on('click', function(e) {
            e.stopPropagation(); //阻止事件冒泡
            $.ajax({
                url: "http://47.115.43.91:8000/settings/setMenuEventListening/",
                type: "GET",
                data: {
                    name: $(this).text(), //当前触发事件的元素是$(this)
                },
                success: function(resp) {
                    if(resp.result === "success") {
                        outer.root.menu.$textArea.html(resp.text);
                        outer.root.menu.$textArea.show();
                    }
                },
            });
        })
    }

    login_on_remote(who) {
        if(who === "teacher") {
            this.$Teacher_login_template.show();
        } else {
            this.$Student_login_template.show();
        }
    }

    login(who) {
        let outer = this;
        let username, password;
        if(who === "teacher") {
            username = this.$Teacher_login_account_input.val();
            password = this.$Teacher_login_password_input.val();
        } else {
            username = this.$Student_login_account_input.val();
            password = this.$Student_login_password_input.val();
        }
        
        $.ajax({
            url: "http://47.115.43.91:8000/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
                who: who,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    location.reload();
                } else {
                    if(who === "teacher") outer.$Teacher_login_error_message.html(resp.result);
                    else outer.$Student_login_error_message.html(resp.result);
                }
            },
        });
    }

    add_listening_events_register() {
        let outer = this;
        this.$Register.on('click', function() {
            outer.$login.hide();
            outer.$Register_template.show();
        });

        this.$Register_sumbit_button.on('click', function() {
            outer.register();
        });
    }

    register() {
        let outer = this;
        let username = this.$Register_account.val();
        let password = this.$Register_password.val();
        let IdentifyPassword = this.$Register_identify_password.val();
        let select = this.$select.val();

        $.ajax({
            url: "http://47.115.43.91:8000/settings/register/",
            type: "GET",
            data: {
                username: username,
                password: password,
                IdentifyPassword: IdentifyPassword,
                select: select,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    outer.$Register_error_messages.html(' ');
                    outer.$h2.html("注册成功!");
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                }
                else {
                    outer.$Register_error_messages.html(resp.result);
                }
            }
        });
    }

    hide() {
        this.$settings.hide();
    }

    show() {
        this.$settings.show();
    }
}export class TSC {
    constructor(id, os) {
        this.id = id;
        this.os = "WEB";
        if(os) this.os = os;
        this.$tsc = $('#' + this.id);
        this.menu = new Menu(this);
        this.settings = new Settings(this);
        
        this.start();
    }

    start() {

    }

    hide() {
        this.$tsc.hide();
    }

    show() {
        this.$tsc.show();
    }
}