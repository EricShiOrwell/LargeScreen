<script setup>
import subTitle from '@/components/subTitle.vue';
import { message } from 'ant-design-vue';
import emap from '@/components/emap.vue'
import { request } from '@/assets/myfetch.js'
import { reactive, ref } from 'vue';
import { useCalculateStore } from '@/stores/counter'
const props = defineProps(['configItem'])
const Calculate = useCalculateStore()

//init
const value0 = ref(0);
const value1 = ref(0);
const fileUrl = ref("")
const dataValue = ref([JSON.parse(JSON.stringify(props.configItem['simulateddata']))])
const currentDataSteps = ref(0)
const stepItem = ref([])
// 0 准备 1 已保存 2 运行中
const status = ref(0)
const activeKey = ref(0);
const moduleInputValue = ref(props.configItem['module_input'].submodule.map(item => [...item.value]))
// fin init

const open = ref(false)
const radioStyle = reactive({
    display: 'flex',
    height: '30px',
    lineHeight: '30px',
});
const cardStyle = reactive({
    padding: '10px'
    // backgroundColor: 'var(--bg-color-black)'
});
function runtask(flag) {
    if (flag === 0) {
        if ((value1.value !== 2 && fileUrl.value === '')) {
            open.value = true
            return
        }
        request({
            url: '/api/setConfig',
            data: { radioValue: [value0.value, value1.value], fileUrl: fileUrl.value, dataValue: dataValue.value }
        }).then(() => {
            message.success('保存成功！');
            setTimeout(() => {
                status.value = 1
            }, 1000)
        }).catch(err => {
            message.error('保存失败！');
        })
    }
    if (flag === 1) {
        request({
            url: '/api/run',
            data: { radioValue: [value0.value, value1.value], fileUrl: fileUrl.value, dataValue: dataValue.value }
        }).then(() => {
            message.success('运算开始');
            status.value = 0
            request({
                url: '/api/getData',
                data: {}
            }).then(res => {
                Calculate.changeData(res.timestamp, res.frame)
            }).catch(err => {
                console.log(err)
                message.error('计算失败！')
            })
        }).catch(err => {
            message.error('指令下发失败！');
        })
    }
    if (flag === 2) {
        status.value = 0
    }
    if (flag === 3) {
        location.reload()
        // Calculate.$reset()
        // debugger
        // value0.value = 0
        // value1.value = 0
        // fileUrl.value = ''
        // dataValue.value = [JSON.parse(JSON.stringify(props.configItem['simulateddata']))]
        // currentDataSteps.value = 0
        // stepItem.value = []
        // status.value = 0
        // activeKey.value = 0
        // moduleInputValue.value = props.configItem['module_input'].submodule.map(item => [...item.value])
    }
    if (flag === 4) {
        open.value = true
    }
}


function handleOk() {
    open.value = false
}
Calculate.$subscribe((mutation, state) => {
    // debugger
    // currentDataSteps.value = state.frame
    let newstepItem = []
    let newDataValue = []
    for (let i = 0; i < state.calculate.length; i++) {
        newstepItem.push({ title: state.calculate[i].name })
        // 不是单纯的帧切换
        if (mutation.type !== "patch object") {
            newDataValue.push(props.configItem['simulateddata'].map((item, j) => {
                return {
                    ...item,
                    label: item.label,
                    value: state.calculate[i].imagineData ? state.calculate[i].imagineData[j] : ''
                }
            }))
        }
    }
    if (mutation.type !== "patch object") {
        dataValue.value = newDataValue
        currentDataSteps.value = 0
    }
    stepItem.value = newstepItem
    const temp = state.calculate[state.frame]
    if (temp) {
        moduleInputValue.value = temp.showImagineData
    }
    // state.calculate
    // dataValue.value[currentDataSteps.value].forEach((element, i) => {
    //         element.value = temp.imagineData ? temp.imagineData[i] : ''
    //     });
})

function changeSteps(currect) {
    // console.log(currect)
    // Calculate.frame = currect
    // Calculate.$patch({ frame: currect })
}
</script>

