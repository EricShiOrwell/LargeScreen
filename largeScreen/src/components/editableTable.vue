<template>
    <a-table :data-source="dataSource" :columns="columns" size="middle" :pagination="false">
    </a-table>
    <a-modal v-model:open="open" :title="props.title" :confirm-loading="confirmLoading" @ok="handleOk"
        :width="modalWidth">
        <template v-if="type === 'file'">
            <p>请输入导入数据文件的网络路径：</p>
            <a-input v-model:value="fileUrl" placeholder="..."></a-input>
        </template>
        <template v-else>
            <a-descriptions :title="subTitle" bordered style="margin-top: 32px;" :column="6" :labelStyle="{width: '180px'}">
                <a-descriptions-item label="数据类型" v-if="!props.hasH1" :span="6">
                    <a-row>
                        <a-col flex="auto" style="margin-right: 24px; text-align: center;">数据</a-col>
                        <a-col flex="60px" style="padding-left: 6px;">权重(%)</a-col>
                    </a-row>
                </a-descriptions-item>
                <template v-for="(item, i) in columns" :key="i">
                    <a-descriptions-item :label="item.title" v-if="item.dataIndex !== '_type'" :span="item.span">
                        <a-row>
                        <a-col flex="auto" style="padding-right: 24px;"><a-input v-model:value="tempDataSource[0][item.dataIndex]" placeholder="请输入" /></a-col>
                        <a-col flex="60px"><a-input v-model:value="tempDataSource[1][item.dataIndex]"/></a-col>
                    </a-row>
                    </a-descriptions-item>
                </template>
            </a-descriptions>
        </template>
    </a-modal>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { request } from '@/assets/myfetch.js'
const props = defineProps({
    myColumns: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    hasH1: {
        type: Boolean,
    },
    tableId: {
        type: String,
        required: true
    }
})
const subTitle = computed(() => props.hasH1 ? '搜索阶段' : '')
const modalWidth = computed(() => props.hasH1 ? 1000 : 600)
const fileUrl = ref('')
const columns = computed(() => {
    return [
        {
            title: '',
            dataIndex: '_type',
            align: 'center',
            width: '50px'
        },
    ].concat(props.myColumns.map(item => {
        return {
            ...item,
            title: item.title + (item.unit ? `(${item.unit})` : ''),
            span: item.span ? item.span : 6
        }
    }))
})

const dataSource = ref([
    {
        key: '0',
        _type: '输入'
    },
]);

watch(props.myColumns, (newVal) => {
    let row = {
        key: '0',
        _type: '输入'
    }
    newVal.forEach(element => {
        row[element.dataIndex] = (typeof element.default === "undefined") ? '' : element.default
    });
    dataSource.value = [row]
}, {
    immediate: true
})
const open = ref(false);
const confirmLoading = ref(false);
const type = ref('file')
const tempDataSource = ref([{}, {}])
function openModal(_type) {
    if (_type === 'data') {
        let row0 = tempDataSource.value[0]
        let row1 = tempDataSource.value[1]
        let lastChangeData = null
        try {
            lastChangeData = JSON.parse(sessionStorage.getItem("editTableData"+props.tableId))
        } catch (error) {
            console.log("nodata")
        }
        if (lastChangeData) {
            props.myColumns.forEach(element => {
            row0[element.dataIndex] = element.dataIndex in lastChangeData[0] ? lastChangeData[0][element.dataIndex] : ((typeof element.default === "undefined") ? '' : element.default)
            row1[element.dataIndex] = element.dataIndex in lastChangeData[1] ? lastChangeData[1][element.dataIndex] : ((typeof element.weightDefault === "undefined") ? '' : element.weightDefault)
        });
        } else {
            props.myColumns.forEach(element => {
            row0[element.dataIndex] = (typeof element.default === "undefined") ? '' : element.default
            row1[element.dataIndex] = (typeof element.weightDefault === "undefined") ? '' : element.weightDefault
        });
        }
        // tempDataSource.value = [row0. row1]
    }
    type.value = _type
    open.value = true;
}
const emit = defineEmits(['updateScore'])
const handleOk = () => {
    confirmLoading.value = true;
    let params = {
        id: props.tableId,
    }
    if(type.value === 'file') {
        params.fileUrl = fileUrl.value
    } else {
        sessionStorage.setItem("editTableData"+props.tableId, JSON.stringify(tempDataSource.value))
        params.data = tempDataSource.value
    }
    request({
        url: '/api/setTable',
        method: 'POST',
        data: params
    }).then(res => {
        // res.data['table' + tempkey].score
        emit('updateScore', res.data.score)
        Object.keys(res.data.data).forEach(key => {
            dataSource.value[0][key] = res.data.data[key]
        })
        open.value = false;
        confirmLoading.value = false;
    }).catch(() => {
        confirmLoading.value = false;
        message.error('运算失败!');
    })
};
// const onDelete = key => {
//     dataSource.value = dataSource.value.filter(item => item.key !== key);
// };
// const handleAdd = () => {
//     const newData = {
//         key: `${count.value}`,
//         name: `Edward King ${count.value}`,
//         age: 32,
//         address: `London, Park Lane no. ${count.value}`,
//     };
//     dataSource.value.push(newData);
// };
defineExpose({
    dataSource,
    openModal
})
</script>
<style scoped>
.editable-cell {
    position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
    padding-right: 24px;
}

.editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
}

.editable-cell-icon {
    margin-top: 4px;
    display: none;
}

.editable-cell-icon-check {
    line-height: 28px;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
    color: #108ee9;
}


.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}
</style>
