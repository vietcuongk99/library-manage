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

                    //khai báo biến và lấy giá trị userID
                    //lưu thông tin đăng nhập vào localStorage
                    var user = res.data;
                    var userID = user.userID;
                    localStorage.setItem("user", JSON.stringify(user));

                    //gọi hàm getBorrowList()
                    loginJS.getBorrowList(userID);

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


    //gọi api lấy ra danh sách mượn sách của người dùng
    getBorrowList(userID) {

        //khai báo array chứa danh sách mượn cửa người dùng
        //lưu vào storage
        var borrowList = [];

        //call api
        $.ajax({
            method: "GET",
            url: HOST_URL + "api/BookBorrow/GetPagingData?userId=" + userID,
            contentType: "application/json"

        }).done(function(res) {
            //nếu server xử lý thành công
            if (res.success) {

                var list = res.data;
                //gán giá trị cho borrowItem và lưu vào borrowList
                list.forEach(item => {
                    var borrowItem = {};
                    borrowItem.bookBorrowID = item.bookBorrowID;
                    borrowItem.bookID = item.bookID;
                    borrowItem.borrowDate = commonJS.getDateString(new Date(item.borrowDate), Enum.ConvertOption.YEAR_FIRST);
                    borrowItem.returnDate = commonJS.getDateString(new Date(item.returnDate), Enum.ConvertOption.YEAR_FIRST);
                    borrowList.push(borrowItem)

                });

                //lưu borrowList vào local storage
                localStorage.setItem("borrowList", JSON.stringify(borrowList));

                commonBaseJS.showLoadingData(0);
                commonBaseJS.showToastMsgSuccess("Đăng nhập thành công.");

                //chuyển sang trang index
                setTimeout(function() {
                    window.open("index.html", "_self")
                }, 1500);
            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showToastMsgFailed("Lấy thông tin sách đang mượn thất bại.");
        })

    }

}