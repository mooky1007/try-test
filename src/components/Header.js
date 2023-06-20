class Header {
    constructor(DOM) {
        this.DOM = DOM;
        this.render();
    }

    render() {
        this.DOM.querySelector('header')?.remove();

        const header = document.createElement('header');
        const h1 = document.createElement('h1');
        h1.textContent = 'Test List';
        header.appendChild(h1);
        this.DOM.appendChild(header);
    }
}

export default Header;