class TestPage {
    constructor(DOM, data) {
        this.DOM = DOM;
        this.content = this.DOM.querySelector('.content');
        this.data = data;
        this.title = this.data.title;
        this.desc = this.data.description;
        this.testLength = this.data.data.length;
        this.startButton = this.data.startButtonText;
        this.current = 0;
        this.question = this.data.data;
        this.result = this.data.result;

        if (this.data.type === 'point') {
            this.point = 0;
            this.type = data.type;
        }
        if (this.data.type === 'indicator') {
            this.indicator = {};
            this.indicatorType = Object.values(this.question)
                .map(({ type }) => type)
                .filter((el, idx, arr) => arr.indexOf(el) === idx);
            this.type = data.type;
        }
    }

    render() {
        this.content.innerHTML = '';

        this.title = this.data.title;
        this.type = this.data.type;
        this.desc = this.data.description;
        this.testLength = this.data.data.length;
        this.startButton = this.data.startButtonText;
        this.question = this.data.data;
        this.result = this.data.result;

        if (this.data.type === 'point') {
            this.point = 0;
        }
        if (this.data.type === 'indicator') {
            this.indicator = {};
            this.indicatorType = Object.values(this.question)
                .map(({ type }) => type)
                .filter((el, idx, arr) => arr.indexOf(el) === idx);
        }

        const viewContainer = createElement('div', { attribute: { class: 'view_container' } });
        const contentWrap = createElement('div', { attribute: { class: 'content_wrap' } });
        const imageBox = createElement('div', { attribute: { class: 'image_box', style: 'display: none' } });
        const image = createElement('img', { attribute: { src: "" } });
        const title = createElement('div', { content: this.title, attribute: { class: 'title' } });
        const description = createElement('div', { content: this.desc, attribute: { class: 'description' } });
        const information = createElement('ul', { attribute: { class: 'information' } });
        const questionLength = createElement('li', {
            content: `<span>총 문항 :</span><span id="question_length">${this.testLength}문항</span>`,
            attribute: { class: 'question_length' },
        });
        const time = createElement('li', {
            content: `<span>소요시간 :</span><span id="time">${
                Math.trunc((this.testLength * 10) / 60) > 0
                    ? Math.trunc((this.testLength * 10) / 60) + ' ~ ' + Math.trunc((this.testLength * 20) / 60) + '분'
                    : '1분 이내'
            }</span>`,
            attribute: { class: 'time' },
        });
        const buttonWrap = createElement('div', { attribute: { class: 'button_wrap' } });

        imageBox.appendChild(image);
        information.append(questionLength, time);
        contentWrap.append(imageBox, title, description, information);
        viewContainer.append(contentWrap, buttonWrap);
        this.content.appendChild(viewContainer);

        this.init();
    }

    init() {
        this.current = 0;
        this.point = 0;
        this.indicator = {};

        this.DOM.querySelector('.information').style.display = 'block';
        this.DOM.querySelector('.button_wrap').innerHTML = '';
        const startBtn = createElement('button', { content: this.startButton || '시작하기', attribute: { class: 'start_btn' } });
        startBtn.addEventListener('click', () => this.start());
        this.DOM.querySelector('.button_wrap').appendChild(startBtn);
    }

    start() {
        this.renderQuestion();
    }

    next() {
        if (this.current === this.testLength - 1) {
            this.getResult();
            return;
        }
        this.current++;
        this.renderQuestion();
    }

    renderQuestion() {
        this.DOM.querySelector('.information').style.display = 'none';
        this.DOM.querySelector('.title').innerHTML = `Q${this.current + 1}.`;
        this.DOM.querySelector('.description').innerHTML = this.question[this.current].question;
        this.DOM.querySelector('.button_wrap').innerHTML = '';

        for (let i = 0; i < this.question[this.current].answerList.length; i++) {
            const button = document.createElement('button');
            button.innerHTML = this.question[this.current].answerList[i].answer;
            button.addEventListener('click', () => {
                if (this.type === 'point') this.point += this.question[this.current].answerList[i].point;
                if (this.type === 'indicator') {
                    this.indicator[this.question[this.current].answerList[i].indicator]
                        ? (this.indicator[this.question[this.current].answerList[i].indicator] += 1)
                        : (this.indicator[this.question[this.current].answerList[i].indicator] = 1);
                }
                this.next();
            });
            this.DOM.querySelector('.button_wrap').appendChild(button);
        }
    }

    getResult() {
        if (this.type === 'point') {
            this.userResult = '';
            this.userResult = this.result.filter(({ point }) => {
                if (point.split('-').length === 1) {
                    return this.point === +point ? true : false;
                }
                const [min, max] = point.split('-');
                return this.point >= +min && this.point <= +max ? true : false;
            })[0];
        }

        if (this.type === 'indicator' && this.current === this.testLength - 1) {
            this.userResult = '';
            this.indicatorType.forEach((type) => {
                const [type1, type2] = type.split('');

                this.indicator[type1] === undefined ? (this.indicator[type1] = 0) : this.indicator[type1];
                this.indicator[type2] === undefined ? (this.indicator[type2] = 0) : this.indicator[type2];

                if (this.indicator[type1] >= this.indicator[type2]) {
                    this.userResult += type1;
                } else if (this.indicator[type1] < this.indicator[type2]) {
                    this.userResult += type2;
                }
            });

            this.userResult = this.result.filter(({ indicator }) => {
                return indicator === this.userResult;
            })[0];
        }

        if(this.userResult.imageUrl !== "") {
            this.DOM.querySelector('.image_box').style.display = 'block';
            this.DOM.querySelector('.image_box img').setAttribute('src', this.userResult.imageUrl);
        }
        this.DOM.querySelector('.title').innerHTML = this.userResult.title;
        this.DOM.querySelector('.description').innerHTML = this.userResult.description;

        this.DOM.querySelector('.button_wrap').innerHTML = '';
        const replayBtn = document.createElement('button');
        replayBtn.innerHTML = '다시하기';
        replayBtn.addEventListener('click', () => this.restart());

        const listBtn = createElement('button', { content: '목록으로' });

        listBtn.addEventListener('click', () => {
            const event = new CustomEvent('goToHome');
            this.DOM.dispatchEvent(event);
        });

        const shareBtn = createElement('button', { content: '카카오톡 결과 공유하기', attribute: { id: 'kakaotalk-sharing-btn' } });

        this.DOM.querySelector('.button_wrap').append(replayBtn, shareBtn, listBtn);

        Kakao.Share.createDefaultButton({
            container: '#kakaotalk-sharing-btn',
            objectType: 'feed',
            content: {
                title: `[ ${this.userResult.title} ]`,
                description: this.title + '\n' + this.userResult.description.replace(/<br \/>/g, ''),
                imageUrl: `${window.location.href}${this.userResult.imageUrl.replace('.', '')}`,
                link: {
                    mobileWebUrl: 'https://mooky1007.github.io/try-test/',
                    webUrl: 'https://mooky1007.github.io/try-test/',
                },
            },
            buttons: [
                {
                    title: '테스트 하러가기',
                    link: {
                        mobileWebUrl: 'https://mooky1007.github.io/try-test/',
                        webUrl: 'https://mooky1007.github.io/try-test/',
                    },
                }
            ],
        });
        return;
    }

    restart() {
        this.current = 0;
        this.point = 0;
        this.indicator = {};
        this.render();
    }
}

export default TestPage;
