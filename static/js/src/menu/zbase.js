class Menu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="Menu">
                <button class="Menu-logout">退出</button>
            </div>
        `);
        
        this.hide();
        this.$Menu_logout_button = this.$menu.find('.Menu-logout');
        this.root.$tsc.append(this.$menu);
        
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
        this.$menu.show();
    }
}