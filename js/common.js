class TestPage {
    constructor(data) {
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

        this.init();
    }

    init() {
        document.querySelector('.title').innerHTML = this.title;
        document.querySelector('.description').innerHTML = this.desc;
        document.querySelector('#question_length').innerHTML = `${this.testLength}문항`;
        if(Math.trunc(this.testLength * 10 / 60) > 0){
            document.querySelector('#time').innerHTML = Math.trunc(this.testLength * 10 / 60) + ' ~ ' + Math.trunc(this.testLength * 20 / 60) + '분';
        }else{
            document.querySelector('#time').innerHTML = `1분 이내`;
        }

        document.querySelector('.information').style.display = 'block';
        document.querySelector('.button_wrap').innerHTML = '';
        const startBtn = document.createElement('button');
        startBtn.innerHTML = this.startButton || '시작하기';
        startBtn.addEventListener('click', () => this.start());
        document.querySelector('.button_wrap').appendChild(startBtn);
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
        document.querySelector('.information').style.display = 'none';
        document.querySelector('.title').innerHTML = `Q${this.current + 1}.`;
        document.querySelector('.description').innerHTML = this.question[this.current].question;
        document.querySelector('.button_wrap').innerHTML = '';

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
            document.querySelector('.button_wrap').appendChild(button);
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

        document.querySelector('.title').innerHTML = this.userResult.title;
        document.querySelector('.description').innerHTML = this.userResult.description;
        
        document.querySelector('.button_wrap').innerHTML = '';
        const replayBtn = document.createElement('button');
        replayBtn.innerHTML = '다시하기';
        replayBtn.addEventListener('click', () => this.restart());
        document.querySelector('.button_wrap').appendChild(replayBtn);
        return;
    }

    restart() {
        this.current = 0;
        this.point = 0;
        this.indicator = {};
        this.init();
    }
}