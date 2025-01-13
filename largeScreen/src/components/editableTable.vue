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
            <a-descriptions :title="subTitle" bordered style="margin-top: 32px;" :column="6">
                <a-descriptions-item label="数据类型" v-if="!props.hasH1" :span="6">权重</a-descriptions-item>
                <template v-for="(item, i) in columns" :key="i">
                    <a-descriptions-item :label="item.title" v-if="item.dataIndex !== '_type'" :span="item.span">
                        <a-input v-model:value="tempDataSource[0][item.dataIndex]" placeholder="请输入" />
                    </a-descriptions-item>
                </template>
            </a-descriptions>
        </template>
    </a-modal>
</template>
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
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
const modalWidth = computed(() => props.hasH1 ? 1000 : 520)
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
const tempDataSource = ref([{}])
function openModal(_type) {
    type.value = _type
    open.value = true;
    if (_type === 'data') {
        let row = {
        }
        props.myColumns.forEach(element => {
            row[element.dataIndex] = (typeof element.default === "undefined") ? '' : element.default
        });
        tempDataSource.value = [row]
    }
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
        params.data = tempDataSource.value[0]
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
