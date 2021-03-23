const host = "https://localhost:44328/"
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
        $('#confirmBtn').on('click', this.confirmOTPCodeEvent.bind(this))
        commonJS.addEnterEvent(this.confirmOTPCodeEvent)

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
            //call api
            $.ajax({
                method: "POST",
                url: host + "api/UserAccount/ChangeConfirmPassWordStepTwo",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).done(function(res) {
                if (res.success) {
                    //show alert
                    alert("Thay đổi mật khẩu thành công. Quay trở lại màn hình đăng nhập.");
                    //chuyển sang trang login
                    window.open("login.html", "_self")

                } else {
                    //show alert
                    alert("Thay đổi mật khẩu thất bại")
                }
            }).fail(function(res) {
                //show alert
                alert("Không thực hiện được thao tác thay đổi mật khẩu")
            })

        } else {
            console.log("Dữ liệu chưa validated")
        }


    }

    //chi tiết xử lý validate dữ liệu
    validateInput() {
        //khai báo và gán giá trị kết quả trả về
        var result = true;
        //lấy input từ người dùng
        var codeInput = $('#codeInput').val().trim()

        //self - invoked
        //validate email, password của người dùng
        //code otp gồm số 6 chữ số
        var codeValid = (function validateCode(code) {
            return (code >= 100000 && code <= 999999);
        })(codeInput)

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