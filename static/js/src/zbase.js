export class TSC {
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