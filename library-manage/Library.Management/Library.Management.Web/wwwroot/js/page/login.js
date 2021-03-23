const host = "https://localhost:44328/"
$(document).ready(function() {
    //xóa dữ liệu user cũ trong localStorage và sessionStorage
    localStorage.clear()
    sessionStorage.clear()

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

        //this = loginJS
        $('#loginBtn').on('click', this.loginEvent.bind(this));
        //gán sự kiện cho nút đăng nhập khi nhấn enter
        commonJS.addEnterEvent(this.loginEvent)
        $('#guestLoginLink').prop('href', "./index.html").on('click', this.guestLoginEvent.bind(this))
        $('#signUpLink').prop('href', "./signup.html").on('click', this.signUpEvent.bind(this))
        $('#changePassword').prop('href', "./change-pass.html").on('click', this.changePassEvent.bind(this))

    }

    //chi tiết xử lý khi click nút "đăng nhập"
    loginEvent() {
        //lấy dữ liệu input và validate input
        var validateCheck = loginJS.validateInput()
        var usernameInput = $('#usernameInput').val().trim()
        var passwordInput = $('#passwordInput').val().trim()

        //nếu validate thành công
        if (validateCheck) {
            //khởi tạo data trước khi call api
            var userInput = { "userName": usernameInput, "passWord": passwordInput };
            //call api
            $.ajax({
                method: "POST",
                url: host + "api/UserAccount/LoginUserAccount",
                data: JSON.stringify(userInput),
                contentType: "application/json"

            }).done(function(res) {
                //nếu response trả về success (response.success: true)
                if (res.success) {
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Đăng nhập thành công.");
                    //lưu thông tin đăng nhập vào localStorage
                    var user = res.data
                    localStorage.setItem("user", JSON.stringify(user));
                    //chuyển sang trang index
                    window.open("index.html", "_self");
                } else {
                    //gọi phương thức thêm alert div của loginJS object

                    loginJS.addAlertDiv(); //this = ajax
                    //show alert cảnh báo
                    alert(res.message);
                }
            }).fail(function(res) {
                //show alert cảnh báo
                //lỗi bên server
                commonBaseJS.showToastMsgFailed("Đăng nhập không thành công.");
            })

        } else {

            //gọi phương thức thêm alert div của loginJS object
            loginJS.addAlertDiv();
            //show alert cảnh báo
            commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý, đăng nhập không thành công.");
        }
    }

    //chi tiết xử lý khi click link "đăng nhập với tư cách khách"
    guestLoginEvent() {
        //lưu dữ liệu user vào localStorage với giá trị null
        localStorage.setItem("user", null)
    }

    //chi tiết xử lý khi click link "đăng ký"
    signUpEvent() {}

    //chi tiết xử lý khi click link "quên mật khẩu"
    changePassEvent() {}

    //chi tiết xử lý validate input của người dùng
    validateInput() {
        //lấy dữ liệu input
        var usernameInput = $('#usernameInput').val().trim()
        var passwordInput = $('#passwordInput').val().trim()

        //username chứa tối thiểu 5 kí tự và không có khoảng trắng
        //password chứa tối thiểu 5 kí tự và không có khoảng trắng
        if (!usernameInput || usernameInput.length < 5 ||
            !passwordInput || passwordInput.length < 5 ||
            usernameInput.includes(" ") ||
            passwordInput.includes(" ")) {
            return false
        } else {
            return true
        }
    }

    //thêm thành phần html cho sự kiện alert khi đăng nhập
    addAlertDiv() {
        if ($('#alertDiv')) {
            $('#alertDiv').remove()
        }
        var alertDiv = $(`<div id="alertDiv" class="alert alert-danger" role="alert">Sai tên đăng nhập hoặc mật khẩu.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`)
        alertDiv.insertBefore('#usernameInputDiv')
    }

}