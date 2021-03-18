$(document).ready(function() {
    // xóa bỏ dữ liệu cũ trong localStorage
    localStorage.clear()

    changePassJS = new ChangePassJS()
})


//class quản lý các sự kiện trang change-pass.html
class ChangePassJS {

    constructor() {
        console.log("pass")
        this.loadData()
        this.initEvent()
    }


    loadData() {}

    //gán sự kiện cho các thẻ liên quan trên trang change-pass.html
    initEvent() {
        //bind đối tượng this cho hàm của changePassJS Object
        $('#confirmBtn').on('click', this.updatePassEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "cập nhật"
    updatePassEvent() {
        if (this.validateInput()) {
            //lưu dữ liệu user vào localStorage với giá trị trả về từ API
            localStorage.setItem("user", JSON.stringify(user))
            window.open("index.html", "_self")
        } else {
            console.log("Dữ liệu chưa validated")
        }


    }

    //chi tiết xử lý validate dữ liệu
    validateInput() {
        var result = true;
        var emailInput = $('#emailInput').val().trim()
        var passwordInput = $('#passwordInput').val().trim()
        var rePasswordInput = $('#rePasswordInput').val().trim()

        //self - invoked
        //validate email, password của người dùng
        var emailValid = (function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        })(emailInput)

        var passwordValid = (function validatePassword(password) {
            return password.length >= 5
        })(passwordInput)

        if (passwordInput) {
            var rePasswordValid = (function validateRePassWord(rePassword, password) {
                return rePassword == password
            })(rePasswordInput, passwordInput)
        }

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
        if (!passwordValid) {
            alertDiv = $(`<small id="alertPasswordInput" class="form-text text-danger">Mật khẩu cần chứa tối thiểu 5 kí tự.</small>`)
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

        return result;

    }

}

var user = {
    userName: "dinh viet Cuong",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_ADMIN"
}