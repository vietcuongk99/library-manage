$(document).ready(function() {
    confirmOTPCodeJS = new ConfirmOTPCodeJS()
})

//class quản lý các sự kiện trang confirm-otp.html
class ConfirmOTPCodeJS {
    constructor() {
        this.loadData()
        this.initEvent()
    }

    loadData() {}

    //gán sự kiện cho các thẻ liên quan trên trang change-pass.html
    initEvent() {
        //bind đối tượng this cho hàm của changePassJS Object
        $('#confirmBtn').on('click', this.confirmOTPCodeEvent.bind(this));
        commonJS.addEnterEvent(this.confirmOTPCodeEvent);
    }

    //chi tiết xử lý khi click nút "xác nhận"
    confirmOTPCodeEvent() {
        if (confirmOTPCodeJS.validateInput()) {
            //lấy giá trị otp code từ input và giá trị email, password trong sessionStorage
            var codeInput = $('#codeInput').val()
            var emailValue = sessionStorage.getItem("email");
            var passwordValue = sessionStorage.getItem("password");
            //khai báo và gán giá trị data trước khi gọi api
            var data = {
                "email": emailValue,
                "passWord": passwordValue,
                "otp": parseInt(codeInput)
            };
            commonBaseJS.showLoadingData(1);
            //call api
            $.ajax({
                method: "POST",
                url: Enum.URL.HOST_URL + "api/UserAccount/ChangeConfirmPassWordStepTwo",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).done(function(res) {
                if (res.success) {
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Thay đổi mật khẩu thành công.");
                    //chuyển sang trang login
                    setTimeout(function() {
                        window.open("login.html", "_self")
                    }, 2000);
                } else {
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgFailed("Đổi mật khẩu không thành công.");
            })
        } else {
            commonBaseJS.showToastMsgFailed("Xử lý dữ liệu không thành công.");
        }
    }

    //chi tiết xử lý validate dữ liệu
    validateInput() {
        //khai báo và gán giá trị kết quả trả về
        var result = true;
        //lấy input từ người dùng
        var codeInput = $('#codeInput').val().trim();
        //self - invoked
        //validate email, password của người dùng
        //code otp gồm số 6 chữ số
        var codeValid = (function validateCode(code) {
            return (code >= 100000 && code <= 999999);
        })(codeInput);
        //xử lý nếu các input không thỏa mãn validate
        var alertDiv;
        if (!codeValid) {
            alertDiv = $(`<small id="alertInput" class="form-text text-danger">Bạn cần nhập đúng định dạng mã OTP (số 6 chữ số)</small>`)
            if ($('#codeInput').next()) {
                $('#codeInput').next().remove()
            }
            $('#codeInputDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#codeInput').next()) {
                $('#codeInput').next().remove()
            }
        }
        return result;
    }

}