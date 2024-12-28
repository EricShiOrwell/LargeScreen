<template>
    <a-spin :spinning="spinning" wrapperClassName="excel-spin">
        <a-tabs v-model:activeKey="activeKey" type="card" @tabClick="changetabs">
            <template #rightExtra>
                <a-space style="margin-bottom: 12px;">
                    <a-button @click="openModal">添加</a-button>
                    <a-upload v-model:file-list="fileList" name="file" action="/api/saveCsv" @change="handleChange"
                        :data="{ name: activeKey }" accept=".csv" :showUploadList="false">
                        <a-button>
                            导入
                        </a-button>
                    </a-upload>
                    <!-- <a-button>导入</a-button> -->
                    <a-button :href="'/api/download/csv?name=' + activeKey">导出</a-button>
                    <a-button @click="savedata">保存</a-button>
                    <a-button @click="undo">重置</a-button>
                </a-space>
            </template>
            <a-tab-pane :tab="tabname[i]" v-for="(tab, i) in tabkey" :key="tab"></a-tab-pane>
        </a-tabs>
        <div class="excel-container">
            <!-- <hot-table :data="data" :rowHeaders="true" :colHeaders="true" 
            licenseKey="non-commercial-and-evaluation"></hot-table> -->
            <hot-table :settings="hotSettings" ref="hotTableComponent" :language="language"></hot-table>
        </div>
        <a-modal v-model:open="open" title="添加数据" @ok="insertData" @cancel="initData" ok-text="确认" cancel-text="取消">
            <a-form :model="formState" :label-col="{ span: 8 }" :wrapper-col="{ span: 12 }" autocomplete="off">
                <a-form-item :label="formItem.label" :name="i" :rules="formItem.rules || []" v-for="(formItem, i) in tabConfig[activeKey]" :key="i">
                    <a-input v-if="formItem.type === 'input'" v-model:value="formState[i]" :placeholder="formItem.placeholder || '请输入'"/>
                    <a-select v-else-if="formItem.type === 'select'" v-model:value="formState[i]" :placeholder="formItem.placeholder || '请选择'"
                    :options="formItem.options"></a-select>
                    <a-input-number v-else-if="formItem.type === 'number'" v-model:value="formState[i]" :min="formItem.min" :max="formItem.max" :step="formItem.step || 1"
                    />
                    <a-space v-else-if="formItem.type === 'selectGroup'">
                        <a-select v-for="(selectItem, j) in formItem.options" :key="j" v-model:value="formState[i][j]" :placeholder="formItem.placeholder || '请选择'" :options="selectItem"></a-select>
                    </a-space>
                </a-form-item>
            </a-form>
        </a-modal>
    </a-spin>
</template>
  
