class Header {
    constructor(DOM) {
        this.DOM = DOM;
        this.header = this.DOM.querySelector('header');
    }

    render() {
        this.header.innerHTML = '';

        const h1 = createElement('h1', {
            content: '',
            attribute: {
                class: 'header_title'
            }
        });

        const a = createElement('a', {
            content: '심리&성향&성격 테스트',
            attribute: {
                href: '/try-test/'
            }
        });

        h1.append(a);
        this.header.append(h1)
    }
}

export default Header;