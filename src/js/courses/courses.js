const coursesParent = document.getElementById('CoursesParent');
const searchParent = document.getElementById('SearchResult');
const searchInput = document.getElementById("SearchInput");

let initProjects = false;
let currentSection = "";
// let displayedCourses = coursesData;

function generateSections(e) {
    currentSection = e
    // searchInput.value = "";
    let sections;
    console.log('currentSection', e)
    console.log('data', sections)
    // sections = coursesData.filter((k) => {
    //     return k.type.indexOf(currentSection) !== -1;
    // });
    console.log(sections)
    // coursesParent.innerHTML = '';


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

