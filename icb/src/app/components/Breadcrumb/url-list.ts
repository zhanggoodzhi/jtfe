import pathToRegexp from 'path-to-regexp';

interface IUrlItem {
    /**
     * 与路由组件的path一致，注意区分字符串中正则表达式的转义
     *
     * @type {string}
     * @memberof IUrlItem
     */
    path: string;
    /**
     * 显示的名称
     *
     * @type {string}
     * @memberof IUrlItem
     */
    name: string;
    regexp?: RegExp;
}

const urlList: IUrlItem[] = [
    {
        path: '/home/canteen',
        name: '透明食堂'
    },
    {
        path: '/home/canteen/:canteen(\\d+)',
        name: '食堂详情'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/sample',
        name: '食品留样'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/rawmaterial',
        name: '原材料采购'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/waste',
        name: '废弃物处置'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/tableware',
        name: '餐具消毒'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/air',
        name: '空气消毒'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/qualifications',
        name: '人员资质'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/supervision',
        name: '监管透明'
    },
    {
        path: '/home/canteen/:canteen(\\d+)/comment',
        name: '公共评论'
    },
    {
        path: '/home/workbench',
        name: '工作台'
    },
    {
        path: '/home/workbench/morningcheck',
        name: '人员晨检'
    },
    {
        path: '/home/workbench/morningcheck/:date(\\d{8})',
        name: '晨检详情'
    },
    {
        path: '/home/workbench/selfcheck',
        name: '每日自查'
    },
    {
        path: '/home/workbench/selfcheck/daily',
        name: '日自查表'
    },
    {
        path: '/home/workbench/selfcheck/quarterly',
        name: '季度自查表'
    },
    {
        path: '/home/workbench/airdisinfection',
        name: '空气消毒记录'
    },
    {
        path: '/home/workbench/airdisinfection/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/airdisinfection/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/tablewaredisinfection',
        name: '餐具消毒记录'
    },
    {
        path: '/home/workbench/tablewaredisinfection/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/tablewaredisinfection/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/insecticide',
        name: '杀虫剂使用记录'
    },
    {
        path: '/home/workbench/insecticide/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/insecticide/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/waste',
        name: '废弃物处置记录'
    },
    {
        path: '/home/workbench/waste/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/waste/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/StockInOutManage/',
        name: '出入库管理'
    },
    {
        path: '/home/workbench/StockInOutManage/stock',
        name: '库存管理'
    },
    {
        path: '/home/workbench/StockInOutManage/(stock|stockin|stockout)/prepackage',
        name: '预包装产品'
    },
    {
        path: '/home/workbench/StockInOutManage/(stock|stockin|stockout)/eat',
        name: '食用农产品'
    },
    {
        path: '/home/workbench/StockInOutManage/stock/:group(prepackage|eat)/add/:id(\\d+)?',
        name: '添加'
    },
    {
        path: '/home/workbench/StockInOutManage/(stock|stockin|stockout)/detail/:id(\\d+)',
        name: '详情'
    },
    {
        path: '/home/workbench/StockInOutManage/stock/:group(prepackage|eat)/batchout',
        name: '批量出库'
    },
    {
        path: '/home/workbench/StockInOutManage/stock/:group(prepackage|eat)/batchin',
        name: '批量入库'
    },
    {
        path: '/home/workbench/StockInOutManage/stockin',
        name: '入库记录'
    },
    {
        path: '/home/workbench/StockInOutManage/stockout',
        name: '出库记录'
    },
    {
        path: '/home/workbench/staylike',
        name: '食品留样记录'
    },
    {
        path: '/home/workbench/staylike/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/staylike/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/personnelmanage',
        name: '人员管理'
    },
    {
        path: '/home/workbench/personnelmanage/employees',
        name: '食品从业人员'
    },
    {
        path: '/home/workbench/personnelmanage/employees/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/personnelmanage/employees/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/personnelmanage/security',
        name: '食品安全管理员'
    },
    {
        path: '/home/workbench/personnelmanage/security/add',
        name: '添加记录'
    },
    {
        path: '/home/workbench/personnelmanage/security/detail/:id(\\d+)',
        name: '记录详情'
    },
    {
        path: '/home/workbench/providermanage/update/:id(\\d+)',
        name: '编辑'
    },
    {
        path: '/home/workbench/providermanage/add',
        name: '添加'
    },
    {
        path: '/home/workbench/providermanage/detail/:id(\\d+)',
        name: '详情'
    },
    {
        path: '/home/workbench/rectification',
        name: '整改记录'
    },
    {
        path: '/home/workbench/rectification/self',
        name: '自查整改'
    },
    {
        path: '/home/workbench/rectification/self/detail/:id(\\d+)',
        name: '详情'
    },
    {
        path: '/home/workbench/rectification/self/update/:id(\\d+)',
        name: '立即整改'
    },
    {
        path: '/home/workbench/rectification/notice',
        name: '整改通知'
    },
    {
        path: '/home/workbench/rectification/notice/detail/:id(\\d+)',
        name: '查看详情'
    },
    {
        path: '/home/workbench/rectification/notice/update/:id(\\d+)',
        name: '查看详情'
    },
    {
        path: '/home/workbench/membermanage',
        name: '成员管理'
    },
    {
        path: '/home/workbench/membermanage/canteen',
        name: '食堂管理'
    },
    {
        path: '/home/workbench/membermanage/canteen/update/:id(\\d+)',
        name: '编辑'
    },
    {
        path: '/home/workbench/membermanage/canteen/add',
        name: '添加成员'
    },
    {
        path: '/home/workbench/membermanage/canteen/detail/:id(\\d+)',
        name: '查看评论'
    },
    {
        path: '/home/workbench/membermanage/provider',
        name: '供应商管理'
    },
    {
        path: '/home/workbench/membermanage/provider/update/:id(\\d+)',
        name: '编辑'
    },
    {
        path: '/home/workbench/membermanage/provider/add',
        name: '添加成员'
    },
    {
        path: '/home/workbench/membermanage/provider/detail/:id(\\d+)',
        name: '查看评论'
    },
    {
        path: '/home/workbench/usermanage',
        name: '用户管理'
    },
    {
        path: '/home/workbench/usermanage/detail/:id(\\d+)',
        name: '详情'
    },
    {
        path: '/home/workbench/customnotification',
        name: '自定义通知'
    },
    {
        path: '/home/workbench/customnotification/add',
        name: '新增通知'
    },
    {
        path: '/home/workbench/customnotification/detail/:id(\d+)',
        name: '详情'
    },
    {
        path: '/home/workbench/customnotification/update/:id(\d+)',
        name: '详情'
    },
    {
        path: '/home/workbench/usermanage/detail/:id(\\d+)',
        name: '详情'
    },
];

urlList.forEach(item => {
    item.regexp = pathToRegexp(item.path);
});

export default urlList;
