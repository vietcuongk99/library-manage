$(document).ready(function() {
    // xóa bỏ dữ liệu cũ trong localStorage
    localStorage.clear()

    signUpJS = new SignUpJS()
})


//class quản lý các sự kiện trang signup.html
class SignUpJS {


    constructor() {
        this.loadData()
        this.initEvent()
    }


    loadData() {}

    //gán sự kiện cho các thẻ liên quan trên trang signup.html
    initEvent() {
        //bind đối tượng this cho hàm của signupJS Object
        $('#signUpBtn').on('click', this.signUpEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "cập nhật"
    signUpEvent() {

        debugger
        var checkValidated = this.validateInput()
        if (checkValidated) {
            //lưu dữ liệu user vào localStorage với giá trị trả về từ API
            localStorage.setItem("user", JSON.stringify(user2))
            debugger
            window.open("index.html", "_self")
        } else {
            console.log("Dữ liệu chưa được validated, đăng ký tài khoản thất bại")
        }

    }

    //chi tiết xử lý validate input của người dùng
    validateInput() {

        var result = true;
        var emailInput = $('#emailInput').val().trim()
        var usernameInput = $('#usernameInput').val().trim()
        var passwordInput = $('#passwordInput').val().trim()
        var rePasswordInput = $('#rePasswordInput').val().trim()
        var checkBoxInput = $('#checkBox')[0].checked

        //self - invoked
        //validate email, username, password, checkbox của người dùng
        var emailValid = (function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        })(emailInput)

        var usernameValid = (function validateUserName(username) {
            return username.length >= 5
        })(usernameInput)

        var passwordValid = (function validatePassword(password) {
            return password.length >= 5
        })(passwordInput)

        if (passwordInput) {
            var rePasswordValid = (function validateRePassWord(rePassword, password) {
                return rePassword == password
            })(rePasswordInput, passwordInput)
        }

        var checkBoxValid = (function validateCheckBox(checkBox) {
            return checkBox
        })(checkBoxInput)

        //xử lý nếu các input không thỏa mãn validate
        var alertDiv;
        if (!emailValid) {
            alertDiv = $(`<small id="alertEmailInput" class="form-text text-danger">Email chưa đúng định dạng.</small>`)
            if ($('#emailInput').next()) {
                $('#emailInput').next().remove()
            }
            $('#emailInputDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#emailInput').next()) {
                $('#emailInput').next().remove()
            }
        }
        if (!usernameValid) {
            alertDiv = $(`<small id="alertUsernameInput" class="form-text text-danger">Tên đăng nhập cần chứa tối thiểu 5 kí tự.</small>`)
            if ($('#usernameInput').next()) {
                $('#usernameInput').next().remove()
            }
            $('#usernameInputDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#usernameInput').next()) {
                $('#usernameInput').next().remove()
            }
        }
        if (!passwordValid) {
            alertDiv = $(`<small id="alertPasswordInput" class="form-text text-danger">Mật khẩu cần chứa tối thiểu 5 kí tự và không có khoảng trắng.</small>`)
            if ($('#passwordInput').next()) {
                $('#passwordInput').next().remove()
            }
            $('#passwordInputDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#passwordInput').next()) {
                $('#passwordInput').next().remove()
            }
        }
        if (!rePasswordValid && passwordInput) {
            alertDiv = $(`<small id="alertRePassInput" class="form-text text-danger">Nhập lại mật khẩu chưa đúng.</small>`)
            if ($('#rePasswordInput').next()) {
                $('#rePasswordInput').next().remove()
            }
            $('#rePasswordInputDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#rePasswordInput').next()) {
                $('#rePasswordInput').next().remove()
            }
        }
        if (!checkBoxValid) {
            alertDiv = $(`<small id="alertCheckBoxInput" class="form-text text-danger">Bạn cần tích vào ô trên.</small>`)
            if ($('#checkBoxTitle').next()) {
                $('#checkBoxTitle').next().remove()
            }
            $('#checkboxInputDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#checkBoxTitle').next()) {
                $('#checkBoxTitle').next().remove()
            }
        }

        return result;

    }
}

//fake data
var user = {
    userName: "vietcuong_admin",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_ADMIN"
}

var user2 = {
    userName: "vietcuong",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_USER"
}