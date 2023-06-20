class ListPage {
    constructor(DOM, data) {
        this.DOM = DOM;
        this.data = data;
    }

    render() {
        this.DOM.querySelector('.content').innerHTML = '';

        const testList = document.createElement('ul');
        testList.classList.add('test_list');

        Object.values(this.data).forEach(({title, description, data, id}) => {
            const li = document.createElement('li');
            const titleSpan = document.createElement('span');
            const descSpan = document.createElement('span');
            const span = document.createElement('span');

            titleSpan.classList.add('title');
            descSpan.classList.add('desc');
            span.classList.add('question_length');

            titleSpan.textContent = title;
            descSpan.textContent = description;
            span.textContent = `${data.length}문항`;

            li.appendChild(titleSpan);
            li.appendChild(descSpan);
            li.appendChild(span);

            li.addEventListener('click', () => {
                const event = new CustomEvent('changeTest', {
                    bubbles: true,
                    detail: {
                        id: id
                    }
                });

                this.DOM.dispatchEvent(event);
            });

            testList.appendChild(li);
        });

        this.DOM.querySelector('.content').appendChild(testList);
    }
}

export default ListPage;