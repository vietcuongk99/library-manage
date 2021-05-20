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
        $('#signUpLink').prop('href', "./signup.html");
        $('#changePassword').prop('href', "./change-pass.html").on('click', this.changePassEvent.bind(this));
        //gán ẩn hiện mật khẩu cho input nhập mật khẩu
        $(document).on('click', '#togglePassword', function() {
            commonJS.togglePassword('#togglePassword', '#passwordInput');
        });
    }

    //chi tiết xử lý khi click nút "đăng nhập"
    loginEvent() {
        //lấy dữ liệu input và validate input
        var validateCheck = loginJS.validateInput(),
            usernameInput = $('#usernameInput').val().trim(),
            passwordInput = $('#passwordInput').val().trim();
        //nếu validate thành công
        if (validateCheck) {
            //khởi tạo data trước khi call api
            var userInput = { "userName": usernameInput, "passWord": passwordInput };
            commonBaseJS.showLoadingData(1);
            //call api
            $.ajax({
                method: "POST",
                url: Enum.URL.HOST_URL + "api/UserAccount/LoginUserAccount",
                data: JSON.stringify(userInput),
                contentType: "application/json"
            }).done(function(res) {
                //nếu response trả về success (response.success: true)
                if (res.success) {
                    //khai báo biến và lấy giá trị userID
                    //lưu thông tin đăng nhập vào localStorage
                    var user = res.data,
                        userRole = res.data.conditionAccount;
                    localStorage.setItem("user", JSON.stringify(user));
                    debugger
                    //gọi hàm getBorrowList()
                    //loginJS.getBorrowList(userID);
                    //ẩn loading
                    commonBaseJS.showLoadingData(0);
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Đăng nhập thành công.");
                    //chuyển sang trang index sau 1.5s
                    setTimeout(function() {
                        //chuyển người dùng sang trang chủ nếu người dùng không phải cấp quản lý
                        //chuyển người dùng sang trang quản lý hệ thống nếu người dùng thuộc cấp quản lý
                        (userRole == Enum.UserRole.Normal) ?
                        (window.open("index.html", "_self")) :
                        (window.open(Enum.URL.HOST_URL + "admin", "_self"));
                    }, 1500);
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
            //show alert cảnh báo
            commonBaseJS.showToastMsgFailed("Bạn cần nhập đúng tên đăng nhập và mật khẩu.");
        }
    }

    //chi tiết xử lý khi click link "đăng nhập với tư cách khách"
    guestLoginEvent() {
        //lưu dữ liệu user vào localStorage với giá trị null
        localStorage.setItem("user", null)
    }

    //chi tiết xử lý khi click link "quên mật khẩu"
    changePassEvent() {}

    //chi tiết xử lý validate input của người dùng
    validateInput() {
        //lấy dữ liệu input
        var usernameInput = $('#usernameInput').val().trim(),
            passwordInput = $('#passwordInput').val().trim();
        //username chứa tối thiểu 5 kí tự và không có khoảng trắng
        //password chứa tối thiểu 5 kí tự và không có khoảng trắng
        if (!usernameInput || usernameInput.length < 5 ||
            !passwordInput || passwordInput.length < 5 ||
            usernameInput.includes(" ") ||
            passwordInput.includes(" ")) {
            return false;
        } else {
            return true;
        }
    }

    //lấy ra danh sách mượn sách của người dùng
    getBorrowList(userID) {
        debugger
        //call api
        $.ajax({
            method: "GET",
            url: Enum.URL.HOST_URL + "api/BookBorrow/GetPagingData?userId=" + userID,
            contentType: "application/json",
            cache: false
        }).done(function(res) {
            debugger
            //nếu server xử lý thành công
            if (res.success) {
                //lấy data từ response
                var list = res.data;
                //lưu danh sách mượn vào localStorage
                commonJS.saveBorrowListToLocal(list);
                //ẩn loading
                commonBaseJS.showLoadingData(0);
                //show alert
                commonBaseJS.showToastMsgSuccess("Đăng nhập thành công.");
                //chuyển sang trang index sau 1.5s
                setTimeout(function() {
                    window.open("index.html", "_self")
                }, 1500);
            } else {
                //show alert
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            //show alert
            commonBaseJS.showToastMsgFailed("Lấy thông tin sách đang mượn thất bại.");
        })
    }
}