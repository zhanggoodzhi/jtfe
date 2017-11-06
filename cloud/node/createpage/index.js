'use strict';
const inquirer = require('inquirer');
const init = require('./init');
const isEmpty = (value) => {
    return value === '' ? '字段不能为空' : true;
};

const questions = [{
    type: 'input',
    name: 'href',
    message: '请输入链接(如localhost:8080/cloud/editByA/index则输入editByA/index)',
    validate: isEmpty
}, {
    type: 'input',
    name: 'title',
    message: '请输入页面标题',
    validate: isEmpty
}, {
    type: 'input',
    name: 'listUrl',
    message: '请输表格查询url',
    validate: isEmpty
}, {
    type: 'confirm',
    name: 'delete',
    message: '是否需要删除功能？',
    default: false
}];


inquirer.prompt(questions).then((answers) => {
    if (answers.delete) {
        inquirer.prompt([{
                type: 'input',
                name: 'deleteUrl',
                message: '请输表格删除url',
                validate: isEmpty
            }])
            .then((delAnswer) => {
                init(Object.assign(answers, delAnswer));
            })
    } else {
        init(answers);
    }
});
