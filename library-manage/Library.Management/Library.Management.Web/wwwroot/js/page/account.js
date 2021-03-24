//hằng số lưu giá trị file hợp lệ
const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];

$(document).ready(function() {
    accountJS = new AccountJS()
})


//class quản lý các sự kiện trong trang account.html
class AccountJS extends BaseJS {
    constructor() {
        super();
        this.loadUserData();
        this.initEvent();

    }


    ///load dữ liệu cá nhân của user
    loadUserData() {
        var userData = {}

        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user"))
        var userID = userObject.userID

        //call api
        $.ajax({
            method: "GET",
            url: host + "api/UserAccount/" + userID,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                userData = res.data;

                //khai báo các biến và gán giá trị từ userData object
                //tên đầy đủ của người dùng
                var userFullNameTxt = ((userData.firstName) ? userData.firstName + " " : "") + ((userData.lastName) ? userData.lastName : "");
                if (userFullNameTxt.trim().length == 0) { userFullNameTxt = "chưa có" }
                //địa chỉ người dùng
                var userAddressTxt = ((userData.street) ? userData.street + ", " : "") +
                    ((userData.district) ? userData.district + ", " : "") +
                    ((userData.province) ? userData.province + ", " : "") +
                    ((userData.country) ? userData.country : "")
                if (userAddressTxt.trim().length == 0) { userAddressTxt = "chưa xác định" }
                //email của người dùng
                var userEmailTxt = (userData.email || userData.email.length > 0) ? userData.email : "chưa có"
                var userAge = (userData.age || userData.age > 0) ? userData.age : "chưa có"

                //gán giá trị và thuộc tính cho các thành phần thẻ p trên trang account
                $('#userFullName').text(userFullNameTxt)
                $('#userAddress').text(userAddressTxt)
                $('#userEmail').text(userEmailTxt)
                $('#userName').text(userData.userName)
                $('#userPassword').attr('value', userData.password)
                $('#userAge').text(userAge)

                //gán giá trị và thuộc tính cho các thành phần input trong modal trên trang account
                $('#firstNameInput').val(userData.firstName);
                $('#lastNameInput').val(userData.lastName);
                $('#ageInput').val(userData.age);
                $('#streetInput').val(userData.street);
                $('#districtInput').val(userData.district);
                $('#provinceInput').val(userData.province);
                $('#countryInput').val(userData.country);
                $('#emailInput').val(userData.email);

                //avatarUrl của người dùng
                //cập nhật thông tin mới nhất vào localStorage
                userObject.avatarUrl = userData.avatarUrl
                localStorage.setItem("user", JSON.stringify(userObject));
                // lấy thông tin user vừa cập nhật từ localStorage
                userObject = JSON.parse(localStorage.getItem("user"));
                //gọi hàm loadUserAvatar()
                accountJS.loadUserAvatar(userID, userObject.avatarUrl)


            } else {
                //show alert
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            //show alert
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })

    }

    //load dữ liệu ảnh đại diện của user
    loadUserAvatar(userID, userAvatarURL) {

        //call api
        $.ajax({
            method: "GET",
            url: host + "api/UserAccount/GetImageFromUrl" + "?userID=" + userID + "&avatarUrl=" + userAvatarURL,
            contentType: "application/json"
        }).done(function(res) {
            if (res.success) {
                var userData = res.data;
                //commonBaseJS.showToastMsgSuccess("Lấy dữ liệu thành công.");
                //gán giá trị cho thuộc tính của thành phần image trên trang account.html và thanh nav bar
                //cập nhật thay đổi mới nhất sau khi setUserAvatar() thực thi thành công
                if (userData.userAvatarBase64String != null) {
                    $('#userAvatar').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
                    $('#userAvatarNav').attr('src', "data:image/jpg;base64," + userData.userAvatarBase64String)
                }

            } else {
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            commonBaseJS.showToastMsgFailed("Lấy dữ liệu không thành công.");
        })

    }

    //gán sự kiện trong trang
    initEvent() {
        this.showImgPreviewModal()
        $('#confirmImg').on('click', this.setUserAvatar)
        $('#changePassword').on('click', function() {
            window.open("change-pass.html", "_self")
        })
        $('#updateInforBtn').on('click', this.updateUserInfor.bind(this))



    }

    //xử lý sự kiện sau khi chọn file
    //tham khảo:https://tungnt.net/download-va-upload-anh-su-dung-asp-net-web-api-tren-asp-net-mvc/?fbclid=IwAR2hYsV3SOdp-E2TYrNdmFSx6I6x6pOQz88GhKu8ljKLVQ9VdzUAKA2PpMc
    showImgPreviewModal() {
        $('#chooseImg').change(function() {

            //kiểm tra file input của người dùng
            if (this.files && this.files[0]) {


                //kiểm tra file hợp lệ
                //nếu file không phải định dạng jpg, jpeg, gif, png
                if (!validImageTypes.includes(this.files[0]['type'])) {
                    commonBaseJS.showToastMsgFailed("Định dạng file không hợp lệ (gif, jpeg, jpg, png)")

                } else {
                    $('#previewImg').attr('style', 'width: 300px; height: 300px');
                    $('#modalUpdateAvatar').modal('show');
                    //When choose image complete using FileReader to convert image to Base64 string
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $('#previewImg').attr('src', e.target.result);
                    }
                    reader.readAsDataURL(this.files[0])
                }

            }

        })
    }

