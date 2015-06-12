/**
 *算法参数类
 **/
function Defines(define_data) {
    this.REMAIN_RATE = 0;//把父辈精英加入子代的个数
    this.UNIT_NUM = 0//种群中个体的数目
    this.HYBRIDIZATION_RATE = 0;//杂交的概率
    this.VARIATION_RATE = 0;//变异的概率
    this.MAX_SAME_NUM = 0;//连续n代保持子代最优个体的适应度小于等于父代 就停止
    this.CITY_RADIUS = 0;//城市半径
    this.CITY_COLOR = 0;//城市粗度
    this.PATH_WIDTH = 0;//路线粗度
    this.PATH_COLOR = 0;//路线颜色
    this.IF_FILL = 0;//城市是否填充
    this.MAX_GENERATION = 0;//最大代数

    this.init = function (define_data) {
        if (define_data == undefined)
            return;
        this.REMAIN_RATE = define_data.REMAIN_RATE;
        this.UNIT_NUM = define_data.UNIT_NUM;
        this.HYBRIDIZATION_RATE = define_data.HYBRIDIZATION_RATE;//杂交的概率
        this.VARIATION_RATE = define_data.VARIATION_RATE;//变异的概率
        this.MAX_SAME_NUM = define_data.MAX_SAME_NUM;
        this.CITY_RADIUS = define_data.CITY_RADIUS;
        this.CITY_COLOR = define_data.CITY_COLOR;//城市颜色
        this.PATH_WIDTH = define_data.PATH_WIDTH;//路线粗度
        this.PATH_COLOR = define_data.PATH_COLOR;
        this.MAX_GENERATION = define_data.MAX_GENERATION;
        this.IF_FILL = define_data.IF_FILL;
    }
    this.init(define_data);
}

