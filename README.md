## cesium 中坐标转换
## wgs84 ：经纬度坐标  
## cartesian3 ：笛卡尔坐标
```js
    //84坐标转笛卡尔坐标系
    WGS84ToCartesian3(wgs84),
    //84坐标转弧度坐标
    WGS84ToCartographic(wgs84),
    //笛卡尔转弧度坐标
    cartesian2ToCartesian3(viewer,cartesian3),
    // 笛卡尔转弧度坐标
    cartesian3ToCartographic(viewer,cartesian3),
    //笛卡尔转经纬度
    cartesian3ToWGS84(cartesian3), 
    //笛卡尔数组转经纬度数组
    cartesianArrayToWGS84Array(viewer,cartesian3Array),
    //鼠标事件转经纬度（左键，右键，鼠标移动）
    movementToWGS84(viewer, movement),
    //鼠标事件转笛卡尔坐标（左键，右键，鼠标移动）判断是否点击倾斜
    movementToCartesian3(viewer, movement)
```