<script>
import { defineComponent } from 'vue';
import { HotTable } from '@handsontable/vue3';
import {
  registerLanguageDictionary,
  zhCN,
} from 'handsontable/i18n';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { request } from '@/assets/myfetch.js'
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
// register Handsontable's modules
registerLanguageDictionary(zhCN);
registerAllModules();
export default defineComponent({
    data() {
        return {
            hotSettings: {
                data: [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]],
                colHeaders: true,
                rowHeaders: true,
                // height: 'auto',
                autoWrapRow: true,
                autoWrapCol: true,
                // minSpareRows: 1,
                // minSpareCols: 1,
                // enable filtering
                filters: true,
                // enable the column menu
                dropdownMenu: true,
                // stretchH: 'all',
                contextMenu: true,
                licenseKey: 'non-commercial-and-evaluation',
            },
            activeKey: 'table1',
            // tabkey: ['table1', 'table2', 'table3', 'table4'],
            // tabname: ['table1', 'table2', 'table3', 'table4'],
            tabkey: [],
            tabname: [],
            tabConfig: {},
            dataMap: {},
            spinning: true,
            fileList: [],
            open: false,
            formState: {},
            language: 'zh-CN'
        };
    },
    components: {
        HotTable,
    },
    methods: {
        //没有保存的数据会丢失
        changetabs(activeKey) {
            // console.log(this.activeKey)
            if (activeKey === this.activeKey)
                return
            let tempKey = this.activeKey
            let that = this
            // debugger
            Modal.confirm({
                title: '是否要继续切换表格？',
                icon: createVNode(ExclamationCircleOutlined),
                content: '未保存的数据将会丢失',
                okText: '继续',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    // console.log('OK');
                    that.getCsv(activeKey)
                },
                onCancel() {
                    // console.log('Cancel');
                    that.activeKey = tempKey
                },
            });
        },
        getCsv(activeKey) {
            this.spinning = true
            request({
                url: '/api/getCsv',
                data: { name: activeKey }
            }).then(res => {
                // debugger
                // const _key = this.tabkey.findIndex(key => key === activeKey)
                this.dataMap[activeKey] = res
                // this.hotSettings.data = JSON.parse(JSON.stringify(res))
                this.$refs.hotTableComponent.hotInstance.loadData(JSON.parse(JSON.stringify(res)));
                // this.$refs.hotTableComponent.hotInstance.updateSettings({});
            }).finally(() => {
                this.spinning = false
            })
        },
        handleChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                this.getCsv(this.activeKey)
                message.success('文件上传成功！');
            } else if (info.file.status === 'error') {
                message.error('文件上传失败！');
            }
        },
        savedata() {
            request({
                url: '/api/saveCsvData',
                data: {
                    data: this.$refs.hotTableComponent.hotInstance.getSourceData(),
                    name: this.activeKey
                }
            }).then(res => message.success('保存成功！')).catch(err => message.error('文件上传失败！'))
            // { data: hot.getData() }
        },
        undo() {
            let that = this
            Modal.confirm({
                title: '是否要继续重置表格？',
                icon: createVNode(ExclamationCircleOutlined),
                content: '未保存的数据将会丢失',
                okText: '继续',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    // const _key = that.tabkey.findIndex(key => key === that.activeKey)
                    let res = that.dataMap[that.activeKey]
                    that.$refs.hotTableComponent.hotInstance.loadData(JSON.parse(JSON.stringify(res)));
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        },
        insertData() {
            // console.log(this.formState)
            let data = []
            this.tabConfig[this.activeKey].forEach((element,i) => {
                if(element.type === "selectGroup") {
                    data.push(this.formState[i].join(','))
                } else {
                    data.push(this.formState[i] || '')
                }
            })
            let res = this.$refs.hotTableComponent.hotInstance.getSourceData() || []
            res.push(data)
            this.$refs.hotTableComponent.hotInstance.loadData(res);
            this.open = false
        },
        initData() {
            this.formState = {}
            this.tabConfig[this.activeKey].forEach((element,i) => {
                if(element.type === "selectGroup") {
                    this.formState[i] = new Array(element.options.length)
                }
            });
            this.open = false
        },
        openModal() {
            this.formState = {}
            this.tabConfig[this.activeKey].forEach((element,i) => {
                if(element.type === "selectGroup") {
                    this.formState[i] = new Array(element.options.length)
                }
            });
            this.open = true
        }
    },
    mounted() {
        if (window.configItem.module_csv) {
            this.tabkey = Object.keys(window.configItem.module_csv)
            this.tabname = this.tabkey.map(item => window.configItem.module_csv[item])
            this.getCsv(this.activeKey)
            // this.spinning = false
        }
        if(window.configItem.module_csv_config) {
            this.tabConfig = window.configItem.module_csv_config
        }
        // window.test =this
    }
});
</script>
<style>
.excel-container {
    position: relative;
    width: 100%;
    height: calc(100% - 62px);
    overflow: hidden;
}

.excel-spin {
    height: 100%;
}

.excel-spin .ant-spin-container {
    height: 100%;
}

/* .excel-container .handsontable td {
    background-color: var(--bg-color-black);
    color: white;
    border-color: #5e5e5e;
} */
/* .excel-container .handsontable th {
    background-color: #262626;
    color: white;
    border-color: #5e5e5e;
} */

/* .excel-container .handsontable tbody th.ht__highlight, .excel-container .handsontable thead th.ht__highlight {
    background-color: #0a0a0a;
    color: white;
} */
</style>
  