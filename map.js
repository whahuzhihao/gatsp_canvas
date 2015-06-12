/**
 *地图信息类
 **/
function Map(city) {
    this.city_num = 0;
    this.city_position = [];
    //初始化函数
    this.init = function (city) {
        if (city == undefined)
            return;
        this.get_city(city);
    };
    //把传入的城市坐标集合放到数组中
    this.get_city = function (city) {
        this.city_num = city.length;
        for (var i = 0; i < this.city_num; i++) {
            this.city_position.push(city[i]);
        }
    };
    //计算给定的路径总长度
    this.get_total_length = function (route) {
        var total_length = 0;
        for (var i = 0; i < route.length - 1; i++) {
            total_length += this.get_distance(this.city_position[route[i]], this.city_position[route[i + 1]]);
        }
        total_length += this.get_distance(this.city_position[route[route.length - 1]], this.city_position[route[0]]);
        return total_length;
    };
    //计算两点间距离
    this.get_distance = function (point1, point2) {
        var xdist = point1.x - point2.x;
        var ydist = point1.y - point2.y;
        return Math.sqrt(xdist * xdist + ydist * ydist);
    };
    this.init(city);
}

//为数组原型添加交换方法
Array.prototype['swap'] = function (index1, index2) {
    if (this[index1] && this[index2]) {
        var tmp = this[index1];
        this[index1] = this[index2];
        this[index2] = tmp;
    }
};
//为数组原型添加深拷贝方法
Array.prototype['clone'] = function () {
    var new_array = [];
    for (var i = 0; i < this.length; i++) {
        new_array[i] = this[i];
    }
    return new_array;
};