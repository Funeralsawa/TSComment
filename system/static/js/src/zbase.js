export class TSC {
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