<script setup>
import { Cartesian3, createOsmBuildingsAsync, Ion, Math, TimeInterval, Viewer, WebMapTileServiceImageryProvider, Color, ClockRange,JulianDate, SampledPositionProperty,TimeIntervalCollection } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { onMounted, ref } from 'vue';
// const props = defineProps(['configItem'])
import { useEmapEvent } from '@/stores/counter'

// const Calculate = useCalculateStore()
const emapEvent = useEmapEvent()
// const emapConfig = window.configItem.module_emap
// const htmlString = window.configItem.module_emap.htmlString
// const htmlStringFontsize = window.configItem.module_emap.htmlStringFontsize
let viewer = null
emapEvent.$subscribe((mutation, state) => {
        if (state.key === '2') {
            drawAircraftRoute(viewer)
        }
})
// Calculate.$subscribe((mutation, state) => {
//     debugger
//     const temp = state.calculate[state.frame]
//     if (!temp) {
//         viewer.entities.removeAll()
//         return
//     }
//     let centerPointer = temp.centerPointer
//     let bluePointer = temp.bluePointer || []
//     let redPointer = temp.redPointer || []
//     let polyline = temp.polyline
//     // // 新数据
//     // if (mutation.type !== "patch object") {

//     // }
//     // addPoint({ longitude: 116, latitude: 40, })
//     viewer.entities.removeAll()
//     bluePointer.forEach(element => {
//         addPoint({ longitude: element[0], latitude: element[1], image: emapConfig.bluePointImage })
//     });
//     redPointer.forEach(element => {
//         addPoint({ longitude: element[0], latitude: element[1], image: emapConfig.redPointImage })
//     });
//     polyline.forEach(element => {
//         let positions = element.map(item => {
//             return Cartesian3.fromDegrees(item[0], item[1])
//         })
//         viewer.entities.add({
//             polyline: {
//                 positions: positions,          // 线的位置数组
//                 width: 2,                      // 线宽
//                 material: Color.fromCssColorString(emapConfig.polylineColor) || Color.YELLOW     // 线的颜色
//             }
//         })
//     });
//     viewer.camera.flyTo({
//         destination: Cartesian3.fromDegrees(...centerPointer),
//         orientation: {
//             heading: Math.toRadians(348.4202942851978),
//             pitch: Math.toRadians(-89.74026687972041),
//             roll: Math.toRadians(0)
//         },
//         complete: function callback() {
//             // 定位完成之后的回调函数
//         }
//     });

// })
onMounted(() => {
    // 初始化Cesium Viewer
    // const tiandituTk = 'dbb4e81614654371b050f5dc16124bfb'
    Ion.defaultAccessToken = '';
    viewer = new Viewer("cesiumContainer", {
        // imageryProvider: new WebMapTileServiceImageryProvider({
        //     url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + tiandituTk,
        //     // layer: "tdtBasicLayer",
        //     layer: "tdtImgLayer",
        //     style: "default",
        //     format: "image/jpeg",
        //     tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
        //     // show: false,
        //     show: true
        // }),
        shouldAnimate: true,
        selectionIndicator: true,
        animation: false,       //动画
        homeButton: false,       //home键
        geocoder: false,         //地址编码
        baseLayerPicker: false, //图层选择控件
        timeline: false,        //时间轴
        fullscreenButton: false, //全屏显示
        infoBox: false,         //点击要素之后浮窗
        sceneModePicker: false,  //投影方式  三维/二维
        navigationInstructionsInitiallyVisible: false, //导航指令
        navigationHelpButton: false,     //帮助信息
        selectionIndicator: false, // 选择
    });
    viewer.cesiumWidget.creditContainer.style.display = 'none';
    viewer.imageryLayers.addImageryProvider(new WebMapTileServiceImageryProvider({
        // url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + tiandituTk,
        url: `/emap/{TileMatrix}/img_{TileRow}_{TileCol}.jpg`,
        // layer: "tdtBasicLayer",
        layer: "tdtImgLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
        // show: false,
        show: true,
        maximumLevel: 8
    }));

    viewer.imageryLayers.addImageryProvider(new WebMapTileServiceImageryProvider({
        // url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + tiandituTk,
        url: `/emap/{TileMatrix}/cia_{TileRow}_{TileCol}.jpg`,
        // layer: "tdtAnnoLayer",
        layer: "tdtCiaLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",//使用谷歌的瓦片切片方式
        // show: false,
        show: true,
        maximumLevel: 8
    }));
    // 将三维球定位到中国
    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(103.84, 31.15, 17850000),
        orientation: {
            heading: Math.toRadians(348.4202942851978),
            pitch: Math.toRadians(-89.74026687972041),
            roll: Math.toRadians(0)
        },
        complete: function callback() {
            // 定位完成之后的回调函数
        }
    });
    // Cartesian3.fromDegrees(longitude, latitude, height, ellipsoid, result)
    // viewer.camera.flyTo({
    //     destination: Cartesian3.fromDegrees(0, 50, 8850000),
    //     orientation: {
    //         heading: Math.toRadians(348.4202942851978),
    //         pitch: Math.toRadians(-89.74026687972041),
    //         roll: Math.toRadians(0)
    //     },
    //     complete: function callback() {
    //         // 定位完成之后的回调函数
    //     }
    // });

})

