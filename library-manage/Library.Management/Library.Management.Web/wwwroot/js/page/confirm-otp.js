const host = "https://localhost:44328/"
$(document).ready(function() {
    confirmChangePassJS = new ConfirmChangePassJS()
})


//class quản lý các sự kiện trang confirm-otp.html
class ConfirmChangePassJS {

    constructor() {
        console.log("pass")
        this.loadData()
        this.initEvent()
    }


    loadData() {}

    //gán sự kiện cho các thẻ liên quan trên trang change-pass.html
    initEvent() {
        //bind đối tượng this cho hàm của changePassJS Object
        $('#confirmBtn').on('click', this.confirmOTPCodeEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "xác nhận"
    confirmOTPCodeEvent() {
        if (this.validateInput()) {
            //lấy giá trị otp code từ input và giá trị email, password trong localStorage
            var codeInput = $('#codeInput').val()
            debugger
            var data = {
                "email": localStorage.getItem("email"),
                "passWord": localStorage.getItem("password"),
                "otp": parseInt(codeInput)
            }

            //call api
            $.ajax({
                method: "POST",
                url: host + "api/UserAccount/ChangeConfirmPassWordStepTwo",
                contentType: "application/json",
                data: JSON.stringify(data)
            }).done(function(res) {
                if (res.success) {
                    debugger
                    alert("Thay đổi mật khẩu thành công. Quay trở lại màn hình đăng nhập.")
                    window.open("login.html", "_self")

                } else {
                    debugger
                    alert("Thay đổi mật khẩu thất bại")
                }
            }).fail(function(res) {
                debugger
                alert("Không thực hiện được thao tác thay đổi mật khẩu")
            })

        } else {
            console.log("Dữ liệu chưa validated")
        }


    }

    //chi tiết xử lý validate dữ liệu
    validateInput() {
        var result = true;
        var codeInput = $('#codeInput').val().trim()

        //self - invoked
        //validate email, password của người dùng
        var codeValid = (function validateCode(code) {
            return code >= 100000;
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

var user = {
    userName: "dinh viet Cuong",
    avatarUrl: "../content/img/avatar-sample.png",
    role: "ROLE_ADMIN"
}