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