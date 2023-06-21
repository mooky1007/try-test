const createElement = (dom, config) => {
    const el = document.createElement(dom);

    if(config){
        const { content, attribute } = config;
        attribute && Object.keys(attribute).forEach(key => el.setAttribute(key, attribute[key]));
        content && (el.textContent = content);
    }

    return el;
}