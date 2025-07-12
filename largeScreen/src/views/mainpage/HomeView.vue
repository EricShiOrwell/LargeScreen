<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="navbar-left">
        <div class="logo">
          <span class="logo-icon">📡</span>
          <span class="logo-text">空地一体化演示模块</span>
        </div>
      </div>
      <div class="navbar-center">
        <nav class="nav-menu">
          <a href="#" class="nav-item active">功能演示</a>
          <a href="#" class="nav-item">实时低空态势</a>
          <a href="#" class="nav-item">空域航路管理</a>
          <a href="#" class="nav-item">飞行监督</a>
          <a href="#" class="nav-item">资质设备管理</a>
          <a href="#" class="nav-item">历史信息管理</a>
        </nav>
      </div>
      <div class="navbar-right">
        <div class="user-info">
          <span class="user-avatar">👤</span>
          <span class="username">超级管理员</span>
          <span class="dropdown-icon">▼</span>
        </div>
        <div class="datetime">{{ currentTime }}</div>
      </div>
    </header>

    <!-- 主体内容区域 -->
    <main class="main-content">
      <!-- 右侧信息面板 -->
      <aside class="right-panel">
        <div class="panel-header">
          <h3>功能列表</h3>
        </div>
        <div class="panel-content">
          <div class="info-card">
            <!-- 替换为多选框组 -->
            <div class="card-title">请选择功能模块</div>
            <a-checkbox-group v-model:value="state.multiSelectValue" :options="multiSelectOptions"
              class="checkbox-group" />
          </div>
        </div>
      </aside>

      <!-- 3D地图区域 -->
      <div class="map-container">
        <div class="map-tools">
          <button class="tool-btn">🔍</button>
          <button class="tool-btn">📐</button>
          <button class="tool-btn">📊</button>
          <button class="tool-btn">⚙️</button>
        </div>
        <emap></emap>
        <div v-if="state.showVideo"
          style="position: absolute; top: 10%; left: 10%; width: 40%; height: 50%; display: flex; flex-direction: column; background: #000;">
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
              <video src="/video/demo1.mp4" style="width: 100%; height: 100%; object-fit: cover;" autoplay loop
                muted></video>
              <!-- 添加空心细圆 -->
              <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 30px;
              height: 30px;
              border: 2px solid red;
              border-radius: 50%;
            "></div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部数据面板 -->
    <footer class="bottom-panel">
      <div class="panel-header">
        <h3>外部数据引接</h3>
        <div class="panel-controls">
          <button class="control-btn">筛选</button>
          <button class="control-btn">导出</button>
          <button class="control-btn">刷新</button>
        </div>
      </div>
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>地理围栏</th>
              <th>名称</th>
              <th>形状</th>
              <th>高度</th>
              <th>高度</th>
              <th>适用时间</th>
              <th>开启时间</th>
              <th>关闭时间</th>
              <th>实施状态</th>
              <th>显示</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15989</td>
              <td>地理围栏</td>
              <td>GH房屋飞区</td>
              <td>多边形</td>
              <td>0</td>
              <td>300</td>
              <td>永久</td>
              <td>-</td>
              <td>-</td>
              <td>已发布</td>
              <td>✓</td>
              <td>📝 🗑️</td>
            </tr>
            <tr>
              <td>15988</td>
              <td>地理围栏创建设及网格化构建</td>
              <td>作业厂房区</td>
              <td>多边形</td>
              <td>170</td>
              <td>350</td>
              <td>永久</td>
              <td>-</td>
              <td>-</td>
              <td>已发布</td>
              <td>✓</td>
              <td>📝 🗑️</td>
            </tr>
          </tbody>
        </table>
      </div>
    </footer>
  </div>

</template>

<script setup>
import { reactive, watch, h, onMounted, nextTick, ref } from 'vue';
import { loadEcharts, loadWaveformChart, loadRadarChart } from '@/utils/charts';
import { useEmapEvent } from '@/stores/counter'
import emap from '@/components/emap.vue'

const emapEvent = useEmapEvent()



// 添加时间显示
const currentTime = ref('')

const state = reactive({
  collapsed: false,
  splitInstance: null, // Store Split.js instance
  // 添加多选状态
  multiSelectValue: [],
  showVideo: false,
});


// 多选框选项
const multiSelectOptions = [
  { value: '1', label: '测向和定位', onChange: handleMultiSelectChange },
  { value: '2', label: '航线绘制', onChange: handleMultiSelectChange },
  { value: '3', label: '空间网格化', onChange: handleMultiSelectChange },
  { value: '4', label: '热力图', onChange: handleMultiSelectChange },
  { value: '5', label: '栅格图', onChange: handleMultiSelectChange },
];

// 多选变化处理函数
function handleMultiSelectChange(value) {
  if (value.target.checked) {
    // 如果是选中状态，调用对应的打开方法
    if (menuCallback[value.target.value]?.open) {
      menuCallback[value.target.value].open();
    }
  } else {
    // 如果是取消选中状态，调用对应的关闭方法
    if (menuCallback[value.target.value]?.close) {
      menuCallback[value.target.value].close();
    }
  }
}

