<script setup>
import subTitle from '@/components/subTitle.vue';
import editableTable from '@/components/editableTable.vue';
import titletable from '@/components/titletable.vue';
import { reactive, ref, computed, onMounted } from 'vue';
import { request } from '@/assets/myfetch.js'
import { useCalculateStore } from '@/stores/counter'
import { message } from 'ant-design-vue';

import { h } from 'vue';
import {
    FundFilled
} from '@ant-design/icons-vue';

const Calculate = useCalculateStore()
const props = defineProps(['configItem'])
const columns0 = ref([
    {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        width: '70px'
    },
    ...props.configItem.module_table_columns
])
const columns1 = ref([
    ...props.configItem.module_table1_columns
])
const columns2 = ref([
    ...props.configItem.module_table2_columns
])
const columns3 = ref([
    ...props.configItem.module_table3_columns
])
let myChart = null
let mybarChart = null
// init
const selectValue0 = ref(undefined)
const selectValue1 = ref(undefined)
const selectName = ref('未选择')
const activeKey = ref(0);
const dataSource0 = ref([])
const dataSource1 = ref([])
const dataSource2 = ref([])
const dataSource3 = ref([])
const score = ref([0, 0, 0])
const currentSteps = ref(0)
const stepItem = ref([])
const logValue = ref('')
const isOverall = ref(false)
const detailsList = ref([])
const detailsListModal = ref(false)
// fin init

function selectedCallback() {
    if (selectValue0.value !== undefined && selectValue1.value !== undefined && Calculate.flag !== 0) {
        try {
            dataSource0.value = Calculate.calculate[Calculate.frame]['table'][selectValue0.value + '_' + selectValue1.value]
        } catch (error) {
            console.error(error)
            message.error('数据异常')
        }
    } else if (selectValue0.value === undefined && selectValue1.value === undefined && Calculate.flag !== 0) {
        try {
            dataSource0.value = Calculate.calculate[Calculate.frame]['table']['_']
        } catch (error) {
            console.error(error)
            message.error('无默认数据:_')
        }
    }
}

// 选择某个具体行
function selectRow(record) {
    let selectedOption = props.configItem['module_select'].submodule[1].options.find(item => item.value === selectValue1.value)
    selectName.value = selectedOption ? selectedOption.label + '_' + record.id : record.id
    let sData = props.configItem.module_table_columns.filter(item => item.dataIndex !== 'id').map(item => {
        return Number(record.children[0][item.dataIndex] || 0)
    })
    myChart.setOption({
        series: [
            {
                data: [
                    {
                        value: sData,
                        name: 'dataA'
                    },
                ]
            }
        ]
    })
    // activeKey.value = 0
    // dataSource1.value = record.otherDetailed.table1 || []
    // dataSource2.value = record.otherDetailed.table2 || []
    // dataSource3.value = record.otherDetailed.table3 || []
    // score.value[0] = record.otherDetailed.table2_score || 0
    // score.value[1] = record.otherDetailed.table3_score || 0

    // if (!mybarChart) {
    //     mybarChart = echarts.init(document.getElementById('echarts_bar'));
    // }
    // let batX = props.configItem.module_table1_columns.map(item => item.title)

    // let barY = dataSource1.value[0] ? [
    //     {
    //         name: 'bar',
    //         type: 'bar',
    //         data: props.configItem.module_table1_columns.map(item => dataSource1.value[0][item.dataIndex]),
    //         emphasis: {
    //             focus: 'series'
    //         },
    //         animationDelay: function (idx) {
    //             return idx * 10;
    //         }
    //     }
    // ] : []

    // mybarChart.setOption({
    //     color: ['#85ceff', '#5470c6', '#91cc75', '#fac858', '#ee6666'],
    //     tooltip: {},
    //     grid: {
    //         top: 8,
    //         left: "2%",
    //         right: "2%",
    //         bottom: 20

    //     },
    //     xAxis: {
    //         data: batX,
    //         splitLine: {
    //             show: false
    //         }
    //     },
    //     yAxis: {},
    //     series: barY,
    //     animationEasing: 'elasticOut',
    //     animationDelayUpdate: function (idx) {
    //         return idx * 5;
    //     }
    // });
}
function makeDecision() {
    selectValue0.value = props.configItem['module_select'].submodule[0].options[0].value
    selectValue1.value = props.configItem['module_select'].submodule[1].options[0].value
    selectedCallback()
}

