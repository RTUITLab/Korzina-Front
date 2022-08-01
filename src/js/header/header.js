import coursesData from '../../data/coursesData'
import {appendElement, getElement, getImage, getLink} from '../../create-elements'
import Swiper, {Pagination} from 'swiper'

let headerCompare
let headerBack

const compareContainer = document.getElementById('CompareContainer')
const compareBackground = document.getElementById('CompareBackground')

let initProjects = false;
const animationTime = 500;
const framesCount = 60;
let swiper = null

const profiles = [];

function onLoad() {
    if (initProjects) {
        return false;
    }

    headerCompare = document.getElementById('HeaderCompare');
    headerBack = document.getElementById('HeaderBack');

    const savedProfiles = JSON.parse(localStorage.getItem('profiles'))
    const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]'));

    anchors.forEach(function(item) {
        // каждому якорю присваиваем обработчик события
        item.addEventListener('click', function(e) {
            // убираем стандартное поведение
            e.preventDefault();

            // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
            let coordY = document.querySelector(item.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset - 150;

            // запускаем интервал, в котором
            let scroller = setInterval(function() {
                // считаем на сколько скроллить за 1 такт
                let scrollBy = coordY / framesCount;

                // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
                // и дно страницы не достигнуто
                if(scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.offsetHeight) {
                    // то скроллим на к-во пикселей, которое соответствует одному такту
                    window.scrollBy(0, scrollBy);
                } else {
                    // иначе добираемся до элемента и выходим из интервала
                    window.scrollTo(0, coordY);
                    clearInterval(scroller);
                }
                // время интервала равняется частному от времени анимации и к-ва кадров
            }, animationTime / framesCount);
        });
    });
    if(window.location.pathname !== '/') {
        headerBack.classList.remove('header__hidden');
    }

    // filling profiles array
    coursesData.forEach((item) => {
        item.profiles.forEach((profile) => {
            profiles.push(profile)
        })
    })

    if(savedProfiles?.length > 0) {
        savedProfiles.forEach((item) => {
            headerCompare.innerText = savedProfiles.length
            headerCompare.classList.remove('header__badge__hidden')

            const currentProfile = profiles.filter((profile) => {
                return profile.link === item.link
            })[0]
            const currentElement = document.getElementsByClassName(currentProfile.className)[0]
            if(currentElement) currentElement.classList.add('card__button__hidden') //hide button
        })

        if(compareContainer) {
            compareContainer.innerHTML = '';
            if(window.innerWidth <= 650) compareContainer.appendChild(getCompareSwiperLayout(savedProfiles))
            else compareContainer.appendChild(getComparePageLayout(savedProfiles))
        }
        correctNameHeight()
        compareBackground?.classList.remove('compare__background__top')
    }

    if(window.innerWidth <= 650) {
        initializeSwiper();
    }

    initProjects=true;
    window.removeEventListener('load', onLoad);
}

window.addEventListener('load', onLoad.bind(globalThis));

function handleAppendProfile(profileName) {
    const savedProfiles = JSON.parse(localStorage.getItem('profiles'))
    const currentProfile = profiles.filter((profile) => profile.profileName === profileName)[0]

    if(!isProfileAlreadyAppend(savedProfiles, profileName)) {
        if(!savedProfiles) {
            localStorage.setItem('profiles', JSON.stringify([currentProfile]))
            headerCompare.innerText = '1'
            headerCompare.classList.remove('header__badge__hidden')
        }
        else {
            if(savedProfiles.length === 2) {
                const erasedElement = document.getElementsByClassName(savedProfiles[0].className)[0]
                if(erasedElement) erasedElement.classList.remove('card__button__hidden')
                savedProfiles.splice(0, 1)
            }
            else headerCompare.innerText = '2'
            savedProfiles.push(currentProfile)
            localStorage.setItem('profiles', JSON.stringify(savedProfiles))
        }
        const currentElement = document.getElementsByClassName(currentProfile.className)[0]
        currentElement.classList.add('card__button__hidden')
    }
}

window.handleAppendProfile = handleAppendProfile.bind(globalThis);

