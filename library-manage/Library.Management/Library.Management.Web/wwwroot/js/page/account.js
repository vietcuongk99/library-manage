// lấy userId từ localStorage
var userObject = JSON.parse(localStorage.getItem("user"))
var userID = userObject.userID
var userAvatarURL = userObject.avatarUrl
$(document).ready(function() {

    accountJS = new AccountJS()
})


//class quản lý các sự kiện trong trang account.html
class AccountJS extends BaseJS {
    constructor() {
        super();
        this.loadUserAvatar();
        this.loadUserData();
        this.initEvent();

    }


    ///load dữ liệu cá nhân của user
    loadUserData() {
        var userData = {}
        $.ajax({
            method: "GET",
            url: host + "api/UserAccount/" + userID,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                userData = res.data;
                //gán giá trị và thuộc tính cho các thành phần input trên trang account
                $('#userFullName').attr('value', userData.firstName + userData.lastName)
                $('#userAddress').text(userData.street + ', ' + userData.district + ', ' + userData.province)
                $('#userName').attr('value', userData.userName)
                $('#userEmail').attr('value', userData.email)
                $('#userPassword').attr('value', userData.password)
            } else {
                alert("Lấy dữ liệu người dùng thất bại")
            }
        }).fail(function(res) {
            alert("Lấy dữ liệu user không thành công")
        })

    }

    //load dữ liệu ảnh đại diện của user
    loadUserAvatar() {

        $.ajax({
            method: "GET",
            url: host + "api/UserAccount/GetImageFromUrl" + "?userID=" + userID + "&avatarUrl=" + userAvatarURL,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                var userData = res.data;
                //gán giá trị cho thuộc tính của thành phần image trên trang account.html và thanh nav bar
                //cập nhật thay đổi mới nhất sau khi setUserAvatar() thực thi thành công
                $('#userAvatar').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
                $('#userAvatarNav').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
            } else {
                alert("Tải avatar người dùng thất bại")
            }
        }).fail(function(res) {
            alert("Lấy dữ liệu avatar của người dùng không thành công")
        })

    }

    //gán sự kiện trong trang
    initEvent() {
        this.showImgPreviewModal()
        $('#confirmImg').on('click', this.setUserAvatar)
    }

    //xử lý sự kiện sau khi chọn file
    //tham khảo:https://tungnt.net/download-va-upload-anh-su-dung-asp-net-web-api-tren-asp-net-mvc/?fbclid=IwAR2hYsV3SOdp-E2TYrNdmFSx6I6x6pOQz88GhKu8ljKLVQ9VdzUAKA2PpMc
    showImgPreviewModal() {
        $('#chooseImg').change(function() {
            $('#previewImg').attr('style', 'width: 300px; height: 300px')
            $('#modalUpdateAvatar').modal('show')
            if (this.files && this.files[0]) {
                //When choose image complete using FileReader to convert image to Base64 string
                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#previewImg').attr('src', e.target.result);
                }
                reader.readAsDataURL(this.files[0])
            }

        })
    }

    //xử lý sự kiện khi click nút "Đặt ảnh đại diện"
    setUserAvatar() {
        //lấy dữ liệu user từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user"));
        //tạo data
        var data = {
            userId: userObject.userID,
            userAvatarBase64String: $("#previewImg").attr("src").split(",")[1]
        };

        //call api
        $.ajax({
            method: "POST",
            url: host + "api/UserAccount/SaveImageToUrl",
            contentType: "application/json",
            data: JSON.stringify(data)
        }).done(function(res) {
            if (res.success) {
                //show alert
                // alert("Thay đổi avatar thành công.");
                //ẩn modal thay đổi avatar
                $('#modalUpdateAvatar').modal('hide');
                accountJS.addAlertDiv();
                //gọi lại hàm loadUserAvatar của accountJS Object
                //cập nhật lại thay đổi mới nhất
                accountJS.loadUserAvatar();

            } else {
                //show alert
                alert("Thay đổi avatar thất bại")
            }
        }).fail(function(res) {
            //show alert
            alert("Không thực hiện được thao tác thay đổi avatar")
        })
    }


    //thêm thành phần html khi thay đổi avatar thành công
    addAlertDiv() {
        if ($('#alertDiv')) {
            $('#alertDiv').remove()
        }
        var alertDiv = $(`<div id="alertDiv" class="alert alert-success" role="alert">Thay đổi ảnh đại diện thành công.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`)
        alertDiv.insertBefore('#breadCrumbBar')
    }


}