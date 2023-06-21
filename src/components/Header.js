class Header {
    constructor(DOM) {
        this.DOM = DOM;
        this.header = this.DOM.querySelector('header');
    }

    render() {
        this.header.innerHTML = '';

        const h1 = createElement('h1', {
            content: '심리&성향&성격 테스트',
            attribute: {
                class: 'header_title'
            }
        });

        h1.addEventListener('click', () => {
            const event = new CustomEvent('goToHome');
            this.DOM.dispatchEvent(event);
        });

        this.header.append(h1)
    }
}

export default Header;