import Header from "./components/Header.js";
import TestPage from "./page/TestPage.mjs";
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
        
        header.render();
        testPage.render();
    }
}

export default App;