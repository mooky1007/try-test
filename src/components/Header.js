class Header {
    constructor(DOM) {
        this.DOM = DOM;
    }

    render() {
        const title = createElement('header', {
            content: 'Hello, World!',
            attribute: {
                class: 'header'
            }
        });
        this.DOM.append(title)
    }
}

export default Header;