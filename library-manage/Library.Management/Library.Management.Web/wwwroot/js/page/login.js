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
            commonBaseJS.showLoadingData(1);
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
                    commonBaseJS.showLoadingData(0);
                    commonBaseJS.showToastMsgSuccess("Đăng nhập thành công.");
                    //lưu thông tin đăng nhập vào localStorage
                    var user = res.data;
                    localStorage.setItem("user", JSON.stringify(user));

                    //lưu list sách đang mượn của user
                    //fake data đợi api
                    localStorage.setItem("borrowList", JSON.stringify(borrowList));

                    //chuyển sang trang index
                    setTimeout(function() {
                        window.open("index.html", "_self")
                    }, 2000);

                } else {
                    //gọi phương thức thêm alert div của loginJS object
                    commonBaseJS.showLoadingData(0);
                    //show alert cảnh báo
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                //show alert cảnh báo
                commonBaseJS.showLoadingData(0);
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
    bookBorrowID: "4d70f6bd-70a7-44e8-9c82-0d370ed2ccdb",
    bookAuthor: "Hiroshi Fujimoto",
    bookId: "00000000-0000-0000-0000-000000000000",
    bookImageUri: "../content/img/avatar-book-default.jpg",
    bookName: "Truyện tranh Doraemon",
    borrowDate: "2021-03-30",
    borrowStatus: 1,
    returnDate: "2021-04-22",
}]