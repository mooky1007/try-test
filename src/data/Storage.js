export const getData = async () => {
    const dataList = [
        "test06",
        "test04",
        "test03",
        "test02",
        "test05",
        "test01",
    ]

    return Promise.all(dataList.map(async el => {
        const res = await fetch(`./src/data/json/${el}.json`);
        const data = await res.json();
        return {...data, id: el};
    })).then(result => {
        return result.reduce((acc, cur,) => {
            acc[cur.id] = cur;
            return acc;
        }, {})
    })
}