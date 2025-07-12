<script setup>
// import { Cartesian3, createOsmBuildingsAsync, Ion, Math as CesiumMath, TimeInterval, Viewer, WebMapTileServiceImageryProvider, Color, ClockRange,JulianDate, SampledPositionProperty,TimeIntervalCollection, Material } from 'cesium';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted, ref } from 'vue';
// const props = defineProps(['configItem'])
import { useEmapEvent } from '@/stores/counter'
import h337 from 'heatmap.js';
// import CesiumHeatmap from 'cesium-heatmap';
// const Calculate = useCalculateStore()
const emapEvent = useEmapEvent()

let viewer = null
emapEvent.$subscribe((mutation, state) => {
    switch (state.param) {
        case '2':
            state.operate === 'open' ? drawAircraftRoute(viewer) : clearAircraftRoute(viewer);
            break;
        case '3':
            state.operate === 'open' ? drawCubeGrid(viewer) : clearCubeGrid(viewer);
            break;
        case '4':
            state.operate === 'open' ? drawHeatmap(viewer) : clearHeatmap(viewer);
            break;
        case '5':
            state.operate === 'open' ? drawGrid(viewer) : clearGrid(viewer);
            break;
        default:
            console.warn('Unknown param:', state.param);
    }
});

onMounted(() => {
    // 初始化Cesium Viewer
    Cesium.Ion.defaultAccessToken = '';
    viewer = new Cesium.Viewer("cesiumContainer", {
        shouldAnimate: true,
        selectionIndicator: true,
        animation: false, // 动画
        homeButton: false, // home键
        geocoder: false, // 地址编码
        baseLayerPicker: false, // 图层选择控件
        timeline: false, // 时间轴
        fullscreenButton: false, // 全屏显示
        infoBox: false, // 点击要素之后浮窗
        sceneModePicker: false, // 投影方式 三维/二维
        navigationInstructionsInitiallyVisible: false, // 导航指令
        navigationHelpButton: false, // 帮助信息
        selectionIndicator: false, // 选择
    });
    viewer.cesiumWidget.creditContainer.style.display = 'none';

    viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
            url: `https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&style=6&x={TileCol}&y={TileRow}&z={TileMatrix}`,
            layer: "tdtImgLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible", // 使用谷歌的瓦片切片方式
            show: true,
            maximumLevel: 18,
        })
    );
    viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
            url: `https://webst01.is.autonavi.com/appmaptile?lang=zh_cn&style=8&x={TileCol}&y={TileRow}&z={TileMatrix}`,
            layer: "tdtCiaLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible", // 使用谷歌的瓦片切片方式
            show: true,
            maximumLevel: 18,
        })
    );
    // 将三维球定位到杭州电子科技大学
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120.345, 30.304, 1000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view Hangzhou Dianzi University.");
        },
    });
});

function addPoint(option) {
    let point = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(option.longitude, option.latitude),
        billboard: {
            image: option.image || 'redpoint.jpg', // 图片路径
            scale: 1.0,
            width: 30, // 设置图片大小
            height: 30, // 设置图片大小
        },
    });
    return point;
}