<template>
    <a-flex :vertical="true" justify="space-between" style="height: 100%;">
        <div>
            <sub-title :title="props.configItem['module_radio'].name"></sub-title>
            <div style="padding: 10px; text-align: left;" class="large-screen-card">
                <a-row :gutter="16" style="height: 150px;">
                    <a-col :span="8">
                        <a-card :title="props.configItem['module_radio'].submodule[0].name" :bodyStyle="cardStyle">
                            <a-radio-group v-model:value="value0">
                                <a-radio :style="radioStyle" :value="item.value"
                                    v-for="item in props.configItem['module_radio'].submodule[0].options"
                                    :key="item.label">{{
                                        item.label
                                    }}</a-radio>
                            </a-radio-group>
                        </a-card>
                    </a-col>
                    <a-col :span="8">
                        <a-card :title="props.configItem['module_radio'].submodule[1].name" :bodyStyle="cardStyle">
                            <a-radio-group v-model:value="value1">
                                <a-radio :style="radioStyle" :value="item.value"
                                    v-for="item in props.configItem['module_radio'].submodule[1].options"
                                    :key="item.label">{{
                                        item.label
                                    }}</a-radio>
                            </a-radio-group>
                        </a-card>
                    </a-col>
                    <a-col :span="8">
                        <a-space direction="vertical" style="height: 195px;">
                            <a-button type="primary" @click="runtask(0)">保存</a-button>
                            <a-button type="primary" @click="runtask(1)" :disabled="status !== 1">运行</a-button>
                            <!-- <a-button type="primary" @click="runtask(2)" :disabled="status !== 2">中止</a-button> -->
                            <a-button type="primary" @click="runtask(3)">刷新</a-button>
                            <a-button type="primary" @click="runtask(4)">{{ value1 === 2 ? '数据' : '导入' }}</a-button>
                        </a-space>
                    </a-col>
                </a-row>
            </div>
        </div>
        <div>
            <sub-title :title="props.configItem['module_input'].name"></sub-title>
            <a-tabs v-model:activeKey="activeKey" class="large-screen-tabs">
                <a-tab-pane v-for="(tab, i) in props.configItem['module_input'].submodule" :key="i" :tab="tab.name">
                    <!-- <a-form :model="tab.value">
                <a-row :gutter="24">
                    <template v-for="(formitem, j) in tab.formList" :key="j">
                        <a-col :span="8">
                            <a-form-item :label="formitem.label">
                                <a-input v-model:value="tab.value[j]" placeholder=""></a-input>
                            </a-form-item>
                        </a-col>
                    </template>
                </a-row>
            </a-form> -->
                    <a-descriptions title="" size="small">
                        <a-descriptions-item v-for="(formitem, j) in tab.formList" :key="formitem.label + j"
                            :label="formitem.label" :span="formitem.span">{{
                                moduleInputValue[i][j]
                            }}</a-descriptions-item>
                    </a-descriptions>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div style="width: 90%; padding-right: 60px; padding-left: 8px;max-height: 300px;">
            <!-- <a-image :width="'100%'" :src="props.configItem['module_img'].value" /> -->
            <emap></emap>
        </div>
    </a-flex>

    <a-modal v-model:open="open" title="导入和数据" @ok="handleOk" ok-text="确认" cancel-text="取消"
        :bodyStyle="{ maxHeight: '500px', overflow: 'auto' }">
        <template #footer>
            <a-button key="submit" type="primary" @click="handleOk">确认</a-button>
        </template>
        <template v-if="value1 === 2">
            <a-flex justify="space-between">
                <template v-for="(frameItem, i) in dataValue" :key="i">
                    <a-space class="site-input-group-wrapper" direction="vertical" size="middle"
                        v-show="currentDataSteps === i">
                        <template  v-for="(item, j) in frameItem">
                            <a-input-group compact v-if="!item.relevance || item.relevance.includes(value0)" :key="j">
                            <a-input v-model:value="item.label" :disabled="true"
                                :style="{ width: '49%', textAlign: 'center', color: item.color || 'rgba(0, 0, 0, 0.25)', backgroundColor: item.bgColor || 'rgba(0, 0, 0, 0.04)' }" />
                            <a-select v-model:value="item.value" style="width: 49%" :options="item.options"
                                v-if="item.type === 'select'"></a-select>
                            <a-select v-model:value="item.value" style="width: 49%" :options="item.options"
                                v-else-if="item.type === 'multiple'" mode="multiple" max-tag-count="responsive"></a-select>
                            <a-input v-model:value="item.value" style="width: 49%" v-else />
                        </a-input-group>
                        </template>
                    </a-space>
                </template>
                <a-steps v-model:current="currentDataSteps" direction="vertical" :progressDot="true" style="width: 100px"
                    @change="changeSteps" :items="stepItem"></a-steps>
            </a-flex>
        </template>
        <template v-else>
            <p>请输入导入数据文件的网络路径：</p>
            <a-input v-model:value="fileUrl" placeholder="..."></a-input>
        </template>
    </a-modal>
</template>
<style>
.large-screen-card .ant-card {
    background-color: var(--bg-color-black);
}

.large-screen-card .ant-card .ant-card-head {
    color: #fff;
    min-height: min-content;
}

.large-screen-tabs .ant-tabs-tab {
    color: #fff;
}

.large-screen-tabs.ant-tabs {
    margin-left: 8px;
    margin-right: 20px;
    width: 80%;
}

.large-screen-tabs .ant-tabs-tabpane {
    height: 170px;
    overflow-y: auto;
    padding-right: 30px;
}

.large-screen-tabs .ant-tabs-tabpane input {
    background-color: #526578;
    border-color: #425160;
    color: #fff;
}

.large-Screen .ant-btn-primary:disabled {
    color: #fff;
}

.large-screen-tabs .ant-descriptions .ant-descriptions-item-label {
    color: #fff;
}

.large-screen-tabs .ant-descriptions .ant-descriptions-item-content {
    color: #fff;
}
</style>