$(document).ready(function() {

})


//class quản lý các sự kiện cho thanh header dùng chung
class BaseJS {
    constructor() {
        this.loadUserData();
    }


    loadUserData() {

        //lấy thông tin user từ localStorage
        var userValue = localStorage.getItem("user")
        var userObject = JSON.parse(userValue)

        //nếu user khác null
        if (userObject) {

            var userName = userObject.userName;
            var userAvatarURL = userObject.avatarUrl;
            console.log(userName)

            //khai báo các thành phần html
            var manageSystemBtn = `<li class="nav-item"><a class="nav-link" href="admin.html">Quản lý hệ thống</a></li>`

            var dropDownAction = `<li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownAvatar" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <img src="` + userAvatarURL + `" class="avatar-icon"></a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownAvatar">
                <p class="dropdown-item" style="font-weight: bold;">` + userName + `</p>
                <a class="dropdown-item" href="account.html">Tài khoản cá nhân</a>
                <a class="dropdown-item" href="login.html">Đăng xuất</a>
            </div>
            </li>`

            //nếu user là admin
            //thêm đường dẫn tới trang admin.html
            if (userObject.role == "ROLE_ADMIN") {
                $('#navItemList').append(manageSystemBtn)
                $('#navItemList').append(dropDownAction)
            }
            //nếu user không phải admin
            else {
                $('#navItemList').append(dropDownAction)
            }
        } else {
            var loginBtn = `<li class="nav-item"><a class="nav-link" href="login.html">Đăng nhập</a></li>`
            $('#navItemList').append(loginBtn)
            console.log(userObject)
        }

    }

}