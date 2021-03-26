//hằng số lưu đường dẫn host mặc định
const HOST_URL = "https://localhost:44328/"

$(document).ready(function() {

})


//class quản lý các sự kiện cho thanh header dùng chung
class BaseJS {
    constructor() {
        this.loadDataNav()
        this.loadAvatarNav();
    }


    //load dữ liệu trên thanh nav bar
    loadDataNav() {

        //lấy thông tin user từ localStorage
        var userValue = localStorage.getItem("user")
        var userObject = JSON.parse(userValue)

        //nếu user khác null
        if (userObject) {

            //khai báo biến lưu giá trị từ userObject
            var userName = userObject.userName;
            var adminUrl = HOST_URL + "admin"

            //khai báo các thành phần html
            var manageSystemBtn = `<li class="nav-item"><a class="nav-link" href="` + adminUrl + `">Quản lý hệ thống</a></li>`
            var dropDownAction = `<li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownAvatar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img id="userAvatarNav" class="avatar-icon"></a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownAvatar">
                <p class="dropdown-item" style="font-weight: bold;">` + userName + `</p>
                <a class="dropdown-item" href="/page/account.html">Chi tiết tài khoản</a>
                <a class="dropdown-item" href="/page/login.html">Đăng xuất</a>
            </div>
            </li>`

            //nếu user là admin
            //thêm đường dẫn tới trang admin.html
            if (userObject.isAdmin == 1) {
                $('#navItemList').append(manageSystemBtn)
                $('#navItemList').append(dropDownAction)
            }
            //nếu user không phải admin
            else {
                $('#navItemList').append(dropDownAction)
            }
        } else {
            var loginBtn = `<li class="nav-item"><a class="nav-link" href="/page/login.html">Đăng nhập</a></li>`
            $('#navItemList').append(loginBtn)
            console.log(userObject)
        }

    }

    //load dữ liệu ảnh đại diện user trên thanh nav bar
    loadAvatarNav() {
        //lấy thông tin user từ localStorage
        var userValue = localStorage.getItem("user")
        var userObject = JSON.parse(userValue)
        if (userObject) {
            $.ajax({
                method: "GET",
                url: HOST_URL + "api/UserAccount/GetImageFromUrl" + "?userID=" + userObject.userID + "&avatarUrl=" + userObject.avatarUrl,
                contentType: "application/json"
            }).done(function(res) {
                if (res.success) {
                    var userData = res.data
                    if (userData.userAvatarBase64String != null) {
                        $('#userAvatarNav').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
                    } else {
                        $('#userAvatarNav').attr('src', "../content/img/avatar-sample.png")
                    }

                } else {
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showToastMsgFailed("Tải ảnh đại diện không thành công.");
            })
        }

    }

}