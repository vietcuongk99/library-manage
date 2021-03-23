$(document).ready(function () {
    var setting = new BookManager();
});

class BookManager {
    constructor() {
        this.initEvents();
    }

    initEvents() {
        $(".downloadTemplateFile").on('click', this.downloadTemplateFile.bind(this));
        $("#btn-import").on('click', this.uploadFileImport.bind(this));
        $(".check-file-upload").on("change", function () {
            let filename = $(this).val().split("\\").pop();
            if (filename == '') {
                $(this).next().text("Chọn file nhập khẩu");
            }
            else {
                $(this).next().text(filename);
            }
            $(this).blur();
        });
    }

    downloadTemplateFile(event) {
        var url = `api/Upload/downloadTemplateFile`;

        $.ajax({
            type: "GET",
            url: url,
            success: function (res) {
                window.open(url, '_blank');
            },
            error: function (e) { debugger }
        });
    }

    uploadFileImport() {
        var fileNew = $('#fileNewupload').val();
        
        if (this.checkFile(fileNew)) {
            var fdata = new FormData();
            var fileNewUpload = $("#fileNewupload").get(0);
            fdata.append(fileNewUpload.files[0].name, fileNewUpload.files[0]);

            $('#loader').show();
            $('.main-container').addClass("loading");

            $.ajax({
                type: "POST",
                url: `api/Upload/uploadFileImport`,
                data: fdata,
                contentType: false,
                processData: false,
                success: function (response) {
                    var result = response.data.result;

                    if (result) {
                        $('#loader').hide();
                        $('.main-container').removeClass("loading");

                        alert(`Nhập khẩu thành công ${result.InsertCategorySuccess} thể loại mới và ${result.InsertBookSuccess} / ${result.TotalRecord} cuốn sách.`);
                        $(".check-file-upload").val('');
                        $(".check-file-upload").next().text("Chọn file nhập khẩu");
                        $('.close').click();
                    }
                    else {
                        $('#loader').hide();
                        $('.main-container').removeClass("loading");
                        alert('Nhập khẩu thất bại');
                    }
                },
                error: function (e) {
                    $('#loader').hide();
                    $('.main-container').removeClass("loading");
                    alert('Nhập khẩu thất bại');
                }
            });
        }
    }

    /**
    * Kiểm tra extention của file có phù hợp không
    * @param {any} filename
    * Created by bvbao (20/7/2020)
    */
    checkFile(filename) {
        var fileExtension = ['xls', 'xlsx'];
        if (filename.length == 0 || !filename || filename == null) {
            alert("Vui lòng chọn file");
            return false;
        }
        else {
            var extension = filename.replace(/^.*\./, '');
            if ($.inArray(extension, fileExtension) == -1) {
                alert("Vui lòng chọn file Excel");
                return false;
            }
        }
        return true;
    }
}