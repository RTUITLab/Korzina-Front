import coursesData from '../../data/coursesData'
import arrow from '../../../assets/icons/profile_arrow.svg'
import {appendElement, getElement, getImage, getLink} from "../../create-elements";

const coursesParent = document.getElementById('CoursesParent');
const searchResult = document.getElementById('SearchResult');

let displayedCourses = coursesData;
let initProjects = false;
let currentSection = "";
let searchResults = [];

function generateSections(e) {
    currentSection = e;
    let sections;
    localStorage.setItem('section', e)
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
    window.removeEventListener('load', onLoad);
    const section = localStorage.getItem('section');
    if(section) {
        generateSections(section)
        document.getElementById('courses__nav__' + section).checked = true;
    }
    else {
        generateSections('Бакалавриат')
        document.getElementById('courses__nav__Бакалавриат').checked = true;
    }


    coursesData.forEach(e => {
        const courseObj = {
            title: e.title,
            link: '#',
            grade: e.grade,
            cipher: e.cipher
        }
        searchResults.push(courseObj);
        e.profiles.forEach(pr => {
            const profileObj = {
                title: pr.profileName,
                link: pr.link,
                grade: e.grade,
                cipher: e.cipher
            }
            searchResults.push(profileObj);
        })
    })
    console.log(searchResults);
    initProjects=true
}

window.addEventListener('load', onLoad.bind(globalThis));

function getCourseCardLayout(obj) { //course object
    let container = getElement('section', 'card__container');

    //header
    let header = getElement('div', 'card__header');
    let iconContainer = getElement('div',  'card__iconContainer')
    let icon = getImage(obj.ico, ' ', 'card__icon')
    let nameContainer = getElement('div', 'card__nameContainer');
    let name = getElement('div', 'card__name')
    let title = getElement('h2', 'card__title', obj.title);
    let cipher = getElement('h3', 'card__cipher', obj.cipher);
    name = appendElement(name, [title, cipher])
    iconContainer = appendElement(iconContainer, [icon])
    nameContainer = appendElement(nameContainer, [name])
    header = appendElement(header, [iconContainer, nameContainer])

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
        let exam = getElement('div', 'card__exam');
        let ico = getImage(e.ico, ' ','item__ico');
        let item = getElement('div', 'item__text', e.examName);
        exam = appendElement(exam, [ico, item])
        examsItem = appendElement(examsItem, [exam])
    })

    info = appendElement(info, [priceItem, addressItem, periodItem, examsItem])
    //profiles
    let profiles = getElement('div', 'card__profiles');
    let profileTitle = getElement('h3', 'profile__title', 'Профили подготовки');
    profiles = appendElement(profiles, [profileTitle])
    obj.profiles.forEach((e) => {
        let profileItem = getLink(e.link, '','profile__container');
        let profileText = getElement('div', 'profile__text', e.profileName);
        let profileIco = getImage( '/assets/icons/profile_arrow.svg', ' ', 'profile__ico');
        profileItem = appendElement(profileItem, [profileText, profileIco])
        profiles = appendElement(profiles, [profileItem])
    })

    content = appendElement(content, [info, profiles])
    container = appendElement(container, [header, content])
    return container
}

function search(value) {
    console.log("inputValue", value)
    const maxResultsLength = 5
    let sections, matchedSections, length = 0;
    searchResult.innerHTML = '';
    searchResult.classList.remove('result__hidden')
    //Фильтер по уч. степени
    sections = searchResults.filter((k) => {
        return k.grade.indexOf(currentSection) !== -1;
    });
    matchedSections = sections.filter((el) => {
        return el.title.toLowerCase().includes(value.toLowerCase()) || el.cipher.toLowerCase().includes(value.toLowerCase())
    })
    console.log(matchedSections)
    if(matchedSections.length === 0 || value === '') {
        searchResult.innerHTML = '';
        searchResult.classList.add('result__hidden')
    }
    else {
        let container = getElement('div', 'result__container');
        matchedSections.forEach(e => {
            if(length <= maxResultsLength) {
                let item;
                if(matchedSections.length === 1) {
                    item = getLink(e.link, e.cipher + ' / ' + e.title, 'result__item result__round');
                }
                else item = getLink(e.link, e.cipher + ' / ' + e.title, 'result__item');
                container = appendElement(container, [item]);
                length++
            }
        })
        appendElement(searchResult, [container])
    }

}

window.search = search.bind(this);
