const express = require('express');
const router = express.Router();

router.get('/canteen', (req, res) => {
    const {
        start,
        end
    } = req.query;
    const len = end - start + 1;
    // const list = new Array(len).fill('').map(v => ({
    //     id: Math.random().toString().slice(2)
    // }));
    const list = [];
    for (let i = 0; i < 200; i++) {
        list.push({
            id: i,
            time: '2017-7-7',
            meal: '午餐',
            sampleTime: '2017-7-8',
            samplePerson: '张三',
            auditPerson: '李四',
            type: ['米饭', '西红柿炒蛋'],
            imgUrl: ''
        });
    };
    res.json({
        data: list.slice(Number(start), Number(end) + 1),
        total: list.length
    });
});
router.get('/canteen/sampleList', (req, res) => {
    const {
        start,
        end
    } = req.query;
    const list = [];
    for (let i = 0; i < 200; i++) {
        list.push({
            id: i,
            time: '2017-7-7',
            meal: '午餐',
            sampleTime: '2017-7-8',
            samplePerson: '张三',
            auditPerson: '李四',
            type: ['米饭', '西红柿炒蛋'],
            imgUrl: ''
        });
    };
    res.json({
        data: list.slice(Number(start), Number(end) + 1),
        total: list.length
    });
});
router.get('/canteen/rawMaterial/list', (req, res) => {
    const {
        type,
        start,
        end
    } = req.query;
    const list = [];
    for (let i = 0; i < 200; i++) {
        list.push({
            id: i,
            name: type + '酱油',
            classify: '调味品',
            num: 20,
            lasttime: '2017-7-7'
        });
    };
    res.json({
        data: list.slice(Number(start), Number(end) + 1),
        total: list.length
    });
});
router.get('/canteen/rawMaterial/detail', (req, res) => {
    const {
        id,
        start,
        end
    } = req.query;
    const list = [];
    for (let i = 0; i < 200; i++) {
        list.push({
            id: i,
            time: '采购日期',
            name: '酱油' + id,
            classify: '原材料',
            brand: '海天',
            size: '500ml/瓶',
            buynum: '10',
            saveTime: 'xxxx',
            batchnum: 'xxxx',
            company: '食品有限公司'
        });
    };
    res.json({
        data: list.slice(Number(start), Number(end) + 1),
        total: list.length
    });
});
router.get('/canteen/comment', (req, res) => {
    const {
        start,
        end
    } = req.query;
    const list = [];
    for (let i = 0; i < 200; i++) {
        list.push({
            id: i,
            time: '2017-5-8',
            average: 2,
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5,
            f: 3
        });
    };
    res.json({
        data: list.slice(Number(start), Number(end) + 1),
        total: list.length
    });
});
router.get('/canteen/qualifications', (req, res) => {
    const {
        start,
        end,
        type
    } = req.query;
    const list = [];
    for (let i = 0; i < 50; i++) {
        list.push({
            id: i,
            name: '张三==' + i,
            age: 23,
            post: 'cleaner' + type,
            date: '2016-04-23'
        });
    };
    res.json({
        list: list.slice(Number(start), Number(end) + 1),
        total: list.length
    });
});
router.get('/canteen/qualifications/employees', (req, res) => {
    const {
        workerid
    } = req.query;
    const data = {
        name: '张三====后端数据',
        sex: '女22',
        post: 'clear',
        workTime: '2017-06-17',
        introduction: '暂无',
        healthCertification: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690'
    };
    res.json({
        data: data
    });
});
router.get('/canteen/qualifications/security', (req, res) => {
    const {
        workerid
    } = req.query;
    const data = {
        photo: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690',
        name: '张三====后端数据',
        sex: '女676767',
        post: 'clear',
        workTime: '2017-06-17',
        introduction: '暂无',
        healthCertification: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690',
        workQualification: 'http://s2.sinaimg.cn/mw690/001Q7yJ8gy6NMGDKVhf51&690'
    };
    res.json({
        data: data
    });
});
router.get('/canteen/wastes', (req, res) => {
    const {
        start,
        end
    } = req.query;
    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            id: i,
            type: '粗加工废弃物===后端数据0',
            amount: '10Kg',
            receiver: '张三',
            passer: '李四',
            function: 'xxxxxx',
            date: '2017-06-19'
        });
    }
    res.json({
        list: data.slice(Number(start), Number(end) + 1),
        total: data.length
    });
});
router.get('/canteen/tablewares', (req, res) => {
    const {
        start,
        end
    } = req.query;
    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            id: i,
            object: '餐具用====后端数据0',
            operator: '张三1',
            way: '蒸汽',
            temperature: '120℃',
            doTime: '12:50--14:30',
            date: '2017-06-09'
        });
    }
    res.json({
        list: data.slice(Number(start), Number(end) + 1),
        total: data.length
    });
});
router.get('/canteen/airs', (req, res) => {
    const {
        start,
        end
    } = req.query;
    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            id: i,
            mealTime: '早晨====后端数据0',
            area: '操作间',
            operator: '张三1',
            remark: '备注无',
            doTime: '12:50--14:30',
            date: '2017-06-09'
        });
    }
    res.json({
        list: data.slice(Number(start), Number(end) + 1),
        total: data.length
    });
});
router.get('/workbench/personmanage', (req, res) => {
    const {
        currentPage,
        pageSize,
        type
    } = req.query;
    const data = [];
    for (let i = 0; i < 50; i++) {
        data.push({
            id: i,
            name: '胡彦斌' + i + type,
            sex: 32,
            post: '--',
            status: '在职',
            worktime: '2017-02-13',
            validateTime: '--',
            operation: ''
        });
    }
    res.json({
        list: data.slice(Number((currentPage - 1) * pageSize), Number(currentPage * pageSize) - 1),
        total: data.length
    });
});
module.exports = router;
