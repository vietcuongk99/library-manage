$(document).ready(function() {

    signUpJS = new SignUpJS()
})


//class quản lý các sự kiện trang signup.html
class SignUpJS {


    constructor() {
        this.loadData()
        this.initEvent()
    }


    loadData() {
        // xóa bỏ dữ liệu cũ trong localStorage
        localStorage.clear()
    }

    //gán sự kiện cho các thẻ liên quan trên trang signup.html
    initEvent() {
        //bind đối tượng this cho hàm của signupJS Object
        $('#signUpBtn').on('click', this.signUpEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "cập nhật"
    signUpEvent() {


        let user = {
            userName: "dinh viet Cuong",
            avatarUrl: "../content/img/avatar-sample.png",
            role: "ROLE_ADMIN"
        }

        //lưu dữ liệu user vào localStorage với giá trị trả về từ API
        localStorage.setItem("user", JSON.stringify(user))
    }

}