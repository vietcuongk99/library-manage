$(document).ready(function () {
    var bookborrow = new BookBorrow();
});

class BookBorrow {
    constructor() {
        this.initEvents();
    }

    initEvents() {
        $('.img-circle').hover(function (e) {
            $('div#pop-up').show();
            //.css('top', e.pageY + moveDown)
            //.css('left', e.pageX + moveLeft)
            //.appendTo('body');
        }, function () {
            $('div#pop-up').hide();
        });

        $('.img-circle').mousemove(function (e) {
            $("div#pop-up").css('top', e.pageY - 80).css('left', e.pageX - 180);
        });
    }
}