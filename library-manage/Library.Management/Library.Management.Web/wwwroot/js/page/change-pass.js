$(document).ready(function() {
    changePassJS = new ChangePassJS();
})

//class quản lý các sự kiện trang change-pass.html
class ChangePassJS {
    constructor() {
        this.loadData();
        this.initEvent();
    }
    loadData() {}

    //gán sự kiện cho các thẻ liên quan trên trang change-pass.html
    initEvent() {
        //this = changePassJS object
        $('#confirmBtn').on('click', this.updatePassEvent.bind(this));
        commonJS.addEnterEvent(this.updatePassEvent);
    }

    //chi tiết xử lý khi click nút "thay đổi"
    updatePassEvent() {
        //this = changePassJS 
        if (changePassJS.validateInput()) {
            //khai báo và gán data trước khi gọi api
            var data = {
                "email": $('#emailInput').val().trim(),
                "password": $('#passwordInput').val().trim()
            };
            commonBaseJS.showLoadingData(1);
            //call api
            $.ajax({
                method: "POST",
                url: Enum.URL.HOST_URL + "api/UserAccount/ChangeConfirmPassWordStepOne",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).done(function(res) {
                if (res.success) {
                    commonBaseJS.showLoadingData(0);
                    //lưu thông tin email và pass mới vào sessionStorage
                    sessionStorage.setItem("email", $('#emailInput').val().trim());
                    sessionStorage.setItem("password", $('#passwordInput').val().trim());
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Gửi mail chứa mã OTP thành công, vui lòng kiểm tra email.");
                    //mở trang confirm-otp
                    setTimeout(function() {
                        window.open("confirm-otp.html", "_self");
                    }, 2000);
                } else {
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed("Gửi mã OTP không thành công.");
            })
        } else {
            commonBaseJS.showToastMsgFailed("Xử lý dữ liệu không thành công.");
        }
    }

    //chi tiết xử lý validate dữ liệu
    validateInput() {
        //khai báo và gán giá trị kết quả trả về
        var result = true,
            //khai báo và gán giá trị từ input người dùng
            emailInput = $('#emailInput').val().trim(),
            passwordInput = $('#passwordInput').val().trim(),
            rePasswordInput = $('#rePasswordInput').val().trim(),
            //self - invoked
            //validate email, password của người dùng
            emailValid = (function validateEmail(email) {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            })(emailInput),
            //password chứa tối thiểu 5 kí tự và không có khoảng trắng
            passwordValid = (function validatePassword(password) {
                if (password.includes(" ")) {
                    return false;
                } else {
                    return password.length >= 5;
                }
            })(passwordInput);
        //password và repassword phải trùng khớp
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
                $('#emailInput').next().remove();
            }
            $('#emailInputDiv').append(alertDiv);
            result = false;
        } else {
            if ($('#emailInput').next()) {
                $('#emailInput').next().remove();
            }
        }
        if (!passwordValid) {
            alertDiv = $(`<small id="alertPasswordInput" class="form-text text-danger">Mật khẩu chứa tối thiểu 5 kí tự và không có khoảng trắng.</small>`)
            if ($('#passwordInput').next()) {
                $('#passwordInput').next().remove();
            }
            $('#passwordInputDiv').append(alertDiv);
            result = false;
        } else {
            if ($('#passwordInput').next()) {
                $('#passwordInput').next().remove()
            }
        }
        if (!rePasswordValid && passwordInput) {
            alertDiv = $(`<small id="alertRePassInput" class="form-text text-danger">Nhập lại mật khẩu chưa đúng.</small>`)
            if ($('#rePasswordInput').next()) {
                $('#rePasswordInput').next().remove();
            }
            $('#rePasswordInputDiv').append(alertDiv);
            result = false;
        } else {
            if ($('#rePasswordInput').next()) {
                $('#rePasswordInput').next().remove();
            }
        }
        return result;
    }
}