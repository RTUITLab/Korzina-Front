import Swiper, {Pagination} from 'swiper'

const compareLink = document.getElementById('CompareLink')
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
    });

    compareLink.href = '../compare/compare.html'
    const params = new URLSearchParams(window.location.search)
    const index = params.get('index')
    if(!isNaN(Number(index)) && index) {
        swiper.slideTo(Number(index));
    }
}

window.addEventListener('load', onLoad.bind(globalThis));
