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
    debugger;
    // 清除所有实体
    viewer.entities.removeAll();
    if (state.key === '2') {
        drawAircraftRoute(viewer);
    } else if (state.key === '3') {
        drawCubeGrid(viewer);
    } else if (state.key === '4') {
        drawHeatmap(viewer);
    } else if (state.key === '5') {
        drawGrid(viewer)
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
            url: `/emap/{TileMatrix}/img_{TileRow}_{TileCol}.jpg`,
            layer: "tdtImgLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible", // 使用谷歌的瓦片切片方式
            show: true,
            maximumLevel: 8,
        })
    );

    viewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
            url: `/emap/{TileMatrix}/cia_{TileRow}_{TileCol}.jpg`,
            layer: "tdtCiaLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible", // 使用谷歌的瓦片切片方式
            show: true,
            maximumLevel: 8,
        })
    );

    // 将三维球定位到中国
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
        orientation: {
            heading: Cesium.Math.toRadians(348.4202942851978),
            pitch: Cesium.Math.toRadians(-89.74026687972041),
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view.");
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
    const routeData = [
        { longitude: -75.0, latitude: 40.0, height: 500 },
        { longitude: -75.0, latitude: 40.0, height: 10000 },
        { longitude: -74.5, latitude: 40.5, height: 15000 },
        { longitude: -74.0, latitude: 41.0, height: 1000 },
        { longitude: -73.5, latitude: 41.5, height: 25000 },
        { longitude: -73.0, latitude: 42.0, height: 30000 },
        { longitude: -73.0, latitude: 42.0, height: 0 },
    ];

    const positions = routeData.map((point) =>
        Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.height)
    );

    viewer.entities.add({
        name: "Aircraft Route",
        polyline: {
            positions: positions,
            width: 5,
            material: Cesium.Color.RED,
            clampToGround: false,
        },
    });

    viewer.entities.add({
        name: "Aircraft",
        position: positions[0],
        model: {
            uri: "/video/aircraft.glb",
            scale: 1000.0,
        },
        path: {
            resolution: 1,
            material: Cesium.Color.YELLOW,
            width: 3,
        },
    });

    const startTime = Cesium.JulianDate.now();
    const stopTime = Cesium.JulianDate.addSeconds(startTime, 42, new Cesium.JulianDate());

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
            scale: 1000.0,
        },
        path: {
            resolution: 1,
            material: Cesium.Color.YELLOW,
            width: 3,
        },
    });

    viewer.clock.startTime = startTime;
    viewer.clock.stopTime = stopTime;
    viewer.clock.currentTime = startTime;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 2;

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-74, 38, 300000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view height changes.");
        },
    });
}

function drawCubeGrid(viewer) {
    // 示例数据：立方体网格的起始位置和尺寸
    const startLongitude = -75.0; // 起始经度
    const startLatitude = 40.0; // 起始纬度
    const cubeWidthMeters = 50; // 每个立方体的宽度（单位：米）
    const cubeHeightMeters = 50; // 每个立方体的高度（单位：米）
    const cubeDepth = 50; // 每个立方体的深度（高度方向，单位：米）
    const rows = 5; // 网格的行数
    const cols = 5; // 网格的列数
    const layers = 3; // 高度方向上的层数

    // 地球表面每度的距离（单位：米）
    const metersPerDegreeLatitude = 111320; // 纬度方向每度的距离
    const metersPerDegreeLongitude = (longitude) => 111320 * Math.cos(Cesium.Math.toRadians(longitude)); // 经度方向每度的距离

    // 计算纬度和经度的增量
    const latitudeIncrement = cubeHeightMeters / metersPerDegreeLatitude; // 纬度方向增量
    const longitudeIncrement = cubeWidthMeters / metersPerDegreeLongitude(startLatitude); // 经度方向增量

    // 循环生成立方体网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < layers; k++) {
                const longitude = startLongitude + j * longitudeIncrement;
                const latitude = startLatitude + i * latitudeIncrement;
                const height = k * cubeDepth; // 每层的高度

                viewer.entities.add({
                    name: `Cube ${i}-${j}-${k}`,
                    position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + cubeDepth / 2), // 立方体中心点
                    box: {
                        dimensions: new Cesium.Cartesian3(cubeWidthMeters, cubeHeightMeters, cubeDepth), // 立方体尺寸
                        material: Cesium.Color.BLUE.withAlpha(0.5), // 半透明蓝色
                        outline: true, // 是否显示边框
                        outlineColor: Cesium.Color.BLACK, // 边框颜色
                    },
                });
            }
        }
    }

    // 调整相机视角以查看整个网格
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            startLongitude + cols * longitudeIncrement / 2,
            startLatitude + rows * latitudeIncrement / 2,
            layers * cubeDepth * 2 // 设置观察点高度
        ),
        orientation: {
            heading: Cesium.Math.toRadians(0), // 水平方向
            pitch: Cesium.Math.toRadians(-45), // 向下倾斜45度
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view cube grid.");
        },
    });
}

