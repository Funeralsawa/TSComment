class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.os) this.platform = "OTHER";
        this.username = "";
        this.photo = "";
        this.is_teacher = false;
        this.$settings = $(`
            <div class="TSC_menu">
                <div class="login">
                    <button class="Teacher_login">教师登录</button>
                    <button class="Student_login">学生登录</button>
                </div>
                <div class="Teacher_login_template">
                    <div>老师您好!</div>
                    <span class="Teacher_login_item">
                        <input class="Teacher_login_account_input" placeholder="请输入账号">
                        <input class="Teacher_login_password_input" placeholder="请输入密码">
                    </span>
                    <button>登录</button>
                    <div class="Teacher_login_error_message"></div>
                </div>
            </div>
        `);
        this.$login = this.$settings.find('.login');
        this.$Teacher_login = this.$settings.find(".Teacher_login");
        this.$Student_login = this.$settings.find(".Student_login");
        this.$Teacher_login_template = this.$settings.find('.Teacher_login_template');
        this.$Teacher_login_account_input = this.$settings.find('.Teacher_login_account_input');
        this.$Teacher_login_password_input = this.$settings.find('.Teacher_login_password_input');
        this.$Teacher_login_template_button = this.$settings.find('.Teacher_login_template > button')
        this.$Teacher_login_error_message = this.$settings.find('.Teacher_login_error_message');
        this.$Teacher_login_template.hide();
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
                    outer.hide();
                    //outer.root.menu.show();
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
    }

    login_on_remote(who) {
        if(who === "teacher") {
            this.$Teacher_login_template.show();
        } else {

        }
    }

    login(who) {
        let outer = this;
        let username = this.$Teacher_login_account_input.val();
        let password = this.$Teacher_login_password_input.val();
        $.ajax({
            url: "http://47.115.43.91:8000/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                if(resp.result === "success") {
                    if(who === "teacher") outer.is_teacher = true;
                    outer.hide();
                    //outer.root.menu.show();
                } else {
                    outer.$Teacher_login_error_message.html(resp.result);
                }
            },
        });
    }

    add_listening_events_register() {
        let outer = this;
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
        this.os = os;
        this.$tsc = $('#' + this.id);
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