function addPoint(option) {
    let point = viewer.entities.add({
        // name: option.name,
        position: Cartesian3.fromDegrees(
            option.longitude,
            option.latitude
        ),
        billboard: {
            image: option.image || 'redpoint.jpg', // 图片路径
            scale: 1.0,
            width: 30,//设置图片大小
            height: 30,//设置图片大小

            // 其他可选的Billboard属性
        }
        // point: {
        //     // 点的大小（像素）
        //     pixelSize: 10,
        //     // 点位颜色，fromCssColorString 可以直接使用CSS颜色
        //     // color: Cesium.Color.fromCssColorString("red"),
        //     color: option.color || Color.BLUE,
        //     // 边框颜色
        //     outlineColor: Color.fromCssColorString("yellow"),
        //     // 边框宽度(像素)
        //     outlineWidth: 2,
        //     // 是否显示
        //     show: true,
        // },
        // 文字
        // label: {
        //     // 文本。支持显式换行符“ \ n”
        //     text: option.name,
        //     // 字体样式，以CSS语法指定字体
        //     font: "14pt Source Han Sans CN",
        //     // 字体颜色
        //     fillColor: Color.AQUA,
        //     // 背景颜色
        //     backgroundColor: Color.AQUA,
        //     // 是否显示背景颜色
        //     showBackground: false,
        //     // 字体边框
        //     // outline: true,
        //     // 字体边框颜色
        //     outlineColor: Color.BLACK,
        //     // 字体边框尺寸
        //     outlineWidth: 10,
        //     // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
        //     scale: 1,
        //     // 设置样式：FILL：填写标签的文本，但不要勾勒轮廓；OUTLINE：概述标签的文本，但不要填写；FILL_AND_OUTLINE：填写并概述标签文本。
        //     // style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //     // 相对于坐标的垂直位置
        //     // verticalOrigin: Cesium.VerticalOrigin.TOP,
        //     // 相对于坐标的水平位置
        //     // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        //     // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
        //     // pixelOffset: new Cesium.Cartesian2(-25, -20),
        //     // 是否显示
        //     show: true,
        // }
    });
    return point;
}
function drawAircraftRoute(viewer) {
    // 示例航线数据：经纬度、高度
    const routeData = [
        { longitude: -75.0, latitude: 40.0, height: 500 },
        { longitude: -75.0, latitude: 40.0, height: 10000 },
        { longitude: -74.5, latitude: 40.5, height: 15000 },
        { longitude: -74.0, latitude: 41.0, height: 1000 },
        { longitude: -73.5, latitude: 41.5, height: 25000 },
        { longitude: -73.0, latitude: 42.0, height: 30000 },
        { longitude: -73.0, latitude: 42.0, height: 0 },
    ];

    // 创建航线的坐标数组
    const positions = routeData.map((point) =>
        Cartesian3.fromDegrees(point.longitude, point.latitude, point.height)
    );

    // 添加航线到 Cesium Viewer
    viewer.entities.add({
        name: "Aircraft Route",
        polyline: {
            positions: positions,
            width: 5,
            material: Color.RED,
            clampToGround: false, // 是否贴地
        },
    });

    // 添加飞行器模型
    viewer.entities.add({
        name: "Aircraft",
        position: positions[0], // 初始位置
        model: {
            uri: "/video/aircraft.glb", // 飞行器模型路径
            scale: 1000.0,
        },
        path: {
            resolution: 1, // 路径分辨率
            material: Color.YELLOW,
            width: 3,
        },
    });

    // 模拟飞行器沿航线移动
    const startTime = JulianDate.now();
    const stopTime = JulianDate.addSeconds(startTime, 42, new JulianDate());

    const property = new SampledPositionProperty();
    routeData.forEach((point, index) => {
        const time = JulianDate.addSeconds(startTime, index * 6, new JulianDate());
        const position = Cartesian3.fromDegrees(point.longitude, point.latitude, point.height);
        property.addSample(time, position);
    });

    viewer.entities.add({
        name: "Moving Aircraft",
        availability: new TimeIntervalCollection([
            new TimeInterval({ start: startTime, stop: stopTime }),
        ]),
        position: property,
        model: {
            uri: "/video/aircraft.glb",
            scale: 1000.0,
        },
        path: {
            resolution: 1,
            material: Color.YELLOW,
            width: 3,
        },
    });

    // 设置时间范围
    viewer.clock.startTime = startTime;
    viewer.clock.stopTime = stopTime;
    viewer.clock.currentTime = startTime;
    viewer.clock.clockRange = ClockRange.LOOP_STOP; // 循环播放
    viewer.clock.multiplier = 2; // 时间加速
    viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(-74, 38, 300000), // 设置一个更高的观察点
    orientation: {
        heading: Math.toRadians(0), // 水平方向
        pitch: Math.toRadians(-45), // 向下倾斜45度
        roll: Math.toRadians(0),
    },
    complete: function callback() {
        console.log("Camera adjusted to view height changes.");
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