function drawHeatmap(viewer) {
    // 创建一个 HTML Canvas 元素
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;

    // 创建 heatmap.js 实例
    const heatmap = h337.create({
        container: canvas,
        radius: 50,
        maxOpacity: 0.6,
        minOpacity: 0.1,
        gradient: {
            0.4: 'blue',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red',
        },
        tileWidth: 1024, // 必须指定
        tileHeight: 1024, // 必须指定
    });

    // 示例数据：热力图点的经纬度和强度
    const heatmapData = [
        { longitude: -75.0, latitude: 40.0, intensity: 0.8 },
        { longitude: -74.5, latitude: 40.5, intensity: 0.6 },
        { longitude: -74.0, latitude: 41.0, intensity: 0.9 },
        { longitude: -73.5, latitude: 41.5, intensity: 0.4 },
        { longitude: -73.0, latitude: 42.0, intensity: 0.7 },
    ];

    // 转换数据为 heatmap.js 格式
    const points = heatmapData.map((point) => ({
        x: (point.longitude + 180) / 360 * canvas.width, // 转换经度到 Canvas 坐标
        y: (90 - point.latitude) / 180 * canvas.height, // 转换纬度到 Canvas 坐标
        value: point.intensity * 100,
    }));

    heatmap.setData({
        max: 100,
        min: 0,
        data: points,
    });

    // 将 Canvas 转换为 Cesium ImageryLayer
    const imageryProvider = new Cesium.SingleTileImageryProvider({
        url: canvas.toDataURL(),
        rectangle: Cesium.Rectangle.fromDegrees(-76.0, 39.0, -72.0, 43.0),
    });

    viewer.imageryLayers.addImageryProvider(imageryProvider);

    // 调整相机视角以查看热力图
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-74.0, 41.0, 300000),
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-45),
            roll: Cesium.Math.toRadians(0),
        },
    });
}
function drawGrid(viewer) {
    // 示例数据：栅格图的起始位置和尺寸
    const startLongitude = -75.0; // 起始经度
    const startLatitude = 40.0; // 起始纬度
    const squareSize = 0.5; // 每个正方形的边长（单位：度）
    const rows = 10; // 栅格的行数
    const cols = 5; // 栅格的列数

    // 五种颜色
    const colors = [
        Cesium.Color.RED.withAlpha(0.5),
        Cesium.Color.BLUE.withAlpha(0.5),
        Cesium.Color.GREEN.withAlpha(0.5),
        Cesium.Color.YELLOW.withAlpha(0.5),
        Cesium.Color.PURPLE.withAlpha(0.5),
    ];

    // 循环生成栅格图
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const longitude = startLongitude + j * squareSize;
            const latitude = startLatitude + i * squareSize;

            // 随机选择颜色
            const color = colors[Math.floor(Math.random() * colors.length)];

            viewer.entities.add({
                rectangle: {
                    coordinates: Cesium.Rectangle.fromDegrees(
                        longitude, // 左边界
                        latitude, // 下边界
                        longitude + squareSize, // 右边界
                        latitude + squareSize // 上边界
                    ),
                    material: color, // 正方形颜色
                },
            });
        }
    }

    // 调整相机视角以查看栅格图
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
            startLongitude + cols * squareSize / 2,
            startLatitude + rows * squareSize / 2,
            300000 // 设置观察点高度
        ),
        orientation: {
            heading: Cesium.Math.toRadians(0), // 水平方向
            pitch: Cesium.Math.toRadians(-45), // 向下倾斜45度
            roll: Cesium.Math.toRadians(0),
        },
        complete: function callback() {
            console.log("Camera adjusted to view grid.");
        },
    });
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