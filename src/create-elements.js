export function getElement(element, className = '', text = '') {
    let item = document.createElement(element);
    if(className !== '') item.className = className;
    if(text !== '') item.innerText = text;
    return item;
}

export function getImage(src, alt, className = '') {
    let item = document.createElement('img');
    if(className !== '') item.className = className;
    item.src = src;
    item.alt = alt;
    return item;
}

export function getLink(href, text = '', className = '') {
    let item = document.createElement('a');
    if(className !== '') item.className = className;
    item.href = href;
    item.innerText = text;
    return item;
}

export function appendElement(parentElement, children = []) {
    children.forEach((e) => {
        parentElement.appendChild(e)
    })
    return parentElement;
}