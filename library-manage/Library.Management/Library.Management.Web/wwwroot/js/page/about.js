$(document).ready(function() {
    aboutJS = new AboutJS()
})

//class quản lý các sự kiện trong trang about.html
class AboutJS extends BaseJS {
    constructor() {
        super();
        this.loadData();
        this.initEvent();
    }

    ///load dữ liệu
    loadData() {}

    //gán sự kiện
    initEvent() {}
}