import * as utils from 'global/utils';
import * as tables from 'global/tables';
namespace {{namespace}} {
    $(initTable);
    function initTable() {
        $('#table').DataTable(Object.assign(tables.commonConfig(),
            {
                ajax: {
                    url: '{{listUrl}}',
                    type: 'POST',
                    dataSrc: data => data.rows,
                    data: data => {
                        return utils.cleanObject({
                            page: tables.getPage(data),
                            rows: data.length
                        });
                    }
                },
                columns: [
                    { data: 'id', title: 'id' }
                ],
                initComplete: initComplete
            }
        ));
    }

    function initComplete() {
        const table = $('#table').DataTable();
        // 查询功能
        $('#search-btn').on('click', () => {
            table.draw();
        });

        tables.bindPageChange(table); // 绑定修改分页

    #delete{{
        // 删除功能
        tables.delBtnClick({
            el: $('#delete-btn'),
            table: table,
            name: '语料',
            url: '{{deleteUrl}}'
        });
    }}delete#
    }
}

