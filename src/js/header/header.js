import coursesData from '../../data/coursesData'
const headerCompare = document.getElementById('HeaderCompare');
const headerBack = document.getElementById('HeaderBack');

let initProjects = false;
const animationTime = 500;
const framesCount = 60;

const profiles = [];

function onLoad() {
    if (initProjects) {
        return false;
    }
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

    // hide profiles button which already append to compare
    if(savedProfiles?.length > 0) {
        savedProfiles.forEach((item) => {
            headerCompare.innerText = savedProfiles.length
            headerCompare.classList.remove('header__badge__hidden')

            const currentProfile = profiles.filter((profile) => {
                return profile.link === item.link
            })[0]
            const currentElement = document.getElementsByClassName(currentProfile.className)[0]
            if(currentElement) currentElement.classList.add('card__button__hidden')
        })
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
                erasedElement.classList.remove('card__button__hidden')
                savedProfiles.splice(0, 1)
            }
            headerCompare.innerText = '2'
            savedProfiles.push(currentProfile)
            localStorage.setItem('profiles', JSON.stringify(savedProfiles))
        }
        const currentElement = document.getElementsByClassName(currentProfile.className)[0]
        currentElement.classList.add('card__button__hidden')
    }
}

window.handleAppendProfile = handleAppendProfile.bind(globalThis);

function isProfileAlreadyAppend(array, value) {
    if(!array) return false
    return array.find(item => item.profileName === value) || array.find(item => item.link === value)
}
