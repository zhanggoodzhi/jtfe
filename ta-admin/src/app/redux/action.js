export const CHANGE_HREF = 'CHANGE_HREF';
export const CHANGE_SUBMENU = 'CHANGE_SUBMENU';
export const CHANGE_REDDOT = 'CHANGE_REDDOT';
export const CHANGE_APP = 'CHANGE_APP';

//menu
export const changeHref = function (value) {
    return {
        value,
        type: CHANGE_HREF
    };
};
export const changeSubMenu = function (value) {
    return {
        value,
        type: CHANGE_SUBMENU
    };
};
export const changeRedDot = function (value) {
    return {
        value,
        type: CHANGE_REDDOT
    };
};

//appState
export const changeApp = function (value) {
    return {
        value,
        type: CHANGE_APP
    };
};
