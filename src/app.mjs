import Header from "./components/Header.js";
import TestPage from "./page/TestPage.mjs";
import ListPage from "./page/ListPage.mjs";
import { getData } from "./data/Storage.js";

class App {
    constructor(DOM) {
        this.DOM = DOM;
        this.dataList = {};
        this.selectedTest = "likeAnimal";
        this.render();
    }

    async render() {
        this.dataList = await getData();

        console.log(this.dataList)

        const header = new Header(this.DOM);
        const testPage = new TestPage(this.DOM, this.dataList[this.selectedTest]);
        const listPage = new ListPage(this.DOM, this.dataList);

        this.DOM.addEventListener('changeTest', (e) => {
            this.selectedTest = e.detail.id;
            testPage.data = this.dataList[this.selectedTest];

            testPage.title = this.dataList[this.selectedTest].title;
            testPage.desc = this.dataList[this.selectedTest].description;
            testPage.testLength = this.dataList[this.selectedTest].data.length;
            testPage.startButton = this.dataList[this.selectedTest].startButtonText;
            testPage.current = 0;
            testPage.question = this.dataList[this.selectedTest].data;
            testPage.result = this.dataList[this.selectedTest].result;

            if(this.dataList[this.selectedTest].type === 'point'){
                testPage.point = 0;
                testPage.type = this.dataList[this.selectedTest].type;
            }
            if(this.dataList[this.selectedTest].type === 'indicator'){
                testPage.indicator = {};
                testPage.indicatorType = Object.values(this.dataList[this.selectedTest].data).map(({type}) => type).filter((el, idx, arr) => arr.indexOf(el) === idx);
                testPage.type = this.dataList[this.selectedTest].type;
            }

            testPage.render();
        });

        header.render();
        listPage.render();
    }
}

export default App;