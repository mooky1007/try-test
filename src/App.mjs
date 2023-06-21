import Header from "./components/Header.js";
import TestPage from "./page/TestPage.mjs";
import ListPage from "./page/ListPage.mjs";
import { getData } from "./data/Storage.js";

class App {
    constructor(DOM) {
        this.DOM = DOM;
        this.dataList = {};
        this.selectedTest = "";
        this.urlParams = new URLSearchParams(location.search);

        this.render();
    }

    async render() {
        const headerEl = createElement('header');
        const contentEl = createElement('div', {attribute: {class: 'content'}});
        this.DOM.append(headerEl, contentEl);

        const header = new Header(this.DOM);
        header.render();

        this.dataList = await getData();
        this.selectedTest = Object.keys(this.dataList)[0];

        const testPage = new TestPage(this.DOM, this.dataList[this.selectedTest]);
        const listPage = new ListPage(this.DOM, this.dataList);

        this.DOM.addEventListener('changeTest', (e) => {
            this.selectedTest = e.detail.id;
            testPage.data = this.dataList[this.selectedTest];
            history.replaceState({}, null, `${location.pathname}?test_no=${this.selectedTest}`);
            testPage.render();
        });

        this.DOM.addEventListener('goToHome', (e) => {
            history.replaceState({}, null, location.pathname);
            this.DOM.querySelector('.content').scrollTop = 0;
            listPage.render();
        });

        if(this.urlParams.has('test_no')) {
            this.selectedTest = this.urlParams.get('test_no');
            testPage.data = this.dataList[this.selectedTest];
            testPage.render();
            return;
        }

        listPage.render();
    }
}

export default App;