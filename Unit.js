/**
 *个体类
 **/
function Unit(city_num) {
    this.path = [];
    this.total_length = 0;//总长度
    this.fitness = 0;//适应度
    //初始化函数
    this.init = function (city_num) {
        if (city_num == undefined)
            return;
        this.get_random_path(city_num);
    };
    //得到一条随机周游路径
    this.get_random_path = function (city_num) {
        this.path = [];
        var tmp = [];
        for (var i = 0; i < city_num; i++) {
            tmp.push(i);
        }
        var index;
        for (var i = city_num - 1; i >= 0; i--) {
            index = Math.floor(Math.random() * tmp.length);
            this.path.push(tmp[index]);
            tmp.splice(index, 1);
        }
    };
    this.init(city_num);
}
