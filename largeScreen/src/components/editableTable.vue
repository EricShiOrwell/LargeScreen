<template>
    <a-table  :data-source="dataSource" :columns="columns" size="small" :pagination="false">
        <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex !== '_type'">
                <div class="editable-cell">
                    <div v-if="editableData.includes(column.key+'_' + record.key)" class="editable-cell-input-wrapper">
                        <a-input v-model:value="dataSource[record.key][column.key]" @pressEnter="save(record.key, column.key)" />
                        <check-outlined class="editable-cell-icon-check" @click="save(record.key, column.key)" />
                    </div>
                    <div v-else class="editable-cell-text-wrapper">
                        {{ text || '请输入' }}
                        <edit-outlined class="editable-cell-icon" @click="edit(record.key, column.key)" />
                    </div>
                </div>
            </template>
            <template v-else>
                {{ text || ' ' }}
            </template>
        </template>
    </a-table>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
const props = defineProps({
    myColumns: {
        type: Array,
        required: true
    }
})
const columns = computed(() => {
    return [
    {
        title: '',
        dataIndex: '_type',
    },
    ].concat(props.myColumns)
})
// const columns = [
//     {
//         title: 'name',
//         dataIndex: 'name',
//         width: '30%',
//     },
//     {
//         title: 'age',
//         dataIndex: 'age',
//     },
//     {
//         title: 'address',
//         dataIndex: 'address',
//     },
//     {
//         title: 'operation',
//         dataIndex: 'operation',
//     },
// ];
const dataSource = ref([
    {
        key: '0',
        _type: '输入'
    },
    {
        key: '1',
        _type: '权重'
    },
]);
// const count = computed(() => dataSource.value.length + 1);
const editableData = reactive([]);
const edit = (key, column) => {
    debugger
    editableData.push(column+'_' + key)
    // editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
};
const save = (key, column) => {
    // Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    // delete editableData[key];
    let i = editableData.findIndex(t => t === column+'_' + key)
    editableData.splice(i, 1)
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
    dataSource
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
