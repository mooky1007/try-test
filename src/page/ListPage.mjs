class ListPage {
    constructor(DOM, data) {
        this.DOM = DOM;
        this.content = this.DOM.querySelector('.content');
        this.data = data;
    }

    render() {
        this.content.innerHTML = '';

        const testList = document.createElement('ul');
        testList.classList.add('test_list');

        Object.values(this.data).forEach(({title, description, data, id}) => {
            const li = createElement('li');
            const titleSpan = createElement('span', {content: title, attribute: {class: 'title'}});
            const descSpan = createElement('span', {content: description, attribute: {class: 'desc'}});
            const span = createElement('span', {content: `${data.length}문항 / ${Math.trunc((data.length * 10) / 60) > 0
            ? Math.trunc((data.length * 10) / 60) + ' ~ ' + Math.trunc((data.length * 20) / 60) + '분'
            : '1분 이내'}`, attribute: {class: 'question_length'}});

            li.append(titleSpan, descSpan, span);

            li.addEventListener('click', () => {
                const event = new CustomEvent('changeTest', {detail: { id: id }});
                this.DOM.dispatchEvent(event);
            });

            testList.appendChild(li);
        });

        this.content.append(testList);
    }
}

export default ListPage;