<script setup>
import subTitle from '@/components/subTitle.vue';
import { reactive, ref, computed, onMounted } from 'vue';
import { request } from '@/assets/myfetch.js'

const props = defineProps(['configItem'])
const columns0 = ref([
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
])
const columns1 = ref([
    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
    },
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
])
const columns2 = ref([
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
    },
])
const dataSource0 = ref([])
const dataSource1 = ref([])
// request({
//     url: '/api/getData'
// }).then(res => {
//     columns0.value = res.moudle0.columns
//     dataSource0.value = res.moudle0.dataSource
//     columns1.value = res.moudle1.columns
//     dataSource1.value = res.moudle1.dataSource
// })
onMounted(() => {
    let chartDom = document.getElementById('echarts');
    let myChart = echarts.init(chartDom);

    const option = {
        color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
        legend: { show: false },
        radar: [
            {
                indicator: [
                    { text: 'Indicator1' },
                    { text: 'Indicator2' },
                    { text: 'Indicator3' },
                    { text: 'Indicator4' },
                    { text: 'Indicator5' }
                ],
                radius: 70,
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',
                axisName: {
                    formatter: '【{value}】',
                    color: '#428BD4'
                },
                splitArea: {
                    areaStyle: {
                        color: ['#77EADF', '#26C3BE', '#64AFE9', '#428BD4'],
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowBlur: 10
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(211, 253, 250, 0.8)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(211, 253, 250, 0.8)'
                    }
                }
            }
        ],
        series: [
            {
                type: 'radar',
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                },
                data: [
                    {
                        value: [100, 8, 0.4, -80, 2000],
                        name: 'Data A'
                    },
                    {
                        value: [60, 5, 0.3, -100, 1500],
                        name: 'Data B',
                        areaStyle: {
                            color: 'rgba(255, 228, 52, 0.6)'
                        }
                    }
                ]
            }
        ]
    };

    option && myChart.setOption(option);
})

</script>

<template>
    <sub-title :title="props.configItem['module_table'].name"></sub-title>
    <a-table :dataSource="dataSource0" :columns="columns0" size="small" class="right-content-top-table" />
    <sub-title :title="props.configItem['module_select'].name"></sub-title>
    <a-space style="text-align: left;">
        <a-select style="width: 120px" :options="props.configItem['module_select'].submodule[0].options"></a-select>
        <a-select style="width: 120px" :options="props.configItem['module_select'].submodule[1].options"></a-select>
    </a-space>
    <div>
        <a-row style="height: 200px;overflow: auto;">
            <a-col :span="12">
                <a-table :dataSource="dataSource1" :columns="columns1" size="small">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'operate'">
                            <a>下发数据</a>
                        </template>
                    </template>
                </a-table>
            </a-col>
            <a-col :span="12">
                <div id="echarts" style="width: 100%;height: 200px;"></div>
            </a-col>
        </a-row>
        <a-table :dataSource="dataSource0" :columns="columns2" size="small" class="right-content-top-table" />
    </div>
</template>
<style>
.large-Screen .ant-table-cell {
    background-color: var(--bg-color-black);
    color: #ffffff;
}

.large-Screen .ant-table-wrapper .ant-table.ant-table-small .ant-table-tbody>tr>td {
    padding: 1px;
}

.large-Screen .ant-table-wrapper .ant-table-thead>tr>th {
    background-color: var(--bg-color-black);
    color: #ffffff;
}

.large-Screen .ant-table-wrapper .ant-table-tbody>tr.ant-table-row:hover>td,
.large-Screen .ant-table-wrapper .ant-table-tbody>tr>td.ant-table-cell-row-hover {
    background-color: var(--bg-color-black);
    color: #ffffff;
}

.large-Screen .ant-pagination .ant-pagination-disabled .ant-pagination-item-link {
    color: #ffffff;
}

.right-content-top-table {
    max-height: 250px;
    overflow: auto;
}
</style>