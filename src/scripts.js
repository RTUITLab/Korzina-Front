import "./js/header/header.js"
import "./js/courses/courses.js"

const compareLink = document.getElementById('CompareLink')
let initProjects = false;

function onLoad() {
    if (initProjects) {
        return false;
    }

    compareLink.href = '/compare/compare.html'
    initProjects=true;
    window.removeEventListener('load', onLoad);
}

window.addEventListener('load', onLoad.bind(globalThis));
