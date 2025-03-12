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
}