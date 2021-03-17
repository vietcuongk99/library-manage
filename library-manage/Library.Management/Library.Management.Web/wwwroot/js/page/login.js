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
        //xóa dữ liệu user cũ trong localStorage
        localStorage.clear()

    }

    //gán sự kiện cho các thẻ liên quan trên trang login.html
    initEvent() {
        //bind đối tượng this cho hàm của loginJS Object
        $('#loginBtn').on('click', this.loginEvent.bind(this))
        $('#guestLoginLink').on('click', this.guestLoginEvent.bind(this))
        $('#signUpLink').on('click', this.signUpEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "đăng nhập"
    loginEvent() {

        var validateCheck = this.validateInput()

        if (validateCheck) {
            //lưu dữ liệu user vào localStorage với giá trị trả về từ API
            localStorage.setItem("user", JSON.stringify(user))
                //mở trang index.html
            window.open("index.html", "_self")
        } else {
            var alertDiv = $(`<div class="alert alert-danger" role="alert">Sai tên đăng nhập hoặc mật khẩu.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`)
            alertDiv.insertBefore('#usernameInputDiv')
            console.log("Đăng nhập thất bại")
        }


    }

    //chi tiết xử lý khi click link "đăng nhập với tư cách khách"
    guestLoginEvent() {
        //lưu dữ liệu user vào localStorage với giá trị null
        localStorage.setItem("user", null)
    }

    //chi tiết xử lý khi click link "đăng ký"
    signUpEvent() {
        alert("Hiển thị giao diện signup.html...")
    }

    //validate input của người dùng
    validateInput() {
        var usernameInput = $('#usernameInput').val();
        var passwordInput = $('#passwordInput').val()

        if (!usernameInput || usernameInput.length <= 0 || !passwordInput || passwordInput.length < 5) {
            return false
        } else {
            return true
        }
    }
}


//fake data
var user = {
    userName: "dinh viet Cuong",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_ADMIN"
}