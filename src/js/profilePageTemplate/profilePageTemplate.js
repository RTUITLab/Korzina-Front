import Swiper, {Pagination} from 'swiper'

let swiper = null

function onLoad() {
    swiper = new Swiper(".profilesSwiperParent", {
        slidesPerView: "auto",
        loop: true,
        spaceBetween: 15,
        modules: [Pagination],
        pagination: {
            el: ".profilesSwiperPagination",
            clickable: true,
            type: "bullets"
        },
    })
}

function toNext() {
    swiper.slideNext()
}
function toBack() {
    swiper.slidePrev()
}
window.toNext = toNext.bind(this);
window.toBack = toBack.bind(this);

window.addEventListener('load', onLoad.bind(globalThis));