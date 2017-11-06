const statusMap: {
    [key: string]: {
        detail: string,
        sign: string;
        status?: number;
        result?: string;
    }
} = {
        1: {
            detail: '发热',
            sign: '①'
        },
        2: {
            detail: '恶心',
            sign: '②'
        },
        3: {
            detail: '呕吐',
            sign: '③'
        },
        4: {
            detail: '腹泻 ',
            sign: '④'
        },
        5: {
            detail: '腹痛',
            sign: '⑤'
        },
        6: {
            detail: '外伤',
            sign: '⑥'
        },
        7: {
            detail: '烫伤',
            sign: '⑦'
        },
        8: {
            detail: '湿疹 ',
            sign: '⑧'
        },
        9: {
            detail: '黄疸',
            sign: '⑨'
        },
        10: {
            detail: '咽痛',
            sign: '⑩'
        },
        11: {
            detail: '咳嗽',
            sign: '⑪'
        },
        12: {
            detail: '其它不适合从事情况',
            sign: '⑫'
        },
        100: {
            detail: '合格',
            sign: '√'
        },
        200: {
            detail: '缺勤',
            sign: '×'
        }
    };


Object.keys(statusMap).forEach(key => {
    const status = Number(key);
    let result = '不合格';
    switch (status) {
        case 100:
            result = '合格';
            break;
        case 200:
            result = '缺勤';
        default:
            break;
    }

    Object.assign(statusMap[key], {
        status,
        result
    });
});

export default statusMap;