function drawAircraftRoute(viewer) {
    // 获取 drawCubeGrid 的参数
    const gridStartLongitude = 120.342;
    const gridStartLatitude = 30.313;
    const cubeSize = 20; // 米
    const rows = 8;
    const cols = 10;
    const layers = 5;
    
    const metersPerDegreeLatitude = 111320;
    const metersPerDegreeLongitude = 111320 * Math.cos(Cesium.Math.toRadians(gridStartLatitude));
    
    const latitudeIncrement = cubeSize / metersPerDegreeLatitude;
    const longitudeIncrement = cubeSize / metersPerDegreeLongitude;
    
    // 设计从西向东穿过网格最靠近视角的一面
    const frontRow = 0; // 最靠近视角的南侧第一行
    const flightLayer = 2; // 在第2层飞行（高度40米）
    
    const routeData = [
        // 起飞点：网格外西南角更远处
        { longitude: gridStartLongitude - 4 * longitudeIncrement, latitude: gridStartLatitude + frontRow * latitudeIncrement - 2 * latitudeIncrement, height: 0 },
        
        // 爬升点：准备进入网格
        { longitude: gridStartLongitude - 2 * longitudeIncrement, latitude: gridStartLatitude + frontRow * latitudeIncrement, height: flightLayer * cubeSize + cubeSize / 2 },
        
        // 进入网格最前排
        { longitude: gridStartLongitude, latitude: gridStartLatitude + frontRow * latitudeIncrement, height: flightLayer * cubeSize + cubeSize / 2 },
        
        // 穿过网格前排中部
        { longitude: gridStartLongitude + (cols / 2) * longitudeIncrement, latitude: gridStartLatitude + frontRow * latitudeIncrement, height: flightLayer * cubeSize + cubeSize / 2 },
        
        // 离开网格前排
        { longitude: gridStartLongitude + (cols - 1) * longitudeIncrement, latitude: gridStartLatitude + frontRow * latitudeIncrement, height: flightLayer * cubeSize + cubeSize / 2 },
        
        // 继续飞行准备降落
        { longitude: gridStartLongitude + (cols + 2) * longitudeIncrement, latitude: gridStartLatitude + frontRow * latitudeIncrement, height: flightLayer * cubeSize + cubeSize / 2 },
        
        // 降落点：网格外东南角更远处
        { longitude: gridStartLongitude + (cols + 4) * longitudeIncrement, latitude: gridStartLatitude + frontRow * latitudeIncrement + 2 * latitudeIncrement, height: 0 },
    ];

    // 绘制穿过的立方体为绿色（最靠近视角的那一面）
    for (let j = 0; j < cols; j++) {
        const longitude = gridStartLongitude + j * longitudeIncrement;
        const latitude = gridStartLatitude + frontRow * latitudeIncrement;
        const height = flightLayer * cubeSize;

        viewer.entities.add({
            name: `Crossed Grid ${frontRow}-${j}-${flightLayer}`,
            position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + cubeSize / 2),
            box: {
                dimensions: new Cesium.Cartesian3(cubeSize, cubeSize, cubeSize),
                material: Cesium.Color.GREEN.withAlpha(0.7), // 绿色表示穿过的方块
                outline: true,
                outlineColor: Cesium.Color.YELLOW, // 黄色边框突出显示
            },
        });
    }

    // 添加起飞点标记
    viewer.entities.add({
        name: "Takeoff Point",
        position: Cesium.Cartesian3.fromDegrees(routeData[0].longitude, routeData[0].latitude, routeData[0].height + 5),
        point: {
            pixelSize: 15,
            color: Cesium.Color.LIME,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.NONE,
        },
        label: {
            text: "起飞点",
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -30),
        },
    });

    // 添加降落点标记
    viewer.entities.add({
        name: "Landing Point",
        position: Cesium.Cartesian3.fromDegrees(routeData[routeData.length - 1].longitude, routeData[routeData.length - 1].latitude, routeData[routeData.length - 1].height + 5),
        point: {
            pixelSize: 15,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.NONE,
        },
        label: {
            text: "降落点",
            font: '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -30),
        },
    });

    const positions = routeData.map((point) =>
        Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height)
    );

    // 绘制航线
    viewer.entities.add({
        name: "Aircraft Route",
        polyline: {
            positions: positions,
            width: 8,
            material: Cesium.Color.RED.withAlpha(0.8),
            clampToGround: false,
        },
    });

    // 动态飞机
    const startTime = Cesium.JulianDate.now();
    const stopTime = Cesium.JulianDate.addSeconds(startTime, routeData.length * 6, new Cesium.JulianDate());

    const property = new Cesium.SampledPositionProperty();
    routeData.forEach((point, index) => {
        const time = Cesium.JulianDate.addSeconds(startTime, index * 6, new Cesium.JulianDate());
        const position = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height);
        property.addSample(time, position);
    });

    viewer.entities.add({
        name: "Moving Aircraft",
        availability: new Cesium.TimeIntervalCollection([
            new Cesium.TimeInterval({ start: startTime, stop: stopTime }),
        ]),
        position: property,
        model: {
            uri: "/video/aircraft.glb",
            scale: 1.0,
        },
        path: {
            resolution: 1,
            material: Cesium.Color.YELLOW.withAlpha(0.8),
            width: 5,
            leadTime: 0,
            trailTime: 30,
        },
    });

    viewer.clock.startTime = startTime;
    viewer.clock.stopTime = stopTime;
    viewer.clock.currentTime = startTime;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 1;

    // 调整相机视角以最佳角度观察航线和绿色立方体
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            gridStartLongitude + (cols / 2) * longitudeIncrement, // 网格中心经度
            gridStartLatitude - 0.004, // 距离最前排更远的南侧位置
            250 // 适中的观察高度
        ),
        orientation: {
            heading: Cesium.Math.toRadians(0), // 正北方向
            pitch: Cesium.Math.toRadians(-25), // 向下倾斜25度，能清楚看到最前排
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view aircraft route through front row green cubes.");
        },
    });
}