function handleDeleteProfile(obj) {
    const savedProfiles = JSON.parse(localStorage.getItem('profiles'))
    if(savedProfiles) {
        const filteredProfiles = savedProfiles.filter((item) => item.profileName !== obj.profileName)
        compareContainer.innerHTML = '';
        if(filteredProfiles.length === 1) {
            if(window.innerWidth <= 650) {
                compareContainer.appendChild(getCompareSwiperLayout(filteredProfiles))
                initializeSwiper();
            }
            else compareContainer.appendChild(getComparePageLayout(filteredProfiles))
            headerCompare.innerText = '1'
            localStorage.setItem('profiles', JSON.stringify(filteredProfiles))
            correctNameHeight()
            compareBackground?.classList.remove('compare__background__top')
        }
        else {
            headerCompare.classList.add('header__badge__hidden')
            localStorage.removeItem('profiles')
            compareContainer.appendChild(getEmptyComparePageLayout())
            compareBackground?.classList.add('compare__background__top')
        }
    }
}

function isProfileAlreadyAppend(array, value) {
    if(!array) return false
    return array.find(item => item.profileName === value) || array.find(item => item.link === value)
}

function getCompareSwiperLayout(savedProfiles) {
    let container = getElement('div', 'compare__swiper')
    const swiperPagination = getElement('div', 'swiper-pagination compareSwiperPagination')
    let swiper = getElement('div', 'swiper compareSwiperParent')
    let swiperWrapper = getElement('div', 'swiper-wrapper')

    if(savedProfiles.length === 1) {
        let swiperSlide = getElement('div', 'swiper-slide')
        const card = getCompareCardLayout(savedProfiles[0])
        const empty = getEmptySecondProfileLayout()

        swiperSlide = appendElement(swiperSlide, [card])
        swiperWrapper = appendElement(swiperWrapper, [swiperSlide])

        swiperSlide = getElement('div', 'swiper-slide')
        swiperSlide = appendElement(swiperSlide, [empty])
        swiperWrapper = appendElement(swiperWrapper, [swiperSlide])
    }
    else {
        savedProfiles.forEach((item, index) => {
            let swiperSlide = getElement('div', 'swiper-slide')
            const profile = getCompareCardLayout(savedProfiles[index])
            swiperSlide = appendElement(swiperSlide, [profile])
            swiperWrapper = appendElement(swiperWrapper, [swiperSlide])
        })
        const first = getCompareCardLayout(savedProfiles[0])
        const second = getCompareCardLayout(savedProfiles[1])
    }

    swiper = appendElement(swiper, [swiperWrapper])
    container = appendElement(container, [swiperPagination, swiper])
    return container
}

function getComparePageLayout(savedProfiles) {
    let container = getElement('div', 'compare__layout');
    if(savedProfiles.length === 1) {
        const card = getCompareCardLayout(savedProfiles[0])
        const empty = getEmptySecondProfileLayout()
        container = appendElement(container, [card, empty])
    }
    else {
        const first = getCompareCardLayout(savedProfiles[0])
        const second = getCompareCardLayout(savedProfiles[1])
        container = appendElement(container, [first, second])
    }

    return container
}