    //xử lý sự kiện khi click nút "Đặt ảnh đại diện"
    setUserAvatar() {

        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user"))
        var userID = userObject.userID

        //tạo data
        var data = {
            userId: userID,
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
                commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                //gọi lại hàm loadUserData của accountJS Object
                //cập nhật lại thay đổi mới nhất
                accountJS.loadUserData();
            } else {
                //show alert
                commonBaseJS.showToastMsgFailed(res.message);
            }
        }).fail(function(res) {
            //show alert
            commonBaseJS.showToastMsgFailed("Cập nhật không thành công.");
        })
    }

    //validate email nhập vào từ người dùng (modal cập nhật thông tin)
    validateEmailInput() {

        //khai báo kết quả trả về
        var result = true;
        //lấy email input của người dùng
        var emailInput = $('#emailInput').val().trim()
            //kiểm tra input đã có chưa
        if (emailInput.length == 0) {
            $('#alertEmailTxt').text("Bạn không được để trống trường này.")
            result = false;
        }
        //nếu đã có input 
        else {
            //validate email input
            var emailValid = (function validateEmail(email) {
                var re = /\S+@\S+\.\S+/;
                return re.test(email);
            })(emailInput)

            //nếu email chưa được validate
            //thêm thành phần html
            if (!emailValid) {
                $('#alertEmailTxt').text("Email chưa đúng định dạng.")

                result = false;
            } else {
                $('#alertEmailTxt').text("")
            }
        }

        //trả về kết quả validate
        return result;

    }

    //xử lý sự kiện khi click nút Lưu thông tin (modal)
    updateUserInfor() {

        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user"))
        var userID = userObject.userID
        var userAvatarURL = userObject.avatarUrl

        //khai báo validate email input
        var validateEmailRes = accountJS.validateEmailInput()

        //nếu email được validate
        if (validateEmailRes) {
            //lấy input từ người dùng
            var userFirstName = $('#firstNameInput').val().trim();
            var userLastName = $('#lastNameInput').val().trim();
            var userAge = parseInt($('#ageInput').val());
            var userStreet = $('#streetInput').val().trim();
            var userDistrict = $('#districtInput').val().trim();
            var userProvince = $('#provinceInput').val().trim();
            var userCountry = $('#countryInput').val().trim();
            var userEmail = $('#emailInput').val().trim();

            //tạo data và gán trường dữ liệu
            var data = {
                userId: userID,
                email: userEmail,
                avatarUrl: userAvatarURL,
                firstName: userFirstName,
                lastName: userLastName,
                age: userAge,
                street: userStreet,
                district: userDistrict,
                province: userProvince,
                country: userCountry
            };

            //call api
            $.ajax({
                method: "PUT",
                url: host + "api/UserAccount/UpdateUserInfo",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).done(function(res) {
                if (res.success) {
                    //đóng modal
                    $('#modalUpdateInfor').modal('hide');
                    //show alert
                    commonBaseJS.showToastMsgSuccess("Cập nhật thành công.");
                    //gọi loadUserData() để cập nhật dữ liệu mới nhất
                    accountJS.loadUserData()
                } else {
                    commonBaseJS.showToastMsgFailed(res.message);
                }
            }).fail(function(res) {
                commonBaseJS.showToastMsgFailed("Cập nhật không thành công.");
            })


        } else {
            commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý, đăng ký không thành công.");
        }
    }

    //hiển thị khung xác nhận cập nhật thông tin(modal cập nhật thông tin)
    // showConfirmInforDiv() {

    //     //khai báo validate email input
    //     var validateEmailRes = this.validateEmailInput()

    //     //nếu email được validate
    //     if (validateEmailRes) {
    //         //khai báo thành phần html xác nhận sự kiện thay đổi thông tin tài khoản
    //         var confirmDiv = $(`<div id="confirmInforDiv" class="alert alert-warning w-100" role="alert">
    //                                     Yêu cầu sẽ được gửi ngay bây giờ. Bạn chắc chứ ?
    //                                 </div>
    //                                 <button id="confirmInforBtn" class="btn btn-success">Xác nhận</button>
    //                                 <button id="dismissInforBtn" class="btn btn-danger">Hủy bỏ</button>`)
    //         $('.modal-footer').append(confirmDiv)

    //         //disable nút "lưu thông tin vào tài khoản"
    //         $('#updateInforBtn').prop('disabled', true);
    //         
    //         //gán sự kiện cho nút 'Xác nhận'
    //         $('#confirmInforBtn').click(function() {
    //                 
    //                 $('#confirmInforDiv').remove()
    //             })
    //             //gán sự kiện cho nút 'Hủy bỏ'
    //         $('#dismissInforBtn').click(function() {

    //             $('#confirmInforDiv').remove()
    //         })
    //     }
    //     //nếu email chưa được validate 
    //     else {
    //         //show alert
    //         commonBaseJS.showToastMsgFailed("Dữ liệu chưa được xử lý, cập nhật thông tin không thành công.");
    //     }
    // }


}