function openShowDetails(details) {
    detailsList.value = details
    detailsListModal.value = true

}
onMounted(() => {
    let chartDom = document.getElementById('echarts');
    myChart = echarts.init(chartDom);
    let indicator = props.configItem.module_table_columns.filter(item => item.dataIndex !== 'id').map(item => {
        return {
            text: item.title,
            max: props.configItem.indicator_max || 100
        }
    })
    const option = {
        color: ['#FFE434', '#67F9D8', '#56A3F1', '#FF917C'],
        legend: { show: false },
        radar: [
            {
                indicator: indicator,
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
                        value: [],
                        name: 'dataA'
                    },
                ]
            }
        ]
    };

    option && myChart.setOption(option);
})

Calculate.$subscribe((mutation, state) => {
    let newstepItem = []
    isOverall.value = state.isOverall
    currentSteps.value = isOverall.value ? state.frame - 1 : state.frame
    for (let i = 0; i < state.calculate.length; i++) {
        newstepItem.push({ title: state.calculate[i].name, icon: isOverall.value && i === 0 && h(FundFilled) || undefined })
    }
    stepItem.value = newstepItem
    selectValue0.value = undefined
    selectValue1.value = undefined
    if (state.calculate.length > 0) {
        logValue.value = state.calculate[state.frame].log
        selectedCallback()
    } else {
        dataSource0.value = []
        logValue.value = ''
    }
    selectName.value = '未选择'
    activeKey.value = 0
    dataSource1.value = []
    dataSource2.value = []
    dataSource3.value = []
    score.value = [0, 0, 0]

    mybarChart && mybarChart.setOption({
        series: [{ data: [] }]
    });
    myChart && myChart.setOption({
        series: [
            {
                data: [
                    {
                        value: [],
                        name: 'dataA'
                    },
                ]
            }
        ]
    })

})
function changeSteps(currect) {
    // Calculate.frame = currect
    Calculate.$patch({ frame: isOverall.value ? currect + 1 : currect })
}

const segmentedOption = computed(() => Calculate.calculate.map(item => item.name))
// const segmentedValue = ref(segmentedOption[0])


const rightTable0 = ref()
const rightTable1= ref()
const rightTable2= ref()
const rightTable = [rightTable0, rightTable1, rightTable2]

function saveTable() {
    // console.log(rightTable[activeKey.value])
    let tempkey = Number(activeKey.value)
    request({
    url: '/api/setTable',
    method: 'POST',
    data: rightTable[tempkey].value.dataSource
  }).then(res => {
    // console.log(res)
    score.value[tempkey] = res.data['table' + tempkey].score
  })
}

function openModal(type) {
    let tempkey = Number(activeKey.value)
    rightTable[tempkey].value.openModal(type)
}


</script>