function getCompareCardLayout(obj) { //profile object
    let container = getElement('div', 'compare__card');

    //header
    let header = getElement('div', 'compare__header');
    const name = getElement('h3', 'compare__name compare__head', obj.profileName);
    name.id = 'CompareName'
    let button = getElement('button', 'compare__button');
    const svg = getCrossSvg();

    button = appendElement(button, [svg])
    button.onclick = function () {
        handleDeleteProfile(obj)
    }
    header = appendElement(header, [name, button]);

    const course = getElement('div', 'compare__course', obj.courseName);
    const cipher = getElement('div', 'compare__cipher', obj.cipher + ' / ' + obj.grade);

    let priceItem = getElement('div', 'compare__item');
    let priceTitle = getElement('h3', 'compare__name', 'Стоимость обучения');
    let price = getElement('div', 'compare__text', obj.price);
    priceItem = appendElement(priceItem, [priceTitle, price])

    let examsItem = getElement('div', 'compare__item');
    let examsTitle = getElement('h3', 'compare__name', 'Вступительные испытания');
    examsItem = appendElement(examsItem, [examsTitle])
    obj.exams.forEach((e) => {
        let exam = getElement('div', 'compare__exam');
        let ico = getImage(e.ico, ' ','compare__ico');
        let item = getElement('div', 'compare__text', e.examName);
        exam = appendElement(exam, [ico, item])
        examsItem = appendElement(examsItem, [exam])
    })

    const compare_link = getLink('https://priem.mirea.ru/', 'Как поступить?', 'compare__link')
    compare_link.target = '_blank'
    // base competencies
    const baseTitle = getElement('h3', 'compare__name', 'Базовые компетенции');
    let baseContainer = getElement('div', 'compare__subjects');

    obj.based.forEach((item) => {
        let subjectContainer = getElement('div', 'compare__subject');
        let subjectIcoContainer = getElement('div', 'compare__subjectIcoContainer');
        const subjectIco = getImage(item.ico, '', 'compare__subjectIco');
        subjectIcoContainer = appendElement(subjectIcoContainer, [subjectIco]);
        const subjectName = getElement('div', 'compare__subjectName', item.title);
        subjectContainer = appendElement(subjectContainer, [subjectIcoContainer, subjectName])
        baseContainer = appendElement(baseContainer, [subjectContainer])
    })

    // special competencies
    const specialTitle = getElement('h3', 'compare__name', 'Профильные компетенции');
    let specialContainer = getElement('div', 'compare__subjects');

    obj.special.forEach((item) => {
        if(item.isActive) {
            let subjectContainer = getElement('div', 'compare__subject');
            let subjectIcoContainer = getElement('div', 'compare__subjectIcoContainer');
            const subjectIco = getImage(item.ico, '', 'compare__subjectIco');
            subjectIcoContainer = appendElement(subjectIcoContainer, [subjectIco]);
            const subjectName = getElement('div', 'compare__subjectName', item.title);
            subjectContainer = appendElement(subjectContainer, [subjectIcoContainer, subjectName])
            specialContainer = appendElement(specialContainer, [subjectContainer])
        }
    })
    container = appendElement(container, [header, course, cipher, priceItem, examsItem, compare_link, baseTitle, baseContainer, specialTitle, specialContainer])
    return container
}

function getEmptyComparePageLayout() {
    let container = getElement('div', 'compare__empty');
    const subtitle = getElement('h2', 'compare__subtitle', 'Для сравнения добавьте два профиля');
    const link = getLink('/', 'Перейти к выбору', 'compare__link')

    container = appendElement(container, [subtitle, link])
    return container
}

function getEmptySecondProfileLayout() {
    let container = getElement('div', 'compare__emptyProfile');
    let emptyTitle = getElement('h3', 'compare__emptyTitle', 'Добавьте в сравнение ещё профиль');
    let link = getLink('/', 'Перейти к выбору','compare__emptyLink');

    container = appendElement(container, [emptyTitle, link])
    return container
}

function getCrossSvg() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute ("width", "18");
    svg.setAttribute ("height", "18");
    svg.setAttribute ("viewBox", "0 0 18 18" );

    const newpath = document.createElementNS('http://www.w3.org/2000/svg',"path");
    newpath.setAttributeNS(null, "d", "M1 1L9 9M17 17L9 9M9 9L17 1L1 17");
    newpath.setAttributeNS(null, 'stroke', '#2C2C2C');
    newpath.setAttributeNS(null, 'stroke-opacity', '0.5');
    newpath.setAttributeNS(null, 'stroke-width', '2');
    newpath.setAttributeNS(null, 'stroke-linecap', 'round');
    newpath.setAttributeNS(null, 'stroke-linejoin', 'round');

    svg.appendChild(newpath)
    return svg
}

function correctNameHeight() {
    const names = document.getElementsByClassName('compare__head')
    let maxHeight = 0;
    if(names?.length > 0) {
        for (let item of names) {
            if(item.clientHeight > maxHeight) maxHeight = item.clientHeight
        }
        for (let item of names) {
            item.style.height = String(maxHeight) + 'px'
        }
    }
}

function initializeSwiper() {
    swiper = new Swiper(".compareSwiperParent", {
        slidesPerView: "auto",
        loop: false,
        autoHeight: true,
        spaceBetween: 15,
        modules: [Pagination],
        pagination: {
            el: ".compareSwiperPagination",
            clickable: true,
            type: "bullets"
        },
    });
}
