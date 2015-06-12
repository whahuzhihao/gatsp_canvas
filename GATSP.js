/**
 *遗传算法类
 **/
function GATSP(param) {
    this.map = null;//地图对象
    this.defines = null;//算法参数对象
    this.city_num = 0;//染色体长度
    this.group = [];//种群
    this.generation = 0;//当前是第几代
    this.min_dist = 0;//之前最短长度
    this.max_dist = 0;//之前最长长度
    this.ex_fitness = 0;
    this.continuous_num = 0;
    this.total_fitness = 0;//种群的适应度
    this.remain_num = 0;
    this.context = null; //画布
    this.textconsole = null;

    this.started = false;//是否开始了
    //初始化函数
    this.init = function (param) {
        if (param == undefined)
            return;
        this.map = new Map(param.city);
        this.defines = new Defines(param.define_data);
        this.city_num = param.city.length;
        this.remain_num = parseInt(param.define_data.REMAIN_RATE * param.define_data.UNIT_NUM);
        this.context = $("#canvas")[0].getContext('2d');
        this.textconsole = $("#textconsole");
        this.create_group();//创建种群
    };
    //创建新的种群
    this.create_group = function () {
        this.group = [];
        for (var i = 0; i < this.defines.UNIT_NUM; i++) {
            this.group.push(new Unit(this.city_num));
        }
        this.generation = 0;
        this.ex_fitness = 0;
        this.continuous_num = 0;
        this.reset();
        this.started = false;
    };
    //为产生下一代清空数据
    this.reset = function () {
        this.min_dist = 999999999;
        this.max_dist = 0;
        this.total_fitness = 0;
    };
    //计算每个个体的适应度
    this.calculate_fitness = function () {
        for (var i = 0; i < this.defines.UNIT_NUM; i++) {
            var unit_length = this.map.get_total_length(this.group[i].path);
            this.group[i].total_length = unit_length;

            if (unit_length < this.min_dist) {//如果这个个体的花费低于已有的最小花费
                this.min_dist = unit_length;
            }
            if (unit_length > this.max_dist) {//如果这个个体的花费高于已有的最高花费
                this.max_dist = unit_length;
            }
        }
        for (var i = 0; i < this.defines.UNIT_NUM; i++) {
            this.group[i].fitness = this.max_dist - this.group[i].total_length;//当前个体的适应度等于最大距离-个体的距离
            this.total_fitness += this.group[i].fitness;
        }
        if (this.max_dist - this.min_dist <= this.ex_fitness) {//当前的最优个体的适应度小于等于父辈最优个体的适应度
            this.continuous_num++;
        } else {
            this.continuous_num = 0;
        }
        this.ex_fitness = this.max_dist - this.min_dist;
    };

    //定义个体比较方法
    this.cmp = function (unit1, unit2) {
        if (unit1.fitness < unit2.fitness)
            return 1;
        else
            return -1;
    };
    //繁衍下一代个体 非常重要 在这个函数里面
    this.get_next_generation = function () {
        this.reset();//清空记录数据
        this.calculate_fitness();//计算种群和个体的适应度
        this.group = this.group.sort(this.cmp);//按适应度降序排序
        if (this.continuous_num >= this.defines.MAX_SAME_NUM || (this.generation >= this.defines.MAX_GENERATION && this.defines.MAX_GENERATION != 0)) {//达到了停止繁衍的要求 返回
            this.started = false;
            return;
        } else {

        }
        var next_group = [];
        for (var i = 0; i < this.remain_num; i++) {
            next_group.push(this.group[i]);
        }
        //现在再创建种群其余的成员
        while (next_group.length < this.defines.UNIT_NUM) {
            //选取两个基因组作为父代
            var parent1 = this.group[this.wheel_select()];
            var parent2 = this.group[this.wheel_select()];
            var parent3 = this.group[this.wheel_select()];

            //创建两个子代
            var baby = new Unit();
            //进行杂交
            this.hybridization(parent1, parent2, parent3, baby);
            //再做变异
            this.variation(baby);
            //加入到新的种群中
            next_group.push(baby);
        }
        this.group = next_group;//子代成为当代
        this.generation++;//代数+1
    };

    //轮盘赌算法选择个体
    this.wheel_select = function () {
        var slice = Math.random() * this.total_fitness;
        var total = 0.0;
        var result = 0;
        for (var i = 0; i < this.defines.UNIT_NUM; i++) {
            total += this.group[i].fitness;
            if (total > slice) {
                result = i;
                break;
            }
        }
        return result;
    };
    //采用三交换启发交叉杂交
    this.hybridization = function (p1, p2, p3, c) {
        //随即继承一个父亲
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                c.path = p1.path.clone();
                break;
            case 1:
                c.path = p2.path.clone();
                break;
            case 2:
                c.path = p3.path.clone();
                break;
        }
        //根据杂交率决定是否杂交
        if ((Math.random() > this.defines.HYBRIDIZATION_RATE)) {
            return;
        }
        //清空子代基因
        c.path = [];
        var index = Math.floor(Math.random() * (this.city_num));//在[0,length-1]中选择一个位置
        //把三个父亲的第一个点调整成为p1.path[index]
        var s = p1.path[index];
        var pt1 = p1.path.slice(index, this.city_num + 1).concat(p1.path.slice(0, index));
        index = p2.path.indexOf(s);
        var pt2 = p2.path.slice(index, this.city_num + 1).concat(p2.path.slice(0, index));
        index = p3.path.indexOf(s);
        var pt3 = p3.path.slice(index, this.city_num + 1).concat(p3.path.slice(0, index));
        c.path.push(s);
        for (index = 1; index < this.city_num; index++) {//每次取index-1到index距离最小的点，放进去子代，再调整到相应位置
            var l1 = this.map.get_distance(this.map.city_position[s], this.map.city_position[pt1[index]]);
            var l2 = this.map.get_distance(this.map.city_position[s], this.map.city_position[pt2[index]]);
            var l3 = this.map.get_distance(this.map.city_position[s], this.map.city_position[pt3[index]]);
            if (l1 <= l2 && l1 <= l3) {//p1
                c.path.push(pt1[index]);
                s = pt1[index];
            } else if (l2 <= l1 && l2 <= l3) {//p2
                c.path.push(pt2[index]);
                s = pt2[index];
            } else if (l3 <= l1 && l3 <= l2) {//p3
                c.path.push(pt3[index]);
                s = pt3[index];
            }
            var tmp = pt1.indexOf(s);
            pt1 = pt1.slice(0, index).concat(pt1.slice(tmp, this.city_num)).concat(pt1.slice(index, tmp));
            tmp = pt2.indexOf(s);
            pt2 = pt2.slice(0, index).concat(pt2.slice(tmp, this.city_num)).concat(pt2.slice(index, tmp));
            tmp = pt3.indexOf(s);
            pt3 = pt3.slice(0, index).concat(pt3.slice(tmp, this.city_num)).concat(pt3.slice(index, tmp));
        }

    };
    //变异
    this.variation = function (unit) {
        //根据突变率决定是否要变异
        if (Math.random() > this.defines.VARIATION_RATE) {
            return;
        }
        var position1 = Math.floor(Math.random() * (unit.path.length));//在[0,length-1]中选择一个位置
        var position2;
        do {
            position2 = Math.floor(Math.random() * (unit.path.length));//在[0,length-1]中选择一个位置
        } while (position2 == position1);
        //交换他们的位置
        unit.path.swap(position1, position2);
    };
    this.run = function () {
        //this.create_group();
        this.started = true;
    };
    this.stop = function () {
        this.started = false;
    };
    this.render = function (traceRoute) {
        this.context.clearRect(0, 0, 500, 500);
        if (traceRoute) {//是否画出路径
            var points = [];
            for (var city_num = 0; city_num < this.map.city_position.length; city_num++) {
                var cityX = this.map.city_position[city_num].x;
                var cityY = this.map.city_position[city_num].y;
                points.push({x: cityX, y: cityY, no: city_num});
            }
            this.draw_points(points, this.defines.CITY_RADIUS, this.defines.CITY_COLOR, this.defines.IF_FILL);
            var route = this.group[0].path//排序以后0号位是最优的
            //console.log(route);
            if (this.generation !== 0) {
                points = [];
                for (var i = 0; i < route.length; i++) {
                    var cityX = this.map.city_position[route[i]].x;
                    var cityY = this.map.city_position[route[i]].y;
                    points.push({x: cityX, y: cityY});
                }
                //画线
                this.draw_lines(points, this.defines.PATH_WIDTH, this.defines.PATH_COLOR);
            }
        }
        ;
        //输出状态
        this.context.fillStyle = "black";
        var gen = "代数:" + this.generation;
        if (!this.started)
            gen += " 结束";
        this.context.fillText(gen, 10, 20);

        gen = "";
        var len = this.group[0].path.length;
        for (var i = 0; i < len; i++) {
            gen += this.group[0].path[i];
            if (i < len - 1)
                gen += "->";
        }
        this.textconsole.val(gen);
        /*
         if(!this.started){
         var start = "结束";
         graphics.drawText(start, new jsPoint(50, 470));
         }else{
         graphics.drawText("按钮停止", new jsPoint(50, 470));
         }*/
    };
    //画城市，标编号
    this.draw_points = function (points, radius, color, iffill) {
        this.context.lineWidth = 1;
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
        for (var i = 0; i < points.length; i++) {
            this.context.beginPath();
            this.context.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2, true);
            this.context.closePath();
            if (iffill)
                this.context.fill();
            else
                this.context.stroke();
            this.context.fillText(i, points[i].x - radius, points[i].y - radius);
        }

    }
    this.draw_lines = function (points, width, color) {
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.beginPath();
        this.context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            this.context.lineTo(points[i].x, points[i].y);
        }
        this.context.closePath();
        this.context.stroke();
    }
    this.init(param);
}