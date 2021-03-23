$(document).ready(function () {
    var setting = new UserManager();
});

class UserManager {
    constructor() {
        $('.toast').toast('show');
        this.loadDataUser();
    }

    initEvents() {
        $(".tdIsAdmin").on('change', this.changeCheckboxAdmin.bind(this));
        $(".btnDelete").on('click', this.onClickDeleteUser.bind(this));
    }

    loadDataUser() {
        var self = this;
        $.ajax({
            method: "GET",
            url: "/api/UserAccount/",
            async: false,
            contentType: "application/json",
        }).done(function (res) {
            if (res.success) {
                var lstData = res.data.lstData;

                if (lstData.length > 0) {
                    $('#noUsers').hide();

                    $.each(lstData, function (index, user) {
                        var userHTML = `
                            <tr userID="${user.userId}">
                                <td>${index + 1}</td>
                                <td>${user.userName}</td>
                                <td>${user.email}</td>
                                <td>${(user.firstName != null) ? user.firstName : ""} ${(user.lastName != null) ? user.lastName : ""}</td>
                                <td>${(user.age != null) ? user.age : ""}</td>
                                <td>${(user.country != null) ? user.country : ""}</td>
                                <td align="center"><input type="checkbox" class="tdIsAdmin" style="height: 25px !important;" ${user.isAdmin ? "checked" : ""} /></td >
                                <td align="center"><button type="button" class="fa fa-trash-o btn btn-light btnDelete" title="Xóa"></button></td>
                            </tr>`

                        $(userHTML).data('userID', user.userId)

                        $('#lstUserGrid').append($(userHTML))
                    });

                    self.initEvents();
                }
            } else {
                $('#noUsers').show();
                alert("Lấy dữ liệu thất bại")
            }
        }).fail(function (res) {
            $('#noUsers').show();
            alert("Lấy dữ liệu không thành công")
        })
    }

    changeCheckboxAdmin(event) {
        var checkBox = event.target;
        var self = this;

        if (this.validateAdmin(checkBox)) {
            var data = {
                UserID: checkBox.closest('tr').getAttribute('userID'),
                IsAdmin: checkBox.checked
            };

            $.ajax({
                method: "POST",
                url: "/api/UserAccount/ChangeUserAdmin/",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
            }).done(function (res) {
                if (res.success) {
                    $('#lstUserGrid').empty();
                    self.loadDataUser();
                    $('.toast').toast('show');
                } else {
                    alert("Cập nhật thất bại")
                }
            }).fail(function (res) {
                alert("Cập nhật không thành công")
            })
        } else {
            alert('Phải có ít nhất 1 admin.');
            checkBox.checked = true;
        }
    }

    onClickDeleteUser(event) {
        var itemDel = event.target;
        var self = this;

        if (this.validateDelete()) {

            var conf = confirm("Bạn có thực sự muốn xóa người dùng này?");
            if (conf == true) {

                var listID = [];
                listID.push(itemDel.closest('tr').getAttribute('userID'));

                $.ajax({
                    method: "DELETE",
                    url: "/api/UserAccount/GroupID/",
                    data: JSON.stringify(listID),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                }).done(function (res) {
                    if (res.success) {
                        $('#lstUserGrid').empty();
                        self.loadDataUser();
                        $('.toast').toast('show');
                    } else {
                        alert("Xóa người dùng không thành công")
                    }
                }).fail(function (res) {
                    alert("Xóa người dùng không thành công")
                })
            }
        } else {
            alert('Bạn không được xóa chính mình khỏi danh sách người dùng.');
        }

    }

    validateDelete() {
        //Check không được xóa chính mình khỏi danh sách
        return true;
    }

    validateAdmin(element) {
        var bvalid = false,
            checkBox = $(".tdIsAdmin");

        if (!element.checked) {
            $.each(checkBox, function (index, item) {
                if (item.checked) {
                    bvalid = true;
                }
            });
        } else {
            bvalid = true;
        }
        return bvalid;
    }
}