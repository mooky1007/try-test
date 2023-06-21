const createElement = (dom, config) => {
    const { content, attribute } = config;
    const el = document.createElement(dom);

    attribute && Object.keys(attribute).forEach(key => el.setAttribute(key, attribute[key]));
    content && (el.textContent = content);

    return el;
}