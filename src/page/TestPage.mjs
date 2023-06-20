class TestPage {
    constructor(DOM, data) {
        this.DOM = DOM;
        this.title = data.title;
        this.desc = data.description;
        this.testLength = data.data.length;
        this.startButton = data.startButtonText;
        this.current = 0;
        this.question = data.data;
        this.result = data.result;

        if(data.type === 'point'){
            this.point = 0;
            this.type = data.type;
        }
        if(data.type === 'indicator'){
            this.indicator = {};
            this.indicatorType = Object.values(this.question).map(({type}) => type).filter((el, idx, arr) => arr.indexOf(el) === idx);
            this.type = data.type;
        }
    }    

    render() {
        this.DOM.querySelector('.content').innerHTML = '';
        const viewContainer = document.createElement('div');
        viewContainer.classList.add('view_container');

        const contentWrap = document.createElement('div');
        contentWrap.classList.add('content_wrap');

        const title = document.createElement('div');
        title.classList.add('title');
        
        const description = document.createElement('div');
        description.classList.add('description');

        const information = document.createElement('ul');
        information.classList.add('information');

        const questionLength = document.createElement('li');
        questionLength.innerHTML = `<span>총 문항 :</span><span id="question_length"></span>`;
        const time = document.createElement('li');
        time.innerHTML = `<span>소요시간 :</span><span id="time"></span>`;
        information.appendChild(questionLength);
        information.appendChild(time);

        const buttonWrap = document.createElement('div');
        buttonWrap.classList.add('button_wrap');

        contentWrap.appendChild(title);
        contentWrap.appendChild(description);
        contentWrap.appendChild(information);
        viewContainer.appendChild(contentWrap);
        viewContainer.appendChild(buttonWrap);

        this.DOM.querySelector('.content').appendChild(viewContainer);

        this.init();
    }

    init() {
        this.DOM.querySelector('.title').innerHTML = this.title;
        this.DOM.querySelector('.description').innerHTML = this.desc;
        this.DOM.querySelector('#question_length').innerHTML = `${this.testLength}문항`;
        if(Math.trunc(this.testLength * 10 / 60) > 0){
            this.DOM.querySelector('#time').innerHTML = Math.trunc(this.testLength * 10 / 60) + ' ~ ' + Math.trunc(this.testLength * 20 / 60) + '분';
        }else{
            this.DOM.querySelector('#time').innerHTML = `1분 이내`;
        }

        this.DOM.querySelector('.information').style.display = 'block';
        this.DOM.querySelector('.button_wrap').innerHTML = '';
        const startBtn = document.createElement('button');
        startBtn.innerHTML = this.startButton || '시작하기';
        startBtn.addEventListener('click', () => this.start());
        this.DOM.querySelector('.button_wrap').appendChild(startBtn);
    }

    start() {
        this.renderQuestion();
    }

    next() {
        if(this.current === this.testLength - 1){
            this.getResult(); return
        };
        this.current++;
        this.renderQuestion();
    }

    renderQuestion() {
        this.DOM.querySelector('.information').style.display = 'none';
        this.DOM.querySelector('.title').innerHTML = `Q${this.current + 1}.`;
        this.DOM.querySelector('.description').innerHTML = this.question[this.current].question;
        this.DOM.querySelector('.button_wrap').innerHTML = '';

        for(let i = 0; i < this.question[this.current].answerList.length; i++){
            const button = document.createElement('button');
            button.innerHTML = this.question[this.current].answerList[i].answer;
            button.addEventListener('click', () => {
                if(this.type === "point") this.point += this.question[this.current].answerList[i].point;
                if(this.type === "indicator"){
                    this.indicator[this.question[this.current].answerList[i].indicator]
                    ? this.indicator[this.question[this.current].answerList[i].indicator] += 1
                    : this.indicator[this.question[this.current].answerList[i].indicator] = 1;
                }
                this.next()
            });
            this.DOM.querySelector('.button_wrap').appendChild(button);
        }
    }

    getResult() {
        if(this.type === "point"){
            this.userResult = this.result.filter(({point}) => {
                if(point.split("-").length === 1){
                    return this.point === +point ? true : false;
                }
                const [min, max] = point.split("-");
                return this.point >= +min && this.point <= +max ? true : false;
            })[0];
            console.log(this.userResult)
        }

        if(this.type === "indicator" && this.current === this.testLength - 1){
            this.userResult = "";
            this.indicatorType.forEach(type => {
                const [type1, type2] = type.split("");

                this.indicator[type1] === undefined ? this.indicator[type1] = 0 : this.indicator[type1];
                this.indicator[type2] === undefined ? this.indicator[type2] = 0 : this.indicator[type2];

                if(this.indicator[type1] >= this.indicator[type2]){
                    this.userResult += type1;
                }else if(this.indicator[type1] < this.indicator[type2]){
                    this.userResult += type2;
                }
            });

            this.userResult = this.result.filter(({indicator}) => {
                return indicator === this.userResult;
            })[0];
        }

        this.DOM.querySelector('.title').innerHTML = this.userResult.title;
        this.DOM.querySelector('.description').innerHTML = this.userResult.description;
        
        this.DOM.querySelector('.button_wrap').innerHTML = '';
        const replayBtn = document.createElement('button');
        replayBtn.innerHTML = '다시하기';
        replayBtn.addEventListener('click', () => this.restart());
        this.DOM.querySelector('.button_wrap').appendChild(replayBtn);
        return;
    }

    restart() {
        this.current = 0;
        this.point = 0;
        this.indicator = {};
        this.init();
    }
}

export default TestPage;