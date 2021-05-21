//chọn slide đầu tiên là slide hiển thị mặc định
var slideIndex = 0;
//gọi hàm hiển thị slide theo index
showSlides(slideIndex);
//xử lý khi click nút điều hướng phải
function nextSlide(n) {
    //gán lại index
    showSlides(slideIndex += n);
}
//xử lý khi click nút điều hướng trái
function prevSlide(n) {
    //gán lại index
    showSlides(slideIndex -= n);
}
//chi tiết xử lý hàm hiển thị slide
function showSlides(n) {

    //lấy ra danh sách DOM chứa class mySlides
    let slides = $('.mySlides');
    //nếu index > số slide, hiển thị slide đầu tiên
    if (n > slides.length - 1) { slideIndex = 0 }
    //nếu index < index đầu tiên, hiển thị slide cuối
    if (n < 0) { slideIndex = 1 }
    //ẩn toàn bộ slide
    for (let i = 0; i < slides.length; i++) {
        $(slides[i]).hide();
    }
    //hiển thị slide hiện tại
    $(slides[slideIndex]).show();

}