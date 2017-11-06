/*eslint no-console: "off"*/
const path = require('path');
const fs = require('fs');
const colors = require('colors');
const compenentsPath = path.resolve(process.cwd(), 'src/main/webapp/components')
    // const compenentsPath = path.resolve('src/main/webapp/node/init-table/test')
const replaceAll = (options, text, replacement) => {
    let result = text;
    for (let v of replacement) {
        const reg = new RegExp(`{{${v}}}`, 'g')
        result = result.replace(reg, options[v])
    }

    return result;
};

const mkdir = (options) => {
    const pathBlock = options.href.split('\/');
    if (pathBlock.length > 1) {
        pathBlock.pop();
        pathBlock.forEach((v, i, a) => {
            let targetPath;
            for (let index = 0; index <= i; index++) {
                if (!targetPath) {
                    targetPath = a[index];
                } else {
                    targetPath = path.join(targetPath, a[index]);
                }
            }
            targetPath = path.resolve(compenentsPath, targetPath);
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
            }
        });
    }
};


const createFile = (options, template, replacement) => {
    const ext = path.extname(template);
    fs.readFile(path.resolve(__dirname, template), 'utf8', (err, text) => {
        const resultPath = path.resolve(compenentsPath, `${options.href}${ext}`);
        let replaceText = options.delete ? text.replace(/(#delete{{|}}delete#)/g, '') : text.replace(/#delete{{[\s\S]+?}}delete#/g, '');
        replaceText = replaceAll(options, replaceText, replacement);
        fs.writeFile(resultPath, replaceText, (err) => {
            if (!err) {
                console.log(colors.green(`创建${ext}文件成功,路径为 ${resultPath}`));
            } else {
                console.log(colors.red(err));
            }
        });
    });
}



module.exports = (options) => {
    const pugReplacement = ['title', 'href', 'layout'];
    const tsReplacement = ['listUrl', 'deleteUrl', 'namespace'];
    const pathArray = options.href.split('\/');
    const pathDeepth = pathArray.length - 1;
    options.layout = 'layout/main.pug';
    options.namespace = pathArray.map(v => {
        return v[0].toUpperCase() + v.slice(1);
    }).join('');

    if (pathDeepth > 1) {
        for (let i = 0; i < pathDeepth; i++) {
            options.layout = '../' + options.layout;
        }
    } else {
        options.layout = './' + options.layout;
    }
    mkdir(options);
    createFile(options, 'template/index.pug', pugReplacement)
    createFile(options, 'template/index.ts', tsReplacement)
};
