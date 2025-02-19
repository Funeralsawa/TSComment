class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        if(this.root.os) this.platform = "OTHER";
        this.username = "";
        this.photo = "";
        this.$settings = $(`
            <div class="TSC_menu">
                <div class="login">
                    <div class="Teacher_login">教师登录</div>
                    <div class="Student_login">学生登录</div>
                    <div class="Exit">退出</div>
                </div>
            </div>
        `);
        this.hide();
        this.root.$tsc.append(this.$settings);
        
        this.start();
    }

    start() {
        this.show();
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