function clearAircraftRoute(viewer) {
    // 清除所有与航线相关的实体
    const entitiesToRemove = [];
    
    viewer.entities.values.forEach(entity => {
        // 检查实体名称，清除航线相关的对象
        if (entity.name && (
            entity.name.includes('Crossed Grid') ||           // 绿色穿过的立方体
            entity.name === 'Takeoff Point' ||                // 起飞点
            entity.name === 'Landing Point' ||                // 降落点
            entity.name === 'Aircraft Route' ||               // 航线
            entity.name === 'Aircraft' ||                     // 静态飞机
            entity.name === 'Moving Aircraft'                 // 动态飞机
        )) {
            entitiesToRemove.push(entity);
        }
    });
    
    // 移除找到的实体
    entitiesToRemove.forEach(entity => {
        viewer.entities.remove(entity);
    });
    
    // 重置时钟设置
    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
    viewer.clock.multiplier = 1;
    
    console.log(`Cleared ${entitiesToRemove.length} aircraft route related entities.`);
}

function drawCubeGrid(viewer) {
    // 获取 drawCubeGrid 的参数
    const gridStartLongitude = 120.342;
    const gridStartLatitude = 30.313;
    const cubeSize = 20; // 米
    const rows = 8;
    const cols = 10;
    const layers = 5;
    
    const metersPerDegreeLatitude = 111320;
    const metersPerDegreeLongitude = 111320 * Math.cos(Cesium.Math.toRadians(gridStartLatitude));
    
    const latitudeIncrement = cubeSize / metersPerDegreeLatitude;
    const longitudeIncrement = cubeSize / metersPerDegreeLongitude;
    
    // 首先绘制正常的蓝色立方体网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < layers; k++) {
                const longitude = gridStartLongitude + j * longitudeIncrement;
                const latitude = gridStartLatitude + i * latitudeIncrement;
                const height = k * cubeSize;

                viewer.entities.add({
                    name: `Campus Grid ${i}-${j}-${k}`,
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + cubeSize / 2),
                    box: {
                        dimensions: new Cesium.Cartesian3(cubeSize, cubeSize, cubeSize),
                        material: Cesium.Color.BLUE.withAlpha(0.05),
                        outline: true,
                        outlineColor: Cesium.Color.WHITE,
                    },
                });
            }
        }
    }
    
    // 设计从西向东穿过网格最靠近视角的一面
    const frontRow = 0; // 最靠近视角的南侧第一行
    const flightLayer = 2; // 在第2层飞行（高度40米）
    
    // 调整相机视角以最佳角度观察航线和绿色立方体
    viewer.camera.flyTo({
        // destination: Cesium.Cartesian3.fromDegrees(
        //     gridStartLongitude + (cols / 2) * longitudeIncrement, // 网格中心经度
        //     gridStartLatitude + frontRow * latitudeIncrement - 4 * latitudeIncrement, // 距离最前排更远的南侧位置
        //     250 // 适中的观察高度
        // ),
        destination: Cesium.Cartesian3.fromDegrees(
            gridStartLongitude + (cols / 2) * longitudeIncrement, // 网格中心经度
            gridStartLatitude  - 0.003, // 距离最前排更远的南侧位置
            250 // 适中的观察高度
        ),
        orientation: {
            heading: Cesium.Math.toRadians(0), // 正北方向
            pitch: Cesium.Math.toRadians(-25), // 向下倾斜25度，能清楚看到最前排
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view aircraft route through front row green cubes.");
        },
    });
}

