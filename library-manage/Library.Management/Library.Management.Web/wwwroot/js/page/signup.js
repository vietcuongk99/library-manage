const host = "https://localhost:44328/"
$(document).ready(function() {
    // xóa bỏ dữ liệu cũ trong localStorage và sessionStorage
    localStorage.clear()
    sessionStorage.clear()
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
        //this = signUpJS
        $('#signUpBtn').click(this.signUpEvent.bind(this))
        commonJS.addEnterEvent(this.signUpEvent)

    }

    //chi tiết xử lý khi click nút "đăng ký"
    signUpEvent() {

        //lấy giá trị validate input
        var checkValidated = signUpJS.validateInput()

        //nếu validate input thành công
        if (checkValidated) {
            //khai báo data trước khi gọi api
            var data = {
                "userName": $('#usernameInput').val().trim(),
                "email": $('#emailInput').val().trim(),
                "password": $('#passwordInput').val().trim()
            };
            //gọi api
            $.ajax({
                method: "POST",
                url: host + "api/UserAccount/RegisterUserAccount",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).done(function(res) {
                if (res.success) {
                    //show alert
                    debugger
                    commonBaseJS.showToastMsgSuccess("Đăng ký tài khoản thành công.");
                    setTimeout(function () {
                        window.open("login.html", "_self")
                    }, 3000);
                    //mở trang login
                    

                } else {
                    //show aleert
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                //show alert
                commonBaseJS.showToastMsgFailed("Đăng ký không thành công.");
            })

        } else {
            commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý, đăng ký không thành công.");
        }

    }

    //chi tiết xử lý validate input của người dùng
    validateInput() {

        //khai báo kết quả trả về
        var result = true;

        //lấy input của người dùng
        var emailInput = $('#emailInput').val().trim()
        var usernameInput = $('#usernameInput').val().trim();
        var passwordInput = $('#passwordInput').val().trim()
        var rePasswordInput = $('#rePasswordInput').val().trim()
        var checkBoxInput = $('#checkBox')[0].checked

        //self - invoked
        //validate email, username, password, checkbox của người dùng
        //email đăng nhập phải có kí tự '@' và '.'
        var emailValid = (function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        })(emailInput)

        //tên đăng nhập không chứa khoảng trắng, tối thiểu 5 kí tự
        var usernameValid = (function validateUserName(username) {
            if (username.includes(" ")) {
                return false
            } else {
                return username.length >= 5
            }

        })(usernameInput)

        //password chứa tối thiểu 5 kí tự và không có khoảng trắng
        var passwordValid = (function validatePassword(password) {
            if (password.includes(" ")) {
                return false
            } else {
                return password.length >= 5
            }
        })(passwordInput)

        //password và repassword phải trùng khớp
        if (passwordInput) {
            var rePasswordValid = (function validateRePassWord(rePassword, password) {
                return rePassword == password
            })(rePasswordInput, passwordInput)
        }

        //checkBox phải được chọn
        var checkBoxValid = (function validateCheckBox(checkBox) {
            return checkBox
        })(checkBoxInput)

        //xử lý nếu các input không thỏa mãn validate
        //thêm alert div tương ứng trên giao diện
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
            alertDiv = $(`<small id="alertUsernameInput" class="form-text text-danger">Tên đăng nhập chứa tối thiểu 5 kí tự và không có khoảng trắng.</small>`)
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
            alertDiv = $(`<small id="alertPasswordInput" class="form-text text-danger">Mật khẩu chứa tối thiểu 5 kí tự và không có khoảng trắng.</small>`)
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