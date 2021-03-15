/** --------------------------------------
 * Đối tượng js chứa các hàm sử dụng chung
 * Author: NVMANH ()
 * ---------------------------------------*/
var commonJS = {

    getDateStringYYYYMMdd(date) {
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var dateString = date.getFullYear() + "-" + (month) + "-" + (day);
        return dateString;
    }
}