function clearCubeGrid(viewer) {
    // 清除所有与立方体网格相关的实体
    const entitiesToRemove = [];
    
    viewer.entities.values.forEach(entity => {
        // 检查实体名称，清除立方体网格相关的对象
        if (entity.name && entity.name.includes('Campus Grid')) {
            entitiesToRemove.push(entity);
        }
    });
    
    // 移除找到的实体
    entitiesToRemove.forEach(entity => {
        viewer.entities.remove(entity);
    });
    
    console.log(`Cleared ${entitiesToRemove.length} cube grid related entities.`);
}



function drawGrid(viewer) {
    const gridStartLongitude = 120.342;
    const gridStartLatitude = 30.313;
    const cubeSize = 5; // 米

    
    const metersPerDegreeLatitude = 111320;
    const metersPerDegreeLongitude = 111320 * Math.cos(Cesium.Math.toRadians(gridStartLatitude));
    
    const latitudeIncrement = cubeSize / metersPerDegreeLatitude;
    const longitudeIncrement = cubeSize / metersPerDegreeLongitude;

    // 三个相邻地块的参数
    const plots = [
        {
            name: "教学区",
            startLon: gridStartLongitude,
            startLat: gridStartLatitude,
            rows: 20,
            cols: 15,
            colors: [
                Cesium.Color.RED.withAlpha(0.7),      // 主色：红色
                Cesium.Color.ORANGE.withAlpha(0.7),   // 辅色：橙色
            ]
        },
        {
            name: "生活区",
            startLon: gridStartLongitude + 15 * longitudeIncrement,
            startLat: gridStartLatitude,
            rows: 20,
            cols: 15,
            colors: [
                Cesium.Color.BLUE.withAlpha(0.7),     // 主色：蓝色
                Cesium.Color.CYAN.withAlpha(0.7),     // 辅色：青色
            ]
        },
        {
            name: "运动区",
            startLon: gridStartLongitude + 30 * longitudeIncrement,
            startLat: gridStartLatitude,
            rows: 20,
            cols: 15,
            colors: [
                Cesium.Color.GREEN.withAlpha(0.7),    // 主色：绿色
                Cesium.Color.LIME.withAlpha(0.7),     // 辅色：柠檬绿
            ]
        }
    ];

    // 为每个地块生成栅格
    plots.forEach((plot, plotIndex) => {
        for (let i = 0; i < plot.rows; i++) {
            for (let j = 0; j < plot.cols; j++) {
                const longitude = plot.startLon + j * longitudeIncrement;
                const latitude = plot.startLat + i * latitudeIncrement;

                // 交替使用两种颜色 - 棋盘模式
                const colorIndex = (i + j) % 2;
                const color = plot.colors[colorIndex];

                viewer.entities.add({
                    name: `${plot.name} Grid ${i}-${j}`,
                    rectangle: {
                        coordinates: Cesium.Rectangle.fromDegrees(
                            longitude, // 左边界
                            latitude, // 下边界
                            longitude + longitudeIncrement, // 右边界
                            latitude + latitudeIncrement // 上边界
                        ),
                        material: color,
                        outline: true,
                        outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
                        outlineWidth: 1,
                    },
                });
            }
        }

        // 为每个地块添加标题标签
        const centerLon = plot.startLon + (plot.cols * longitudeIncrement) / 2;
        const centerLat = plot.startLat + (plot.rows * latitudeIncrement) / 2;
        
        viewer.entities.add({
            name: `${plot.name} Label`,
            position: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, 20),
            label: {
                text: plot.name,
                font: '16pt Arial',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 3,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
                backgroundPadding: new Cesium.Cartesian2(8, 4),
                showBackground: true,
            },
        });
    });

    // 添加图例
    const legendStartLon = gridStartLongitude - 3 * longitudeIncrement;
    const legendStartLat = gridStartLatitude + 10 * latitudeIncrement;
    
    plots.forEach((plot, index) => {
        // 主色图例
        viewer.entities.add({
            name: `Legend ${plot.name} Main`,
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(
                    legendStartLon,
                    legendStartLat - index * 6 * latitudeIncrement,
                    legendStartLon + longitudeIncrement,
                    legendStartLat - index * 6 * latitudeIncrement + latitudeIncrement
                ),
                material: plot.colors[0],
                outline: true,
                outlineColor: Cesium.Color.WHITE,
            },
        });
        
        // 辅色图例
        viewer.entities.add({
            name: `Legend ${plot.name} Secondary`,
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(
                    legendStartLon,
                    legendStartLat - index * 6 * latitudeIncrement + latitudeIncrement,
                    legendStartLon + longitudeIncrement,
                    legendStartLat - index * 6 * latitudeIncrement + 2 * latitudeIncrement
                ),
                material: plot.colors[1],
                outline: true,
                outlineColor: Cesium.Color.WHITE,
            },
        });
        
        // 图例标签
        viewer.entities.add({
            name: `Legend ${plot.name} Text`,
            position: Cesium.Cartesian3.fromDegrees(
                legendStartLon + 2 * longitudeIncrement, 
                legendStartLat - index * 6 * latitudeIncrement + latitudeIncrement, 
                10
            ),
            label: {
                text: plot.name,
                font: '12pt Arial',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            },
        });
    });

    const cols = 45; // 三个地块的总列数
    
    // 调整相机视角以查看校园栅格图
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            gridStartLongitude + (cols / 2) * longitudeIncrement, // 网格中心经度
            gridStartLatitude  - 0.010, // 距离最前排更远的南侧位置
            1000 // 设置观察点高度
        ),
        orientation: {
            heading: Cesium.Math.toRadians(0), // 水平方向
            pitch: Cesium.Math.toRadians(-45), // 向下倾斜45度
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view HDU campus functional zones.");
        },
    });
}
function clearGrid(viewer) {
    // 清除所有与栅格图相关的实体
    const entitiesToRemove = [];
    
    viewer.entities.values.forEach(entity => {
        // 检查实体名称，清除栅格图相关的对象
        if (entity.name && (
            entity.name.includes('教学区 Grid') ||        // 教学区栅格
            entity.name.includes('生活区 Grid') ||        // 生活区栅格
            entity.name.includes('运动区 Grid') ||        // 运动区栅格
            entity.name.includes('教学区 Label') ||       // 教学区标签
            entity.name.includes('生活区 Label') ||       // 生活区标签
            entity.name.includes('运动区 Label') ||       // 运动区标签
            entity.name.includes('Legend')               // 图例相关
        )) {
            entitiesToRemove.push(entity);
        }
    });
    
    // 移除找到的实体
    entitiesToRemove.forEach(entity => {
        viewer.entities.remove(entity);
    });
    
    console.log(`Cleared ${entitiesToRemove.length} grid related entities.`);
}

