$(document).ready(function() {
    changePassJS = new ChangePassJS()
})


//class quản lý các sự kiện trang change-pass.html
class ChangePassJS {


    constructor() {
        console.log("pass")
        this.loadData()
        this.initEvent()
    }


    loadData() {
        // xóa bỏ dữ liệu cũ trong localStorage
        localStorage.clear()
    }

    //gán sự kiện cho các thẻ liên quan trên trang change-pass.html
    initEvent() {
        //bind đối tượng this cho hàm của changePassJS Object
        $('#confirmBtn').on('click', this.updatePassEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "cập nhật"
    updatePassEvent() {
        let user = {
            userName: "dinh viet Cuong",
            avatarUrl: "../content/img/avatar-sample.png",
            role: "ROLE_ADMIN"
        }

        //lưu dữ liệu user vào localStorage với giá trị trả về từ API
        localStorage.setItem("user", JSON.stringify(user))

    }

}