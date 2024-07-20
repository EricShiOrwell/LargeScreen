解释返回参数相关
frame 进度条相关的功能，拆分每一帧数据
centerPointer 当前帧地图上的中心点，会自动定位，不确定时笛卡拉尔坐标系还是gps坐标系,大概率是笛卡尔。
bluePointer 当前帧这类点的坐标集
redPointer 当前帧这类点的坐标集
polyline 需要连线的拐点组
imagineData 想定数据集再输出（可再输入）
showImagineData 想定数据集展示,多个页签处
log 日志字符串
table 第一张表格的数据，是个对象，key值是两种算法下拉框的值用"_"连接起来的，如第一个下拉选择选择第一个，值是0，第二个选择第二个值是1，那key就是"0_1"
table下级对象是表格行数据，列数据在配置文件配置，行数据的key和列数据对应如，列数据对象{title: '姓名',dataIndex: 'name',key: 'name'}，dataIndex的值就是行数对应的
值，如{key: '1',name: '胡彦斌',age: 32,address: '西湖区湖底公园1号'}，这个举例取出来的的值就是"胡彦斌"。key是必要的，用以展示在被选择的法则的编号。
children的内容是打分的分数，operate为false是必要的，用以隐藏选择按钮
otherDetailed是第二张表需要的,table1 table2 table3,和上面的表相同，在web配置处配置列信息，在后端计算返回的文件处返回行数据，table2_score为打分数据

timestamp 更新文件的时间戳