function drawHeatmap(viewer) {
    // 创建一个临时的容器div（必须是div元素，不是canvas）
    const tempContainer = document.createElement('div');
    tempContainer.style.width = '1024px';
    tempContainer.style.height = '1024px';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // 移出可视区域
    tempContainer.style.top = '0px';
    document.body.appendChild(tempContainer);

    // 创建heatmap实例，添加必需的tileWidth和tileHeight参数
    const heatmapInstance = h337.create({
        container: tempContainer,
        radius: 80,
        maxOpacity: 0.8,
        minOpacity: 0,
        tileWidth: 1024,    // 必需参数
        tileHeight: 1024,   // 必需参数
        gradient: {
            // 参考文章中的蓝-青-绿-黄-红渐变配色
            0.0: 'rgba(0, 0, 255, 0.8)',    // 蓝色 - 低强度
            0.25: 'rgba(0, 255, 255, 0.8)', // 青色
            0.5: 'rgba(0, 255, 0, 0.8)',    // 绿色
            0.75: 'rgba(255, 255, 0, 0.8)', // 黄色
            1.0: 'rgba(255, 0, 0, 0.8)'     // 红色 - 高强度
        }
    });

    // 杭州电子科技大学校园热力图数据点
    const heatmapData = [
        // 主要热点区域 - 高强度
        { longitude: 120.350, latitude: 30.312, intensity: 100 }, // 主教学楼区域
        { longitude: 120.348, latitude: 30.315, intensity: 95 },  // 图书馆区域
        { longitude: 120.352, latitude: 30.310, intensity: 90 },  // 食堂区域
        
        // 次要热点区域 - 中高强度
        { longitude: 120.345, latitude: 30.308, intensity: 75 },  // 宿舍区域1
        { longitude: 120.355, latitude: 30.318, intensity: 80 },  // 宿舍区域2
        { longitude: 120.347, latitude: 30.320, intensity: 70 },  // 体育场区域
        
        // 周边区域 - 中等强度
        { longitude: 120.349, latitude: 30.309, intensity: 60 },
        { longitude: 120.351, latitude: 30.314, intensity: 65 },
        { longitude: 120.353, latitude: 30.316, intensity: 55 },
        { longitude: 120.346, latitude: 30.311, intensity: 50 },
        
        // 辅助热点 - 中低强度
        { longitude: 120.344, latitude: 30.305, intensity: 40 },
        { longitude: 120.356, latitude: 30.307, intensity: 45 },
        { longitude: 120.348, latitude: 30.317, intensity: 40 },
        { longitude: 120.354, latitude: 30.319, intensity: 35 },
        
        // 边缘区域 - 低强度
        { longitude: 120.343, latitude: 30.303, intensity: 25 },
        { longitude: 120.357, latitude: 30.305, intensity: 30 },
        { longitude: 120.342, latitude: 30.321, intensity: 20 },
        { longitude: 120.358, latitude: 30.322, intensity: 25 },
        
        // 零散热点
        { longitude: 120.350, latitude: 30.307, intensity: 50 },
        { longitude: 120.352, latitude: 30.313, intensity: 60 },
        { longitude: 120.347, latitude: 30.316, intensity: 45 },
        { longitude: 120.349, latitude: 30.318, intensity: 40 },
    ];

    // 定义热力图覆盖的地理范围
    const bounds = {
        west: 120.340,
        south: 30.300,
        east: 120.360,
        north: 30.325
    };

    // 将地理坐标转换为画布像素坐标
    const convertedData = heatmapData.map(point => {
        const x = Math.round(((point.longitude - bounds.west) / (bounds.east - bounds.west)) * 1024);
        const y = Math.round(((bounds.north - point.latitude) / (bounds.north - bounds.south)) * 1024);
        
        return {
            x: x,
            y: y,
            value: point.intensity
        };
    });

    // 设置热力图数据
    heatmapInstance.setData({
        max: 100,
        min: 0,
        data: convertedData
    });

    // 等待热力图渲染完成后获取画布数据
    setTimeout(() => {
        try {
            // 获取热力图的canvas元素
            const canvas = heatmapInstance._renderer.canvas;
            
            // 创建Cesium图像提供器
            const imageryProvider = new Cesium.SingleTileImageryProvider({
                url: canvas.toDataURL('image/png'),
                tileWidth: 1024,
                tileHeight: 1024,
                rectangle: Cesium.Rectangle.fromDegrees(bounds.west, bounds.south, bounds.east, bounds.north)
            });

            // 添加热力图图层到Cesium
            const heatmapLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
            heatmapLayer.alpha = 0.7; // 设置透明度
            heatmapLayer.name = 'HeatmapLayer'; // 用于后续清除

            // 清理临时容器
            document.body.removeChild(tempContainer);
            
            console.log('Heatmap layer added successfully');
        } catch (error) {
            console.error('Error creating heatmap:', error);
            // 清理临时容器
            if (document.body.contains(tempContainer)) {
                document.body.removeChild(tempContainer);
            }
        }
    }, 200);

    // 添加数据点标记
    // heatmapData.forEach((point, index) => {
    //     viewer.entities.add({
    //         name: `Heatmap Point ${index}`,
    //         position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, 10),
    //         point: {
    //             pixelSize: 6,
    //             color: Cesium.Color.WHITE,
    //             outlineColor: Cesium.Color.BLACK,
    //             outlineWidth: 2,
    //             heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //         },
    //     });
    // });

    // 添加热力图标题
    viewer.entities.add({
        name: 'Heatmap Title',
        position: Cesium.Cartesian3.fromDegrees(120.350, 30.327, 50),
        label: {
            text: '活动热力图',
            font: '18pt Arial',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
            backgroundPadding: new Cesium.Cartesian2(10, 5),
            showBackground: true,
        },
    });

    // 添加图例
    const legendData = [
        { color: 'rgba(255, 0, 0, 0.8)', label: '高强度区域', range: '80-100%' },
        { color: 'rgba(255, 255, 0, 0.8)', label: '中高强度区域', range: '60-80%' },
        { color: 'rgba(0, 255, 0, 0.8)', label: '中等强度区域', range: '40-60%' },
        { color: 'rgba(0, 255, 255, 0.8)', label: '中低强度区域', range: '20-40%' },
        { color: 'rgba(0, 0, 255, 0.8)', label: '低强度区域', range: '0-20%' },
    ];

    legendData.forEach((item, index) => {
        // 图例圆点
        viewer.entities.add({
            name: `Heatmap Legend ${index}`,
            position: Cesium.Cartesian3.fromDegrees(120.362, 30.322 - index * 0.008, 10),
            point: {
                pixelSize: 20,
                color: Cesium.Color.fromCssColorString(item.color),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
            },
        });

        // 图例文字
        viewer.entities.add({
            name: `Heatmap Legend Text ${index}`,
            position: Cesium.Cartesian3.fromDegrees(120.364, 30.322 - index * 0.008, 10),
            label: {
                text: `${item.label} (${item.range})`,
                font: '11pt Arial',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
                backgroundColor: Cesium.Color.BLACK.withAlpha(0.5),
                backgroundPadding: new Cesium.Cartesian2(5, 2),
                showBackground: true,
            },
        });
    });

    // 调整相机视角
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(120.350, 30.305, 1800),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-50),
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view HDU campus heatmap.");
        },
    });
}

