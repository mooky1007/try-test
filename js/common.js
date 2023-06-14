class TestPage {
    constructor(data) {
        this.title = data.title;
        this.desc = data.description;
        this.testLength = data.data.length;
        this.startButton = data.startButton;
        this.status = 0; // 0 : 시작전, 1 : 진행중, 2 : 종료
        this.current = 0; // 현재 진행중인 문제 번호
        this.question = data.data;
        this.result = data.result;
        
        if(data.type === 'point'){
            this.point = 0;
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

        document.querySelector('.start_btn').innerHTML = this.startButton || '시작하기';
        document.querySelector('.start_btn').addEventListener('click', () => {
            this.start();
        });
    }

    start() {
        document.querySelector('.information').style.display = 'none';
        document.querySelector('.title').innerHTML = `Q${this.current + 1}.`;
        document.querySelector('.description').innerHTML = this.question[this.current].question;
        document.querySelector('.button_wrap').innerHTML = '';
        for(let i = 0; i < this.question[this.current].answerList.length; i++){
            const button = document.createElement('button');
            button.innerHTML = this.question[this.current].answerList[i].answer;
            button.addEventListener('click', () => {
                this.point += this.question[this.current].answerList[i].point;
                this.next();
            });
            document.querySelector('.button_wrap').appendChild(button);
        }
    }

    next() {
        if(this.current === this.testLength - 1){
            document.querySelector('.title').innerHTML = this.result.filter(({point}) => {
                const min = point.split("-")[0];
                const max = point.split("-")[1];
                if(this.point >= +min && this.point <= +max){
                    return true;
                }else{
                    return false;
                }
            })[0].title;
            document.querySelector('.description').innerHTML = this.result.filter(({point}) => {
                const min = point.split("-")[0];
                const max = point.split("-")[1];
                if(this.point >= +min && this.point <= +max){
                    return true;
                }else{
                    return false;
                }
            })[0].description;
            document.querySelector('.button_wrap').innerHTML = '';
            const replayBtn = document.createElement('button');
            const shareBtn = document.createElement('button');
            replayBtn.innerHTML = '다시하기';
            replayBtn.addEventListener('click', () => {
                location.reload();
            });
            document.querySelector('.button_wrap').appendChild(replayBtn);
            return;
        }
        this.current++;
        document.querySelector('.title').innerHTML = `Q${this.current + 1}.`;
        document.querySelector('.description').innerHTML = this.question[this.current].question;
        document.querySelector('.button_wrap').innerHTML = '';
        for(let i = 0; i < this.question[this.current].answerList.length; i++){
            const button = document.createElement('button');
            button.innerHTML = this.question[this.current].answerList[i].answer;
            button.addEventListener('click', () => {
                this.point += +this.question[this.current].answerList[i].point;
                this.next()
            });
            document.querySelector('.button_wrap').appendChild(button);
        }
    }
}