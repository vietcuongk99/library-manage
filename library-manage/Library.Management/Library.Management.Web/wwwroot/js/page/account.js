//hằng số lưu giá trị file hợp lệ
const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
//biến lưu giá trị ban đầu của user, trả về từ /api/UserAccount/{userId}
var userData = {}

$(document).ready(function() {
    accountJS = new AccountJS()
})


//class quản lý các sự kiện trong trang account.html
class AccountJS extends BaseJS {
    constructor() {
        super();
        this.loadUserData();
        this.loadUserAvatar();
        this.initEvent();

    }


    ///load dữ liệu cá nhân của user
    loadUserData() {

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
                var userAddressTxt = ((userData.ward) ? userData.ward + ", " : "") +
                    ((userData.district) ? userData.district + ", " : "") +
                    ((userData.province) ? userData.province + ", " : "") +
                    ((userData.country) ? userData.country : "")

                userAddressTxt = userAddressTxt.trim()
                if (userAddressTxt.length == 0) { userAddressTxt = "chưa xác định" }
                debugger
                if (userAddressTxt.charAt(userAddressTxt.length - 1) == ",") { userAddressTxt = userAddressTxt.slice(0, -1) }
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
                $('#wardInput').val(userData.ward);
                $('#districtInput').val(userData.district);
                $('#provinceInput').val(userData.province);
                $('#countryInput').val(userData.country);
                $('#emailInput').val(userData.email);


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
    loadUserAvatar() {

        // lấy userId từ localStorage
        var userObject = JSON.parse(localStorage.getItem("user"))
        var userID = userObject.userID
        var userAvatarURL = userObject.avatarUrl

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
        this.showImgPreviewModal();
        //sự kiện khi click nút Lưu ảnh trong modal avatar
        $('#confirmImg').on('click', this.setUserAvatar);
        //sự kiện khi click nút Cập nhật mật khẩu
        $('#changePassword').on('click', function() {
            debugger
            window.open("change-pass.html", "_self")
        });
        //sự kiện khi click nút Xác nhận trong modal infor
        $('#updateInforBtn').on('click', this.updateUserInfor.bind(this));
        //sự kiện khi click nút Hủy bỏ trong modal
        $('#modalUpdateInfor #dismissModal').on('click', function() {
            //đóng modal
            $('#modalUpdateInfor').modal('hide')

            //xóa alert validate nếu có
            if ($('#emailAlert')) {
                $('#emailAlert').remove()
            }
            if ($('#firstNameAlert')) {
                $('#firstNameAlert').remove()
            }
            if ($('#lastNameAlert')) {
                $('#lastNameAlert').remove()
            }
            //lấy dữ liệu từ biến userData
            //gán giá trị cho các trường input trong modal
            $('#firstNameInput').val(userData.firstName);
            $('#lastNameInput').val(userData.lastName);
            $('#ageInput').val(userData.age);
            $('#wardInput').val(userData.ward);
            $('#districtInput').val(userData.district);
            $('#provinceInput').val(userData.province);
            $('#countryInput').val(userData.country);
            $('#emailInput').val(userData.email);
        })

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

                //avatarUrl của người dùng
                //cập nhật thông tin mới nhất vào localStorage
                userObject.avatarUrl = res.data
                localStorage.setItem("user", JSON.stringify(userObject));
                // lấy thông tin user vừa cập nhật từ localStorage
                userObject = JSON.parse(localStorage.getItem("user"));
                //gọi hàm loadUserAvatar()
                //cập nhật ảnh mới nhất
                accountJS.loadUserAvatar();

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
    validateUserInput() {

        //khai báo kết quả trả về
        var result = true;
        var alertDiv;

        //lấy email input của người dùng
        var emailInput = $('#emailInput').val().trim();
        var firstNameInput = $('#firstNameInput').val().trim();
        var lastNameInput = $('#lastNameInput').val().trim();

        //validate email
        var emailValid = (function validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        })(emailInput)

        //validate tên họ và tên đệm
        var firstNameValid = (function validateFirstName(firstName) {
            return firstName.length > 0;
        })(firstNameInput)

        //validate tên riêng
        var lastNameValid = (function validateLastName(lastName) {
            return lastName.length > 0;
        })(lastNameInput)

        //nếu email, tên họ, tên đệm chưa được validate
        //thêm thành phần html
        if (!firstNameValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="firstNameAlert" class="row mb-1">
                <label class="col-4"></label>
                <small class="form-text text-danger col-6">Không được để trống trường này.</small>
            </div>`)
            if ($('#firstNameAlert')) {
                $('#firstNameAlert').remove()
            }
            $('#firstNameDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#firstNameAlert')) {
                $('#firstNameAlert').remove()
            }
        }

        if (!lastNameValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="lastNameAlert" class="row mb-1">
                <label class="col-4"></label>
                <small class="form-text text-danger col-6">Không được để trống trường này.</small>
            </div>`)
            if ($('#lastNameAlert')) {
                $('#lastNameAlert').remove()
            }
            $('#lastNameDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#lastNameAlert')) {
                $('#lastNameAlert').remove()
            }
        }

        if (!emailValid) {
            //khai báo thành phần alert
            alertDiv = $(`<div id="emailAlert" class="row mb-1">
                <label class="col-4"></label>
                <small class="form-text text-danger col-6">Email chưa đúng định dạng.</small>
            </div>`)
            if ($('#emailAlert')) {
                $('#emailAlert').remove()
            }
            $('#emailDiv').append(alertDiv)
            result = false;
        } else {
            if ($('#emailAlert')) {
                $('#emailAlert').remove()
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

        //khai báo validate email input
        var validateUserInput = accountJS.validateUserInput()

        //nếu email được validate
        if (validateUserInput) {
            //lấy input từ người dùng
            var userFirstName = $('#firstNameInput').val().trim();
            var userLastName = $('#lastNameInput').val().trim();
            var userAge = parseInt($('#ageInput').val());
            var userWard = $('#wardInput').val().trim();
            var userDistrict = $('#districtInput').val().trim();
            var userProvince = $('#provinceInput').val().trim();
            var userCountry = $('#countryInput').val().trim();
            var userEmail = $('#emailInput').val().trim();

            //tạo data và gán trường dữ liệu
            var data = {
                userId: userID,
                email: userEmail,
                firstName: userFirstName,
                lastName: userLastName,
                age: userAge,
                ward: userWard,
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

}