<template>
    <a-flex :vertical="true" justify="space-between" style="height: 100%;">
        <div>
            <sub-title :title="props.configItem['module_select'].name"></sub-title>
            <a-row style="height: 350px;">
                <a-col :span="20">
                    <a-flex justify="space-between">
                        <a-space style="text-align: left;">
                            <a-select style="width: 120px" v-model:value="selectValue0" @change="selectedCallback"
                                :options="props.configItem['module_select'].submodule[0].options"></a-select>
                            <a-select style="width: 120px" v-model:value="selectValue1" @change="selectedCallback"
                                :options="props.configItem['module_select'].submodule[1].options"></a-select>
                            <a-button type="primary" @click="makeDecision">决策</a-button>
                        </a-space>
                        <span>当前选择：{{ selectName }}</span>
                    </a-flex>
                    <a-table :dataSource="dataSource0" :columns="columns0" size="small" class="table-pre-line"
                        :scroll="{ y: 223 }">
                        <template #bodyCell="{ text, column, record }">
                            <template v-if="column.key === 'operate' && record.operate !== false">
                                <a @click="selectRow(record)">选择</a>
                            </template>
                            <template v-else-if="column.key === 'id' && record.operate === false">
                                <span>总分：{{ record.sum }}</span>
                            </template>
                            <template v-else-if="record.operate !== false">
                                <!-- :style="{ marginLeft: `${buttonWidth}px`, whiteSpace: 'nowrap' }" -->
                                <a-tooltip placement="topLeft" trigger="click" :overlayStyle="{ whiteSpace: 'pre-line' }"
                                    v-if="!Array.isArray(record[column.key + '_hover'])">
                                    <template #title>
                                        <span>{{ record[column.key + '_hover'] || text }}</span>
                                    </template>
                                    {{ text }}
                                </a-tooltip>
                                <span v-else @click="openShowDetails(record[column.key + '_hover'])">
                                    {{ text }}
                                </span>
                            </template>
                        </template>
                    </a-table>
                    <a-modal v-model:open="detailsListModal" title="详情页" :footer="null" :width="900"
                        :bodyStyle="{ padding: '16px 0px 24px 0px' }">
                        <template v-if="Array.isArray(detailsList[0])">
                            <a-tabs >
                                <a-tab-pane :key="tab" v-for="(tab, j) in segmentedOption" :tab="tab">
                                    <a-descriptions bordered size="small">
                                        <a-descriptions-item v-for="(item, i) in detailsList[j]" :key="i"  :labelStyle="{color: item.color || '#ffffffd9'}"
                                            :label="item.label" :span="3">
                                            <a-row :style="{color: item.color || '#ffffffd9'}">
                                                <a-col :span="12">{{ item.value }}</a-col>
                                                <a-col :span="12">{{ item.range || '' }}</a-col>
                                            </a-row>
                                        </a-descriptions-item>
                                    </a-descriptions>
                                </a-tab-pane>
                            </a-tabs>
                        </template>
                        <template v-else>
                            <a-descriptions bordered size="small">
                                <a-descriptions-item v-for="(item, i) in detailsList" :key="i" :label="item.label" :labelStyle="{color: item.color || '#ffffffd9'}"
                                    :span="3">
                                    <a-row :style="{color: item.color || '#ffffffd9'}">
                                                <a-col :span="12">{{ item.value }}</a-col>
                                                <a-col :span="12">{{ item.range || '' }}</a-col>
                                    </a-row>
                                </a-descriptions-item>
                            </a-descriptions>
                        </template>
                    </a-modal>
                </a-col>
                <a-col :span="4">
                    <div id="echarts" style="width: 100%;height: 300px;"></div>
                </a-col>
            </a-row>
        </div>
        <div>
            <sub-title :title="props.configItem['module_right_title2']"></sub-title>
            <a-tabs v-model:activeKey="activeKey" class="large-screen-right-tabs">
                <template #rightExtra>
                    <!-- <a-button type="primary" style="margin-right: 12px;" @click="saveTable">保存并运行</a-button> -->
                    <a-button type="primary" style="margin-right: 12px;" @click="openModal('file')">数据文件导入</a-button>
                    <a-button type="primary" style="margin-right: 12px;" @click="openModal('data')">输入数据</a-button>
                </template>
                <a-tab-pane :key="0" :tab="props.configItem['module_table_ext'][0]">
                    <!-- <a-table :dataSource="dataSource1" :columns="columns1" size="small">
                    </a-table> -->
                    <!-- <div id="echarts_bar" style="width: 100%;height: 100px;"></div> -->
                    <a-row>
                        <a-col :span="16">
                            <!-- <a-table :dataSource="dataSource1" :columns="columns1" size="small">
                            </a-table> -->
                            <editableTable :myColumns="columns1" ref="rightTable0" :title="props.configItem['module_table_ext'][0]" @updateScore="param => score[0] = param" tableId="table1"></editableTable>
                        </a-col>
                        <a-col :span="8">
                            <div class="waterbg">{{ score[0] }}</div>
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane :key="1" :tab="props.configItem['module_table_ext'][1]">
                    <a-row>
                        <a-col :span="16">
                            <!-- <a-table :dataSource="dataSource2" :columns="columns2" size="small">
                            </a-table> -->
                            <titletable :myColumns="columns2" ref="rightTable1" :title="props.configItem['module_table_ext'][1]" hasH1 @updateScore="param => score[1] = param" tableId="table2"></titletable>
                        </a-col>
                        <a-col :span="8">
                            <div class="waterbg">{{ score[1] }}</div>
                        </a-col>
                    </a-row>
                </a-tab-pane>
                <a-tab-pane :key="2" :tab="props.configItem['module_table_ext'][2]">
                    <a-row>
                        <a-col :span="16">
                            <!-- <a-table :dataSource="dataSource3" :columns="columns3" size="small">
                            </a-table> -->
                            <titletable :myColumns="columns3" ref="rightTable2" :title="props.configItem['module_table_ext'][2]" hasH1 @updateScore="param => score[2] = param" tableId="table3"></titletable>
                        </a-col>
                        <a-col :span="8">
                            <div class="waterbg">{{ score[2] }}</div>
                        </a-col>
                    </a-row>
                </a-tab-pane>
            </a-tabs>
        </div>
        <a-row>
            <a-col :span="12">
                <div class="log-box">
                    <img src="@/assets/img/box.png" />
                    <a-textarea v-model:value="logValue" placeholder="等待日志输出" :disabled="true" />
                </div>
            </a-col>
            <a-col :span="12" style="align-items: center;display: flex;padding: 24px;">
                <a-steps style="width: 100%;height: 24px;" v-model:current="currentSteps" size="small" :items="stepItem"
                    :initial="isOverall ? -1 : 0" label-placement="vertical" @change="changeSteps"
                    :class="[isOverall ? 'has-overall' : '', 'my-bottom-step']"></a-steps>
            </a-col>
        </a-row>
    </a-flex>
    <!-- <a-table :dataSource="dataSource0" :columns="columns2" size="small" class="right-content-top-table" /> -->
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

