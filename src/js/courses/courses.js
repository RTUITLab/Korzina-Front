import coursesData from '../../data/data'
import arrow from '../../../assets/icons/profile_arrow.svg'

const coursesParent = document.getElementById('CoursesParent');
const searchParent = document.getElementById('SearchResult');
const searchInput = document.getElementById("SearchInput");

let displayedCourses = coursesData;
let initProjects = false;
let currentSection = "";

function generateSections(e) {
    currentSection = e;
    // searchInput.value = "";
    let sections;
    console.log('currentSection', e)
    sections = coursesData.filter((k) => {
        return k.grade.indexOf(currentSection) !== -1;
    });
    console.log(sections)
    coursesParent.innerHTML = '';

    if (sections.length === 0) {
        coursesParent.append('Тут пусто :(');
    } else {
        sections.forEach((e) => {
            let newChild = getCourseCardLayout(e)
            coursesParent.appendChild(newChild);
        });
        displayedCourses = sections;
    }
}

window.generateSections = generateSections.bind(this);

function onLoad() {
    if (initProjects) {
        return false;
    }
    initProjects=true
    window.removeEventListener('load', onLoad);
    generateSections('Бакалавриат')
    document.getElementById('courses__nav__Бакалавриат').checked = true;
}

window.addEventListener('load', onLoad.bind(globalThis));

function getCourseCardLayout(obj) {
    let container = getElement('section', 'card__container');




    //header
    let header = getElement('div', 'card__header');
    let icon = getImage(obj.ico, obj.title, 'card__icon')
    let name = getElement('div', 'card__name')
    let title = getElement('h2', 'card__title', obj.title);
    let cipher = getElement('div', 'card__cipher', obj.cipher);
    name = appendElement(name, [title, cipher])
    header = appendElement(header, [icon, name])

    //content
    let content = getElement('div', 'card__content');
    //info
    let info = getElement('div', 'card__info');
    let priceItem = getElement('div', 'card__item');
    let priceTitle = getElement('h3', 'item__title', 'Стоимость обучения');
    let price = getElement('div', 'item__text', obj.price);
    priceItem = appendElement(priceItem, [priceTitle, price])

    let addressItem = getElement('div', 'card__item');
    let addressTitle = getElement('h3', 'item__title', 'Адрес обучения');
    let address = getElement('div', 'item__text', obj.address);
    addressItem = appendElement(addressItem, [addressTitle, address])

    let periodItem = getElement('div', 'card__item');
    let periodTitle = getElement('h3', 'item__title', 'Срок обучения');
    let period = getElement('div', 'item__text', obj.period);
    periodItem = appendElement(periodItem, [periodTitle, period])

    let examsItem = getElement('div', 'card__item');
    let examsTitle = getElement('h3', 'item__title', 'Вступительные испытания');
    examsItem = appendElement(examsItem, [examsTitle])
    obj.exams.forEach((e) => {
        let item = getElement('div', 'item__text', e.examName);
        examsItem = appendElement(examsItem, [item])
    })

    info = appendElement(info, [priceItem, addressItem, periodItem, examsItem])
    //profiles
    let profiles = getElement('div', 'card__profiles');
    let profileTitle = getElement('h3', 'profile__title', 'Профили подготовки');
    profiles = appendElement(profiles, [profileTitle])
    obj.profiles.forEach((e) => {
        let profileItem = getLink(e.link, '','profile__container');
        let profileText = getElement('div', 'profile__text', e.profileName);
        let profileIco = getImage(arrow, 'arrow', 'profile__ico');
        profileItem = appendElement(profileItem, [profileText, profileIco])
        profiles = appendElement(profiles, [profileItem])
    })

    content = appendElement(content, [info, profiles])
    container = appendElement(container, [header, content])
    return container
}

function getElement(element, className = '', text = '') {
    let item = document.createElement(element);
    if(className !== '') item.className = className;
    if(text !== '') item.innerText = text;
    return item;
}

function getImage(src, alt, className = '') {
    let item = document.createElement('img');
    if(className !== '') item.className = className;
    item.src = src;
    item.alt = alt;
    return item;
}

function getLink(href, text = '', className = '') {
    let item = document.createElement('a');
    if(className !== '') item.className = className;
    item.href = href;
    item.innerText = text;
    return item;
}

function appendElement(parentElement, children = []) {
    children.forEach((e) => {
        parentElement.appendChild(e)
    })
    return parentElement;
}
