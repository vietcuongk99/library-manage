$(document).ready(function() {


    loginJS = new LoginJS()
})


//class quản lý các sự kiện trang login.html
class LoginJS {


    constructor() {
        this.loadData()
        this.initEvent()
    }


    loadData() {

    }

    //gán sự kiện cho các thẻ liên quan trên trang login.html
    initEvent() {
        //bind đối tượng this cho hàm của loginJS Object
        $('#loginBtn').click(this.loginEvent.bind(this))
        $('#guestLoginLink').click(this.guestLoginEvent.bind(this))
        $('#signUpLink').click(this.signUpEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "đăng nhập"
    loginEvent() {

        let user = {
            userName: "dinh viet Cuong",
            avatarUrl: "../content/img/avatar-sample.png",
            role: "ROLE_ADMIN"
        }

        //nếu có dữ liệu user cũ thì xóa bỏ
        //lưu dữ liệu user vào localStorage với giá trị trả về từ API
        localStorage.removeItem("user")
        localStorage.setItem("user", JSON.stringify(user))


    }

    //chi tiết xử lý khi click link "đăng nhập với tư cách khách"
    guestLoginEvent() {
        var userData = localStorage.getItem("user")

        //nếu có dữ liệu user cũ thì xóa bỏ
        //lưu dữ liệu user vào localStorage với giá trị null
        if (userData) {
            localStorage.removeItem("user")
            localStorage.setItem("user", null)
        }


    }

    //chi tiết xử lý khi click link "đăng ký"
    signUpEvent() {
        alert("Hiển thị giao diện signup.html...")
    }
}