// khai báo đường dẫn host mặc định
const HOST_URL = "https://localhost:44328/"
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
                url: HOST_URL + "api/UserAccount/LoginUserAccount",
                data: JSON.stringify(userInput),
                contentType: "application/json"

            }).done(function(res) {
                //nếu response trả về success (response.success: true)
                if (res.success) {
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Đăng nhập thành công.");
                    //lưu thông tin đăng nhập vào localStorage
                    var user = res.data;

                    //khai báo list sách đang mượn của user
                    //fake data đợi api
                    user.borrowList = borrowList;

                    localStorage.setItem("user", JSON.stringify(user));
                    //chuyển sang trang index
                    setTimeout(function() {
                        window.open("index.html", "_self")
                    }, 3000);

                } else {
                    //gọi phương thức thêm alert div của loginJS object

                    //show alert cảnh báo
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                //show alert cảnh báo
                //lỗi bên server
                commonBaseJS.showToastMsgFailed("Đăng nhập không thành công.");
            })

        } else {

            //gọi phương thức thêm alert div của loginJS object
            //loginJS.addAlertDiv();
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

}


//fake data

var borrowList = [{
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee46",
        returnDate: "30/4/2021",
        borrowDate: "26/1/2021",
        borrowStatus: 1
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee49",
        returnDate: "28/3/2021",
        borrowDate: "28/2/2021",
        borrowStatus: 1
    },
    {
        bookId: "4b7e5d02-1646-4b65-9a3e-92bfbb0bee47",
        returnDate: "30/3/2021",
        borrowDate: "26/2/2021",
        borrowStatus: 1
    },
    {
        bookId: "5cef5b7b-0e86-43c6-89c4-868efa0a0aad",
        returnDate: "30/3/2021",
        borrowDate: "1/3/2021",
        borrowStatus: 1
    }
]