const menuCallback = {
  '1': {
    open: function () {
      // Initialize Split.js for two rows
      state.showVideo = true;
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
      state.showVideo = false;
      if (state.splitInstance) {
        state.splitInstance.destroy();
        state.splitInstance = null;
      }
    },
  },
  '2': {
    open: function () {
      emapEvent.message('open', '2');
      console.log('航线绘制菜单打开');
    },
    close: function () {
      emapEvent.message('close', '2');
      console.log('航线绘制菜单关闭');
    },
  },
  '3': {
    open: function () {
      emapEvent.message('open', '3');
      console.log('空间网格化菜单打开');
    },
    close: function () {
      emapEvent.message('close', '3');
      console.log('空间网格化菜单关闭');
    },
  },
  '4': {
    open: function () {
      emapEvent.message('open', '4');
      console.log('热力图菜单打开');
    },
    close: function () {
      emapEvent.message('close', '4');
      console.log('热力图菜单关闭');
    },
  },
  '5': {
    open: function () {
      emapEvent.message('open', '5');
      console.log('栅格图菜单打开');
    },
    close: function () {
      emapEvent.message('close', '5');
      console.log('栅格图菜单关闭');
    },
  },
};

onMounted(() => {
  // 更新时间显示
  const updateTime = () => {
    currentTime.value = new Date().toLocaleString()
  }
  updateTime()
  setInterval(updateTime, 1000)
});
</script>

<style scoped>
/* 为多选框添加深色主题样式 */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.ant-checkbox-group) {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

:deep(.ant-checkbox-wrapper) {
  color: #ffffff !important;
  font-size: 14px !important;
  padding: 8px 0;
  border-bottom: 1px solid rgba(58, 123, 213, 0.2);
}

:deep(.ant-checkbox-wrapper:last-child) {
  border-bottom: none;
}

:deep(.ant-checkbox-wrapper:hover) {
  background-color: rgba(58, 123, 213, 0.1);
  border-radius: 4px;
  padding: 8px 8px;
  margin: 0 -8px;
}

:deep(.ant-checkbox) {
  .ant-checkbox-inner {
    background-color: rgba(20, 30, 50, 0.8) !important;
    border: 1px solid #3a7bd5 !important;
    border-radius: 3px;
  }

  .ant-checkbox-inner::after {
    border-color: #00ff88 !important;
  }
}

:deep(.ant-checkbox-checked) {
  .ant-checkbox-inner {
    background-color: rgba(58, 123, 213, 0.6) !important;
    border-color: #00ff88 !important;
  }
}

:deep(.ant-checkbox-wrapper-checked) {
  color: #00ff88 !important;
  font-weight: bold;
}

.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
  color: #ffffff;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 顶部导航栏 */
.top-navbar {
  height: 60px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 2px solid #3a7bd5;
}

.navbar-left .logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
}

.navbar-center .nav-menu {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #ffffff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid #00ff88;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.datetime {
  font-size: 14px;
  color: #cccccc;
}

/* 主体内容区域 */
.main-content {
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* 右侧信息面板 */
.right-panel {
  width: 300px;
  min-width: 300px;
  background: rgba(15, 25, 45, 0.95);
  border-left: 1px solid #3a7bd5;
  padding: 15px;
  position: relative;
  z-index: 1000;
  flex-shrink: 0;
}

.panel-header h3 {
  color: #00ff88;
  margin: 0 0 15px 0;
  font-size: 16px;
  text-align: center;
}

.info-card {
  background: rgba(20, 30, 50, 0.8);
  border: 1px solid #3a7bd5;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
}

.card-title {
  color: #00ff88;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center;
}

/* 3D地图区域 */
.map-container {
  flex: 1;
  position: relative;
  background: #000;
  overflow: hidden;
}

.map-tools {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-btn {
  width: 40px;
  height: 40px;
  background: rgba(15, 25, 45, 0.9);
  border: 1px solid #3a7bd5;
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-btn:hover {
  background: rgba(58, 123, 213, 0.3);
}

/* 底部数据面板 */
.bottom-panel {
  height: 200px;
  background: rgba(15, 25, 45, 0.95);
  border-top: 1px solid #3a7bd5;
  padding: 10px 20px;
}

.bottom-panel .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.bottom-panel .panel-header h3 {
  color: #00ff88;
  margin: 0;
  font-size: 16px;
}

.panel-controls {
  display: flex;
  gap: 10px;
}

.control-btn {
  padding: 4px 12px;
  background: rgba(58, 123, 213, 0.3);
  border: 1px solid #3a7bd5;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: rgba(58, 123, 213, 0.5);
}

.data-table {
  height: 150px;
  overflow-y: auto;
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  font-size: 12px;
}

.data-table th,
.data-table td {
  padding: 8px;
  border: 1px solid #3a7bd5;
  text-align: left;
}

.data-table th {
  background: rgba(58, 123, 213, 0.3);
  color: #00ff88;
  font-weight: bold;
}

.data-table td {
  background: rgba(20, 30, 50, 0.5);
}

.data-table tr:hover td {
  background: rgba(58, 123, 213, 0.2);
}

/* 滚动条样式 */
.data-table::-webkit-scrollbar {
  width: 6px;
}

.data-table::-webkit-scrollbar-track {
  background: rgba(15, 25, 45, 0.5);
}

.data-table::-webkit-scrollbar-thumb {
  background: #3a7bd5;
  border-radius: 3px;
}

.data-table::-webkit-scrollbar-thumb:hover {
  background: #5a9bd5;
}
</style>