<script setup>
import { reactive, watch, h, onMounted, nextTick } from 'vue';
import {loadEcharts, loadWaveformChart,loadRadarChart} from '@/utils/charts';
import { useEmapEvent } from '@/stores/counter'
const emapEvent = useEmapEvent()
// import Split from 'split.js';
import {
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';

let currectStatus = null;
const state = reactive({
  collapsed: false,
  selectedKeys: [],
  splitInstance: null, // Store Split.js instance
  // 添加多选状态
  multiSelectValue: [],
});

const items = reactive([
  {
    key: '1',
    icon: () => h(PieChartOutlined),
    label: '测向和定位',
    title: '测向和定位',
  },
  {
    key: '2',
    icon: () => h(DesktopOutlined),
    label: '航线绘制',
    title: '航线绘制',
  },
  {
    key: '3',
    icon: () => h(InboxOutlined),
    label: '空间网格化',
    title: '空间网格化',
  },
  {
    key: '4',
    icon: () => h(InboxOutlined),
    label: '热力图',
    title: '热力图',
  },
  {
    key: '5',
    icon: () => h(AppstoreOutlined),
    label: '栅格图',
    title: '栅格图',
  },
]);

// 多选选项
const multiSelectOptions = [
  { value: '1', label: '测向和定位' },
  { value: '2', label: '航线绘制' },
  { value: '3', label: '空间网格化' },
  { value: '4', label: '热力图' },
  { value: '5', label: '栅格图' },
];

// 多选变化处理函数
function handleMultiSelectChange(value) {
  console.log('Selected values:', value);
  state.multiSelectValue = value;
  // 处理多选变化逻辑
  value.forEach(key => {
    if (menuCallback[key]?.open) {
      menuCallback[key].open();
    }
  });
}

const menuCallback = {
  '1': {
    open: function () {
      // Initialize Split.js for two rows
      nextTick(() => {
        state.splitInstance = Split(['#row1', '#row2'], {
          direction: 'vertical',
          sizes: [50, 50],
          gutterSize: 10,
        });

        // Initialize Split.js for two columns in each row
        Split(['#screen1', '#screen2'], {
          direction: 'horizontal',
          sizes: [50, 50],
          gutterSize: 10,
          parent: document.querySelector('#row1'),
        });

        Split(['#screen3', '#screen4'], {
          direction: 'horizontal',
          sizes: [50, 50],
          gutterSize: 10,
          parent: document.querySelector('#row2'),
        });
        loadEcharts();
        loadWaveformChart();
        loadRadarChart();
      });
    },
    close: function () {
      // Destroy Split.js instance
      if (state.splitInstance) {
        state.splitInstance.destroy();
        state.splitInstance = null;
      }
    },
  },
  '2': {
    open: function () {
      emapEvent.change('2');
      console.log('航线绘制菜单打开');
      // Add your logic for opening the航线绘制 menu
    },
    close: function () {
      emapEvent.change('');
      console.log('航线绘制菜单关闭');
      // Add your logic for closing the航线绘制 menu
    },
  },
  '3': {
    open: function () {
      emapEvent.change('3');
      console.log('航线绘制菜单打开');
      // Add your logic for opening the航线绘制 menu
    },
    close: function () {
      emapEvent.change('');
      console.log('航线绘制菜单关闭');
      // Add your logic for closing the航线绘制 menu
    },
  },
  '4': {
    open: function () {
      emapEvent.change('4');
      console.log('航线绘制菜单打开');
      // Add your logic for opening the航线绘制 menu
    },
    close: function () {
      emapEvent.change('');
      console.log('航线绘制菜单关闭');
      // Add your logic for closing the航线绘制 menu
    },
  },
  '5': {
    open: function () {
      emapEvent.change('5');
      console.log('航线绘制菜单打开');
      // Add your logic for opening the航线绘制 menu
    },
    close: function () {
      emapEvent.change('');
      console.log('航线绘制菜单关闭');
      // Add your logic for closing the航线绘制 menu
    },
  },
};

function menuChange(selectedParam) {
  debugger
  if (currectStatus && currectStatus !== selectedParam.key && menuCallback[selectedParam.key]?.close) {
    menuCallback[currectStatus].close();
  }
  currectStatus = selectedParam.key;
  menuCallback[selectedParam.key]?.open();
}

onMounted(() => {});
</script>

<template>
  <div style="width: 100%">
    <a-menu
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="state.collapsed"
      :items="items"
      @select="menuChange"
    ></a-menu>
    
    <!-- 添加多选组件 -->
    <div style="padding: 16px; background: #001529;">
      <a-select
        v-model:value="state.multiSelectValue"
        mode="multiple"
        placeholder="请选择功能模块"
        style="width: 100%;"
        :options="multiSelectOptions"
        @change="handleMultiSelectChange"
      />
    </div>
    
    <div v-if="state.selectedKeys[0] === '1'" style="position: fixed; top: 10%; left: 10%; width: 30%; height: 30%; display: flex; flex-direction: column; background: #000;">
      <div id="row1" style="flex: 1; display: flex;">
        <div id="screen1" style="flex: 1; background: #111; border: 1px solid #333; height: 100%;">
          <div id="chart1" style="width: 100%; height: 100%;">Screen 1</div>
        </div>
        <div id="screen2" style="flex: 1; background: #111; border: 1px solid #333;height: 100%;">
          <div id="chart2" style="width: 100%; height: 100%;">Screen 2</div>
        </div>
      </div>
      <div id="row2" style="flex: 1; display: flex;">
        <div id="screen3" style="flex: 1; background: #111; border: 1px solid #333;">
          <div id="chart3" style="width: 100%; height: 100%;">Screen 3</div>
        </div>
        <div id="screen4" style="flex: 1; background: #111; border: 1px solid #333; position: relative;">
          <!-- 插入视频 -->
          <video
            src="/video/demo1.mp4"
            style="width: 100%; height: 100%; object-fit: cover;"
            autoplay
            loop
            muted
          ></video>
          <!-- 添加空心细圆 -->
          <div
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 30px;
              height: 30px;
              border: 2px solid red;
              border-radius: 50%;
            "
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
