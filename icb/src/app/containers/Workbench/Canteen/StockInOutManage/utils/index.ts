import moment from 'moment';
export function renderGroup(group) {
    switch (group) {
        case '1': return '预包装产品';
        case '2': return '食用农产品';
        default: return '无此类型';
    }
}
export function renderSaveTime(detailList) {
    return detailList.map(v => {
        return renderTime(v.expirationDate);
    }).join(',');
}

export function renderTime(time) {
    return moment(new Date(Number(time))).format('YYYY-MM-DD');
}
export function getGroup(props) {
    let group = 'prepackage';
    if (/eat/.test(props.location.pathname)) {
        group = 'eat';
    }
    return group;
}
