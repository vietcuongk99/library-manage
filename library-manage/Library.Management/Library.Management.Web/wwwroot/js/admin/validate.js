//var domain = window.location.href;

//if (!domain.includes('admin')) {
//    window.location.href = '/page/index.html';
//}
//else {
//    //Nếu chưa đăng nhập thì redirect sang trang đăng nhập
//    if (true) {
//        alert('Trước hết bạn cần đăng nhập với tài khoản admin!');
//        window.location.href = '/page/login.html';
//    }
//    //Nếu đăng nhập rồi mà không phải là admin thì về trang trước
//    else if (true) {
//        alert('Bạn không có quyền sử dụng chức năng này. Vui lòng đăng nhập dưới quyền admin!');
//        window.history.go(-1);
//    }
//}

//$(document).ready(function () {
//    var common = new Common();
//});

//class Common {
//    constructor() {
//        this.CheckIsAdmin();
//    } 

//    CheckIsAdmin() {
//        debugger

//        alert('Bạn không có quyền vào trang quản trị. Vui lòng đăng nhập dưới quyền admin!');
//        window.location.href = '/page/index.html';
//    }
//}

class Validation {
    constructor() {

    }

    static validateBookDetail(type_param, value, min, max) {
        let validateObj = {
            idIsValid: true,
            msg: 'Không được để trống'
        };

        // kiem tra ID có trống không
        if (!value) {
            validateObj.idIsValid = false;
            return validateObj;
        }

        if (type_param == "BookCode") {
            // kiem tra ID da ton tai trong database hay chua
            validateObj.msg = 'Mã sách đã tồn tại';
            validateObj.idIsValid = !Validation.checkBookCode(value);
            if (!validateObj.idIsValid) {
                return validateObj;
            }
        }

        if (type_param == "NumberInput") {
            validateObj.msg = 'Nhập giá trị trong khoảng ' + min + ' đến ' + max;
            if (value > max || value < min) {
                validateObj.idIsValid = false;
                return validateObj;
            }
        }
        // vuot qua kiem tra
        validateObj.msg = "";
        return validateObj;
    }

    static checkBookCode(code) {

        let duplicate = false;
        $.ajax({
            method: "GET",
            url: '/api/BookDetail/GetEntityByCode',
            data: { code : code },
            async: false,
            success: function (res) {
                // không return được ở đây
                duplicate = res.success;
            },
            error: function () {
                console.log("Lỗi khi gọi API");
                // return false;
            }
        });
        return duplicate;
    }
}