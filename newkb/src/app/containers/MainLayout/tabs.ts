interface ITabItem {
    label: string;
    name: string;
}

interface ITbasListItem {
    path: string;
    tabs: ITabItem[];
}


const tabsList: ITbasListItem[] = [
    {
        path: '/configuration',
        tabs: [
            {
                label: '类别管理',
                name: 'classifications'
            },
            {
                label: '模版管理',
                name: 'templates'
            },
            {
                label: '标签管理',
                name: 'labels'
            },
            {
                label: '审核流程管理',
                name: 'reviewProcess'
            },
            {
                label: '初始设置',
                name: 'initialSettings'
            },
            {
                label: '知识库成员',
                name: 'members'
            },
            {
                label: '权限设置',
                name: 'authorities'
            }
        ]
    }, {
        path: '/search',
        tabs: [
            {
                label: '知识搜索',
                name: 'search'
            }
        ]
    }, {
        path: '/framework',
        tabs: [
            {
                label: '类型',
                name: 'classes'
            },
            {
                label: '属性',
                name: 'properties'
            },
            {
                label: '实例',
                name: 'individuals'
            },
            {
                label: '图谱',
                name: 'chart'
            },
            {
                label: '推理',
                name: 'inference'
            }
        ]
    }, {
        path: '/repository',
        tabs: [
            {
                label: '知识列表',
                name: 'knowledgeList'
            },
            {
                label: '待审核列表',
                name: 'unreviewed'
            },
            {
                label: '已审核列表',
                name: 'reviewed'
            },
            {
                label: '更新记录',
                name: 'allstatus'
            },
            {
                label: '回收站',
                name: 'filed'
            }
        ]
    }
];

export default tabsList;
