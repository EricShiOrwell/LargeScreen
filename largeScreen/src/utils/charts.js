let myChart1 = null;
let myChart2= null;
let myChart3 = null;
export function loadEcharts() {
    setTimeout(() => {
        const chartDom = document.getElementById('chart1');
        if (myChart1) {
            myChart1.dispose(); // 销毁之前的实例
            myChart1 = null; // 清空引用
        }
        myChart1 = echarts.init(chartDom);
    
        // 示例数据：时间、频率和强度
        const data = [];
        const xAxisData = [];
        const yAxisData = [];
    
        // 生成模拟数据
        for (let t = 0; t < 100; t++) {
          xAxisData.push(`Time ${t}`);
          for (let f = 0; f < 50; f++) {
            if (t === 0) yAxisData.push(`Freq ${f}`);
            data.push([t, f, Math.random() * 100]); // 随机强度值
          }
        }
    
        const option = {
            grid: {
                left: '2%',  
                right: '2%', 
                top: '2%',   
                bottom: '10%',
            },
          tooltip: {
            position: 'top',
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            name: 'Time',
          },
          yAxis: {
            type: 'category',
            data: yAxisData,
            name: 'Frequency',
          },
          visualMap: {
            min: 0,
            max: 100,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '10%',
          },
          series: [
            {
              type: 'heatmap',
              data: data,
              label: {
                show: false,
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#333',
                  borderWidth: 1,
                },
              },
            },
          ],
        };
    
        myChart1.setOption(option);
    },500)
}

export function loadWaveformChart() {
    setTimeout(() => {
        const chartDom = document.getElementById('chart2');
        // let myChart2 = echarts.init(chartDom);

        if (myChart2) {
            myChart2.dispose(); // 销毁之前的实例
            myChart2 = null; // 清空引用
        }
        myChart2 = echarts.init(chartDom);

        // 示例数据：频谱波形
        const xAxisData = [];
        const seriesData = [];

        // 生成模拟数据
        for (let i = 0; i < 100; i++) {
            xAxisData.push(i);
            seriesData.push(Math.sin(i / 10) * Math.random() * 10); // 随机波形数据
        }

        const option = {
            grid: {
                left: '2%',  
                right: '2%', 
                top: '2%',   
                bottom: '2%',
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                name: 'Time',
            },
            yAxis: {
                type: 'value',
                name: 'Amplitude',
            },
            series: [
                {
                    type: 'line',
                    data: seriesData,
                    smooth: true, // 平滑曲线
                    lineStyle: {
                        color: '#00f',
                    },
                },
            ],
        };

        myChart2.setOption(option);
    }, 500);
}

export function loadRadarChart() {
    setTimeout(() => {
        const chartDom = document.getElementById('chart3');
        if (myChart3) {
            myChart3.dispose(); // 销毁之前的实例
            myChart3 = null; // 清空引用
        }
        myChart3 = echarts.init(chartDom);
        // 示例数据：测向雷达图
        const indicatorData = [
            { name: 'North', max: 100 },
            { name: 'East', max: 100 },
            { name: 'South', max: 100 },
            { name: 'West', max: 100 },
            { name: 'Northeast', max: 100 },
            { name: 'Southwest', max: 100 },
        ];

        const radarData = [80, 90, 70, 85, 60, 75]; // 模拟测向数据

        const option = {
            grid: {
                left: '2%',  
                right: '2%', 
                top: '2%',   
                bottom: '2%',
            },
            tooltip: {
                trigger: 'item',
            },
            radar: {
                indicator: indicatorData,
                shape: 'circle',
                name: {
                    textStyle: {
                        color: '#fff',
                    },
                },
            },
            series: [
                {
                    type: 'radar',
                    data: [
                        {
                            value: radarData,
                            name: 'Direction',
                            areaStyle: {
                                color: 'rgba(0, 255, 0, 0.3)', // 填充颜色
                            },
                            lineStyle: {
                                color: '#0f0',
                            },
                        },
                    ],
                },
            ],
        };

        myChart3.setOption(option);
    }, 500);
}