function clearHeatmap(viewer) {
    // 清除热力图相关的实体
    const entitiesToRemove = [];
    
    viewer.entities.values.forEach(entity => {
        if (entity.name && (
            entity.name === 'Heatmap Title' ||
            entity.name.includes('Heatmap Legend') ||
            entity.name.includes('Heatmap Point')
        )) {
            entitiesToRemove.push(entity);
        }
    });
    
    entitiesToRemove.forEach(entity => {
        viewer.entities.remove(entity);
    });

    // 清除热力图图层
    for (let i = viewer.imageryLayers.length - 1; i >= 0; i--) {
        const layer = viewer.imageryLayers.get(i);
        if (layer.name === 'HeatmapLayer') {
            viewer.imageryLayers.remove(layer);
            break;
        }
    }

    console.log(`Cleared heatmap layer and ${entitiesToRemove.length} related entities.`);
}
</script>

<template>
    <div id="cesiumContainer">
        <!-- <div class="showboard"
            :style="{ fontSize: emapConfig.htmlStringFontsize || '6px', width: emapConfig.htmlStringWidth || '60px', height: emapConfig.htmlStringHeight || '30px' }">
            {{ emapConfig.htmlString }}</div> -->
    </div>
</template>
<style>
#cesiumContainer {
    width: 100%;
    height: 100%;
    /* border: 1px white solid; */
    position: relative;
}

#cesiumContainer .showboard {
    position: absolute;
    right: 2px;
    top: 2px;
    padding: 2px;
    background-color: rgba(193, 225, 159, 0.48);
    z-index: 999;
}
</style>