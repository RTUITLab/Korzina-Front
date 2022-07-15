import Swiper, {Pagination} from 'swiper'

let swiper = null

function onLoad() {
    swiper = new Swiper(".profilesSwiperParent", {
        slidesPerView: "auto",
        loop: false,
        spaceBetween: 15,
        modules: [Pagination],
        pagination: {
            el: ".profilesSwiperPagination",
            clickable: true,
            type: "bullets"
        },
    })

    const params = new URLSearchParams(window.location.search)
    const index = params.get('index');
    if(!isNaN(Number(index)) && index) {
        swiper.slideTo(Number(index));
    }
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