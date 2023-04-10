import { Cartesian3, Ellipsoid, Math as CesiumMath, defined, Cartographic, Cesium3DTileFeature } from 'cesium';
/**
 * @function
 * @description: 84坐标转笛卡尔坐标系
 * @param {*} wgs84 wgs84对象
 * @return Object
 */
function WGS84ToCartesian3(wgs84) {
    if (wgs84.longitude && wgs84.latitude) {
        return Cartesian3.fromDegrees(wgs84.longitude, wgs84.latitude, wgs84.height || 0.0, Ellipsoid.WGS84);
    } else {
        return Cartesian3.ZERO;
    }
}

/**
 * @function
 * @description 84坐标转弧度坐标
 * @param {Object} position wgs84
 * @return {Object} Cartographic 弧度坐标
 */
function WGS84ToCartographic(wgs84) {
    return wgs84
        ? Cartographic.fromDegrees(wgs84.longitude || wgs84.latitude, wgs84.height, wgs84.alt)
        : Cartographic.ZERO;
}

/**
 * @function
 * @description 笛卡尔转弧度坐标
 * @param {Object} viewer 传入viewer对象
 * @param {cartesian3} cartesian3  传入笛卡尔坐标
 * @returns {Cartographic}  Cartographic 返回弧度坐标
 */
function cartesian3ToCartographic(viewer, cartesian3) {
    let ellipsoid = viewer.scene.globe.ellipsoid;
    return ellipsoid.cartesianToCartographic(cartesian3);
}
/**
 * @function
 * @description 笛卡尔转经纬度
 * @param cartesian3 笛卡尔坐标
 * @returns {{latitude: *, longitude: *, height: *}}
 */
function cartesian3ToWGS84(cartesian3) {
    let cartographic = Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
    let longitude = CesiumMath.toDegrees(cartographic.longitude);
    let latitude = CesiumMath.toDegrees(cartographic.latitude);
    let height = cartographic.height;
    return {longitude,latitude,height}
}
/**
 * @function
 * @description 笛卡尔数组转经纬度数组
 * @param {Array<Cartesian3>} cartesianArr
 * @returns Array<wgs84>
 */
function cartesianArrayToWGS84Array(viewer, cartesianArr) {
    return cartesianArr
        ? cartesianArr.map((item) => {
            return cartesian3ToWGS84(item);
        })
        : [];
}
/**
 * @function
 * @description 屏幕坐标转笛卡尔坐标 （需要获取到两个坐标比较，倾斜坐标 和 地表坐标）
 * @param {Object} viewer
 * @param {Cartesian2} cartesian2 平面坐标
 * @return {Cartesian3} Cartesian3 笛卡尔坐标
 */
function cartesian2ToCartesian3(viewer, cartesian2) {
    let scene = viewer.scene;
    let pickedObject = scene.pick(cartesian2); //判断是否拾取到模型
    let cartesian3;
    if (scene.pickPositionSupported && defined(pickedObject)) {
        cartesian3 = scene.pickPosition(cartesian2);
    } else {
        let ray = viewer.camera.getPickRay(cartesian2);
        if (!ray) return null;
        cartesian3 = viewer.scene.globe.pick(ray, viewer.scene);
    }
    return cartesian3;
}

/**
 * @function
 * @description 鼠标事件转笛卡尔坐标（左键，右键，鼠标移动）判断是否点击倾斜
 * @param {viewer} viewer 传入viewer对象
 * @param {movement}  movement 传入movement对象
 * @returns {Cartesian3} 返回笛卡尔坐标
 */
function movementToCartesian3(viewer, movement) {
    let cartesian = viewer.scene.pickPosition(movement.position || movement.endPosition);
    let pick = JSON.parse(JSON.stringify(cartesian));
    let pickModel = viewer.scene.pick(movement.position || movement.endPosition);
    if (pickModel && pickModel instanceof Cesium3DTileFeature) {
        let ellipsoid = viewer.scene.globe.ellipsoid;
        let height = Cartographic.fromCartesian(pick).height;
        let lat = CesiumMath.toDegrees(Cartographic.fromCartesian(pick).latitude);
        let lng = CesiumMath.toDegrees(Cartographic.fromCartesian(pick).longitude);
        cartesian = Cartesian3.fromDegrees(lng, lat, height, ellipsoid);
    }
    return cartesian;
}

/**
 * @function
 * @description 鼠标事件转经纬度（左键，右键，鼠标移动）
 * @param {viewer} viewer 传入viewer对象
 * @param {movement}  movement 传入movement对象
 * @returns {Cartesian3} 返回笛卡尔坐标
 */
function movementToWGS84(viewer, movement) {
    let pick = viewer.scene.pickPosition(movement.position || movement.endPosition);
    let height = Cartographic.fromCartesian(pick).height;
    let lng = CesiumMath.toDegrees(Cartographic.fromCartesian(pick).longitude);
    let lat = CesiumMath.toDegrees(Cartographic.fromCartesian(pick).latitude);
    pick = {
        longitude: lng,
        latitude: lat,
        height: height,
    };
    return pick;
}


export  {
    WGS84ToCartesian3,
    WGS84ToCartographic,
    cartesian2ToCartesian3,
    cartesian3ToCartographic,
    cartesian3ToWGS84,
    cartesianArrayToWGS84Array,
    movementToWGS84,
    movementToCartesian3,
};