.large-Screen .ant-table-wrapper .ant-table-tbody>tr.ant-table-placeholder:hover>td {
    background-color: var(--bg-color-black);
}

/* .large-Screen .ant-table-empty .ant-table-cell:hover {
    background-color: black;
} */

.large-Screen .ant-table-empty .ant-empty-description,
.large-Screen .ant-table-empty .ant-empty-description:hover {
    color: #ffffff
}

.large-Screen .ant-table-row-expand-icon {
    color: var(--bg-color-black);
}

.large-screen-right-tabs .ant-tabs-tab {
    color: #fff;
}


.large-screen-right-tabs .ant-tabs-tabpane {
    /* height: 170px; */
    overflow-y: auto;
    padding-right: 30px;
}

.large-screen-right-tabs .ant-tabs-content-holder {
    /* min-height: 276px; */
    height: 250px;
}

/* .large-screen-right-tabs .ant-tabs-tabpane input {
    background-color: #526578;
    border-color: #425160;
    color: #fff;
} */
.log-box {
    padding: 16px;
    width: 100%;
    position: relative;
}

.log-box img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
}

.log-box textarea {
    border: none;
    height: 100%;
    color: #fff !important;
    cursor: text !important;
}

.log-box textarea::placeholder {
    color: #909090;
    /* 灰色的placeholder文本 */
}

/* .my-bottom-step.ant-steps {
    color: #fff;
} */
.my-bottom-step.ant-steps .ant-steps-item-wait .ant-steps-item-icon {
    background-color: rgba(255, 255, 255, 0.9);
}

/* .my-bottom-step.ant-steps .ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-content>.ant-steps-item-title {
    color: #fff;
}

.my-bottom-step.ant-steps .ant-steps-item:not(.ant-steps-item-active)>.ant-steps-item-container[role='button'] .ant-steps-item-title {
    color: #fff;
} */

.my-bottom-step.ant-steps .ant-steps-item>.ant-steps-item-container .ant-steps-item-title {
    color: #fff;
}

.my-bottom-step.ant-steps .ant-steps-item-title:after {
    background-color: #1677ff !important;
}

.my-bottom-step.ant-steps .ant-steps-item-process>.ant-steps-item-container>.ant-steps-item-tail::after {
    background-color: #fff;
}

.my-bottom-step.ant-steps .ant-steps-item-wait>.ant-steps-item-container>.ant-steps-item-tail::after {
    background-color: #fff;
}

/* .my-bottom-step.ant-steps div.ant-steps-item:nth-last-of-type(2) .ant-steps-item-tail::after {
    background-color: rgba(255, 255, 255, 0) !important;
} */

.has-overall.ant-steps div.ant-steps-item:nth-of-type(1) .ant-steps-item-tail::after {
    background-color: rgba(255, 255, 255, 0) !important;
}

.has-overall.ant-steps .ant-steps-item-finish .anticon-fund {
    color: #fff;
}

.waterbg {
    background-image: url('@/assets/img/waterbg.png');
    width: auto;
    /* height: 100%; */
    height: 176px;
    background-size: contain;
    /* 背景图片覆盖整个容器 */
    background-position: center;
    /* 背景图片居中显示 */
    background-repeat: no-repeat;
    color: #47FFFF;
    font-size: 48px;
    text-align: center;
    padding-top: 10px;
}

.table-pre-line .ant-table-cell {
    white-space: pre-line;
}</style>