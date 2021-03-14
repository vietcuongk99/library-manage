$(document).ready(function () {
    var setting = new BookManager();
});

class BookManager {
    constructor() {
        this.initEvents();
    }

    initEvents() {
        $("#imgInp").on('change', this.readURL.bind(this));

    }

    readURL(event) {
        var input = event.currentTarget;

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }
}