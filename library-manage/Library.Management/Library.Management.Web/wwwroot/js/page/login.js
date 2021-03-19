const host = "https://localhost:44328/"
$(document).ready(function() {
    //xóa dữ liệu user cũ trong localStorage
    localStorage.clear()

    loginJS = new LoginJS()

})


//class quản lý các sự kiện trang login.html
class LoginJS {

    constructor() {
        this.loadData()
        this.initEvent()
    }


    loadData() {}

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
        var checkUserValid = this.checkUserValid()

        if (validateCheck && checkUserValid) {
            var user = checkUserValid
                //lưu dữ liệu user vào localStorage với giá trị trả về từ API
            localStorage.setItem("user", JSON.stringify(user));
            //mở trang index.html
            window.open("index.html", "_self")
        } else {
            if ($('#alertDiv')) {
                $('#alertDiv').remove()
            }
            var alertDiv = $(`<div id="alertDiv" class="alert alert-danger" role="alert">Sai tên đăng nhập hoặc mật khẩu.
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`)
            alertDiv.insertBefore('#usernameInputDiv')
            console.log("Dữ liệu chưa được validated. Đăng nhập thất bại")
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

    //chi tiết xử lý validate input của người dùng
    validateInput() {
        var usernameInput = $('#usernameInput').val().trim()
        var passwordInput = $('#passwordInput').val().trim()

        if (!usernameInput || usernameInput.length <= 0 || !passwordInput || passwordInput.length < 5) {
            return false
        } else {
            return true
        }
    }

    checkUserValid() {
        var usernameVal = $('#usernameInput').val().trim()
        var passwordVal = $('#passwordInput').val().trim()
        var result = null
        $.each(fakeData, function(index, obj) {
            if (usernameVal == obj.username && passwordVal == obj.password) {

                result = obj

            }
        })

        return result

    }
}


//fake data
var fakeData = [{
    username: "cuong",
    password: "12345",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_USER"
}, {
    username: "admin",
    password: "12345",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_ADMIN"
}]