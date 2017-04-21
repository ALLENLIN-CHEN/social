/**
 * Created by scut on 2017/4/16.
 */
var barLineChart,mapChart,pieOutChart,pieInChart,barOutChart,barInChart;

var counter = 0;
var timeId;
$(function() {
    barLineChart = echarts.init(document.getElementById('barLine'));
   mapChart = echarts.init(document.getElementById('map-content'));
   pieOutChart = echarts.init(document.getElementById('pie_out'));
   pieInChart = echarts.init(document.getElementById('pie_in'));
   barOutChart = echarts.init(document.getElementById('bar_out'));
   barInChart = echarts.init(document.getElementById('bar_in'));
    
    initData();
    mapChart.on('click',function(e){
        console.log(e);
        if(e.componentType!="series") return;
        if(e.componentSubType!="effectScatter"&&e.componentSubType!="scatter") return;
        //判断是不是设置的点击事件


        showMap(e.name);
        showPie(e.name,'out');
        showPie(e.name,'in');
        showC('out');
        showC('in');
        counter = 0;
        clearInterval(timeId);
        showConclusion(e.name);
        timeId = setInterval(function () {
            showConclusion(e.name)
        },3000);
        barLineChart.setOption(getCityBarLine(e.name));
    })
});

function initData(){
    $.ajax({
        type: 'GET',
        url: 'staff/staffBigScreen',
        dataType: 'json',

        success: function(res) {
            $('.loading').hide();
            makeData(res);
            barLineChart.setOption(getCityBarLine("广州"));
            showMap("广州");
            showPie("广州",'out');
            showPie("广州",'in');
            showC('out');
            showC('in');
            counter = 0;
            showConclusion("广州");
            timeId = setInterval(function () {
                    showConclusion("广州")
            },3000);
        },
        error: function(err) {
            alert('获取数据出错，错误为：' + err);
            hideLoading();
        }
    });
}

function convertCityName(cityName) {
    var cityName2 = cityName;
    if (cityName2.indexOf("-") != -1) {
        var c = cityName2.split("-");
        cityName2 = c[1];
    }
    if (cityName2.indexOf("市") != -1) {
        var c = cityName2.split("市");
        cityName2 = c[0];
    }
    return cityName2;
} //转换城市格式


var citys = {};
citys['out'] = [];
citys['in'] = [];
var ccData = {};
var pieData = {};
var cityNameSet;

function makeData(res){
    //---------开始接入bar的数据-------------
    var barOut = res.barOut;
    var barIn = res.barIn;

    for(var i = 0; i < barOut.length; i++){
        var ret = {};
        ret.name = convertCityName(barOut[i].name);
        ret.value = barOut[i].num;
        ret.year = barOut[i].year;
        citys['out'].push(ret);
    }

    for(var i = 0; i < barIn.length; i++){
        var ret = {};
        ret.name = convertCityName(barIn[i].name);
        ret.value = barIn[i].num;
        ret.year = barIn[i].year;
        citys['in'].push(ret);
    }

    //-------结束接入bar的数据-------------

    cityNameSet = res.cityNameSet; //接入名字的集合
    for(var i = 0; i < cityNameSet.length; i++){
        cityNameSet[i] = convertCityName(cityNameSet[i]);
    }

    //--------开始接入map数据-----------
    var mapOut = res.mapOut;
    var mapIn = res.mapIn;

    for(var i = 0; i < mapOut.length;i++) {mapOut[i].name = convertCityName(mapOut[i].name); mapOut[i].name2 = convertCityName(mapOut[i].name2);}
    for(var i = 0; i < mapIn.length; i++) {mapIn[i].name = convertCityName(mapIn[i].name); mapIn[i].name2 = convertCityName(mapIn[i].name2);}

    for(var i = 0; i < mapOut.length; i++){
        if(!ccData[mapOut[i].name]){
            ccData[mapOut[i].name] = {};
            ccData[mapOut[i].name]['out'] = [];
            ccData[mapOut[i].name]['in'] = [];
        }
        ccData[mapOut[i].name]['out'].push({name: mapOut[i].name2, value: mapOut[i].num });
    }

    for(var i = 0; i < mapIn.length; i++){
        if(!ccData[mapIn[i].name2]){
            ccData[mapIn[i].name2] = {};
            ccData[mapIn[i].name2]['out'] = [];
            ccData[mapIn[i].name2]['in'] = [];
        }
        ccData[mapIn[i].name2]['in'].push({name: mapIn[i].name, value: mapIn[i].num});
    }

    //--------------结束接入map数据-----------------

    //------------开始接入pie数据---------------------
    var pieOut = res.pieOut;
    var pieIn = res.pieIn;

    for(var i = 0; i < pieOut.length; i++){pieOut[i].name = convertCityName(pieOut[i].name); pieOut[i].name2 = convertCityName(pieOut[i].name2);}
    for(var i = 0; i < pieIn.length; i++){pieIn[i].name = convertCityName(pieIn[i].name); pieIn[i].name2 = convertCityName(pieIn[i].name2);}

    for(var i = 0; i < pieOut.length; i++){
        var name = pieOut[i].name, year = pieOut[i].year;
        if(!pieData[name]){
            pieData[name] = {};
            pieData[name]['out'] = {};
            pieData[name]['in'] = {};
        }
        if(!pieData[name]['out'][year]){
            pieData[name]['out'][year] = [];
        }
        pieData[name]['out'][year].push({name: pieOut[i].name2, value: pieOut[i].num});
    }

    for(var i = 0; i < pieIn.length; i++){
        var name = pieIn[i].name2, year = pieIn[i].year;
        if(!pieData[name]){
            pieData[name] = {};
            pieData[name]['out'] = {};
            pieData[name]['in'] = {};
        }
        if(!pieData[name]['in'][year]){
            pieData[name]['in'][year] = [];
        }
        pieData[name]['in'][year].push({name: pieIn[i].name, value: pieIn[i].num});
    }
    //---------------结束接入pie数据--------------------


}

function getCityBarLine(cityName){

    var minYear = 10000, maxYear = 1;
    for(var i = 0; i < citys['out'].length;i++){
        if(cityName == citys['out'][i].name){
            if(minYear > citys['out'][i].year){
                minYear = citys['out'][i].year;
            }
            if(maxYear < citys['out'][i].year){
                maxYear = citys['out'][i].year;
            }
        }
    }

    for(var i = 0; i < citys['in'].length;i++){
        if(cityName == citys['in'][i].name){
            if(minYear > citys['in'][i].year){
                minYear = citys['in'][i].year;
            }
            if(maxYear < citys['in'][i].year){
                maxYear = citys['in'][i].year;
            }
        }
    }
    var x_data = new Array();
    var y_out_data = new Array();
    var y_in_data = new Array();
    var y_sum_data = new Array();
    for(var i = minYear; i <= maxYear; i++){
        x_data[i-minYear] = i;
    }

    for(var i = 0; i < citys['out'].length;i++){
        if(cityName == citys['out'][i].name){
            y_out_data[citys['out'][i].year-minYear] = citys['out'][i].value;
        }
    }

    for(var i = 0; i < citys['in'].length;i++){
        if(cityName == citys['in'][i].name){
            y_in_data[citys['in'][i].year-minYear] = citys['in'][i].value;
        }
    }

    for(var i = minYear; i <= maxYear;i++){
        y_sum_data[i-minYear] = y_in_data[i-minYear] + y_out_data[i-minYear];
    }





    var option = {
        title: {
            text: cityName + "近年来的人口流动情况",
            x:"left",
            textStyle:{
                color: '#fff',
                fontSize: '18'
            }
        },
        tooltip: {
            "trigger": "axis",
            "axisPointer": {
                "type": "shadow",
                textStyle: {
                    color: "#fff"
                }

            },
        },
        grid: {
            "borderWidth": 0,
            "top": 40,
            "bottom": 45,
            textStyle: {
                color: "#fff"
            }
        },
        legend: {
            x: '85%',
            top: '0%',
            textStyle: {
                color: '#fff',
            },
            "data": ['流入', '流出','总数']
        },


        calculable: true,
        xAxis: [{
            "type": "category",
            "axisLine": {
                lineStyle: {
                    color: '#90979c'
                }
            },
            "splitLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitArea": {
                "show": false
            },
            "axisLabel": {
                "interval": 0,
            },
            "data": x_data,
        }],
        yAxis: [{
            "type": "value",
            "splitLine": {
                "show": false
            },
            "axisLine": {
                lineStyle: {
                    color: '#90979c'
                },
                show: false
            },
            "axisTick": {
                "show": false
            },
            "axisLabel": {
                "interval": 0,
                show:false
            },
            "splitArea": {
                "show": false
            },

        }],
        dataZoom: [{
            "show": true,
            "height": 10,
            "xAxisIndex": [
                0
            ],
            bottom: 0,
            "start": 0,
            "end": 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle:{
                color:"#d3dee5",

            },
            textStyle:{
                color:"#fff"},
            borderColor:"#90979c"


        }, {
            "type": "inside",
            "show": true,
            "height": 15,
            "start": 1,
            "end": 35
        }],
        series: [{
            "name": "流入",
            "type": "bar",
            "stack": "总量",
            "barMaxWidth": 35,
            "barGap": "10%",
            "itemStyle": {
                "normal": {
                    "color": "rgba(255,144,128,1)",
                    "label": {
                        "show": true,
                        "textStyle": {
                            "color": "#fff"
                        },
                        "position": "insideTop",
                        formatter: function(p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            "data": y_in_data
        },

            {
                "name": "流出",
                "type": "bar",
                "stack": "总量",
                "itemStyle": {
                    "normal": {
                        "color": "rgba(0,191,183,1)",
                        "barBorderRadius": 0,
                        "label": {
                            "show": true,
                            "position": "top",
                            formatter: function(p) {
                                return p.value > 0 ? (p.value) : '';
                            }
                        }
                    }
                },
                "data": y_out_data
            }, {
                "name": "总数",
                "type": "line",
                "stack": "总量",
                symbolSize:10,
                symbol:'circle',
                "itemStyle": {
                    "normal": {
                        "color": "rgba(252,230,48,1)",
                        "barBorderRadius": 0,
                        "label": {
                            "show": true,
                            "position": "top",
                            formatter: function(p) {
                                return p.value > 0 ? (p.value) : '';
                            }
                        }
                    }
                },
                "data": y_sum_data
            },
        ]
    }

    return option;
}

function showMap(cityName){
    console.log(ccData);
    var inData = ccData[cityName]['in'];
    var outData = ccData[cityName]['out'];

    function geoCoordMap(cityName){
        if(!geoCP[cityName]) return geoCP[cityName+"市"];
        return geoCP[cityName];
    };

    var convertData = function (cityName, s) {
        var res = [];
        var data = ccData[cityName][s]; //data是上面数组之一，比如BJData
        var fromCity,toCity;
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];       //dataItem格式：{name:'福州',value:95}
            if(s =='out'){
                fromCity = cityName; toCity = dataItem.name;
            }else{
                fromCity = dataItem.name; toCity = cityName;
            }
            var fromCoord = geoCoordMap(fromCity);
            var toCoord = geoCoordMap(toCity);
            //fromCoord和toCoord分别是起点,终点的经纬度
            if (fromCoord && toCoord) {
                res.push({
                    fromName: fromCity,
                    toName: toCity,
                    coords: [fromCoord,toCoord],
                    value: dataItem.value
                });
            }
        }
        return res;
    };

    function convertData2(cityNameSet){
        var ret = [];
        for(var i = 0; i < cityNameSet.length; i++){
            var c = {name: cityNameSet[i], value: geoCoordMap(cityNameSet[i])};
            ret.push(c);
        }
        return ret;
    }

    var series = []; //一开始，series为空     
    series.push(
        {
            name: "outLine",
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 1.5,
                trailLength: 0.7,
                color: 'white',
                symbolSize: 2
            },
            lineStyle: {
                normal: {
                    color: "",
                    width: 0,
                    curveness: 0.2
                }
            },
            tooltip: {
                formatter: function(params){
                    return params.data.fromName + "--" +params.data.toName+"<br/>"+"人数: "+params.data.value;
                }
            },
            data: convertData(cityName,'out')
        },
        {
            name: "inLine",
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 1.5,
                trailLength: 0.7,
                color: 'white',
                symbolSize: 2
            },
            lineStyle: {
                normal: {
                    color: "white",
                    width: 0,
                    curveness: 0.2
                }
            },
            tooltip: {
                formatter: function(params){
                    return params.data.fromName + "--" +params.data.toName+"<br/>"+"人数: "+params.data.value;
                }
            },
            data: convertData(cityName,'in')
        },
        {
            name: 'outCity',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 4,
            rippleEffect: {
                brushType: 'stroke',
                scale: 4
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            itemStyle: {
                normal: {
                    color: '#a6c84c'
                }
            },
            tooltip: {
                formatter: function(parmas){
                    return "终点: "+ parmas.data.name+"<br/>"+"人数: "+parmas.data.value[2];
                }
            },
            symbolSize: function (val) {  //涟漪点大小
                if(val[2]>100) return 10;
                return 5 +　val[2] / 20;
            },
            data: outData.map(function (dataItem) { // 例如: dataItem是BJData的某项
                return {
                    name: dataItem.name,
                    value: geoCoordMap(dataItem.name).concat([dataItem.value])
                };
            })
        },
        {
            name: 'inCity',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            zlevel: 4,
            rippleEffect: {
                brushType: 'stroke',
                scale: 4
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            itemStyle: {
              normal: {
                  color: '#a6c84c',
              }
            },
            /*
            tooltip: {
                formatter: function(parmas){
                    return "终点: "+ parmas.data.name+"<br/>"+"人数: "+parmas.data.value[2];
                }
            },
            */
            symbolSize: function (val) {  //涟漪点大小
                if(val[2]>100) return 10;
                return 5 +　val[2] / 20;
            },
            data: inData.map(function (dataItem) { // 例如: dataItem是BJData的某项
                return {
                    name: dataItem.name,
                    value: geoCoordMap(dataItem.name).concat([dataItem.value])
                };
            })
        },
        {  //层4
            name: '起点',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            symbol: 'diamond',
            label: {
                normal: {
                    show: true,
                    position: 'right',  //文本标签相对于点的位置
                    formatter: '{b}'
                }
            },
            /*
            tooltip: {
                formatter: function(params){
                    return "起点: " + params.name;
                }
            },
            */
            itemStyle: {
                normal: {
                    color: '#ffa022',

                }
            },
            symbolSize: 12,
            data: [{name: cityName, value: geoCoordMap(cityName)}]
        },
        {//层5 普通点
            name: '普通点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 5,
            zlevel: 0,
            label: {
                normal:{
                    show: false
                }
            },
            tooltip: {
                formatter: function(params){
                    return params.name;
                }
            },
            data: convertData2(cityNameSet)
        }
    );//series结束

    var option;
    option = {
        label:{
        },
        geo: {  //地图数据设置（颜色，位置，大小,中心点等）
            map: 'china',
            left: '10',
            right: '35%',
            center: [84.98561551896913, 29.205000490896193],
            zoom: 0.7,
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: 'none',
                    borderColor:'rgba(100,149,237,1)',
                    borderWidth:1.5
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series,
        tooltip: {

        },
    }
    mapChart.setOption(option);
}//函数结束

function showPie(cityName,s){
    var series = []; //一开始，series为空  
    var data = pieData[cityName][s];

    var cc;
    if(s == "out") cc = "流出";
    else cc = "流入";

    //-----先确定时间轴--------
    var timeLineData = [];
    for(var i = 1990; i < 3000; i++){
        var i2 = ""+ i;
        if(pieData[cityName][s][i2]){  //这个年份有数据
            timeLineData.push(i2);
        }
    }
    //------------结束确定时间轴--------------

    var option;
    option = {
        baseOption: {
            timeline: {
                show: false,
                left: "0px",
                orient: 'vertical',
                axisType: 'category',
                tooltip:{
                   show: false
                },
                autoPlay:true,
                currentIndex: 0,
                playInterval: 3000,
                lineStyle:{
                    normal: {
                        color: "white"
                    }
                },
                controlStyle:{
                    normal:{
                        color: "white"
                    }
                },
                label: {
                    normal: {
                        show: true,
                        interval: 'auto',
                        formatter:'{value}年',
                        textStyle: {
                            color: "white"
                        }
                    },
                },
                data:[]
            },
            color:['#c23531', 'rgba(255,144,128,1)','rgba(0,191,183,1)','#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074'],
            title: {

            },
            series: {
                type: 'pie'
            }
        },
        options: []
    };
    for(var i = 0; i < timeLineData.length; i++){
        option.baseOption.timeline.data.push(timeLineData[i]);
        option.options.push({
            title : {
                text: timeLineData[i]+"年"+cityName+cc+"人口最多的城市和所占比例",
                x: "left",
                y: "top",
                textStyle:{
                    color: '#fff',
                    fontSize : 19,
                    fontWeight: 'bold'
                }
            },


            series:[{
                type: 'pie',
                center: ['48%','55%'],
                radius: ['20%', '65%'],
                label: {
                    normal: {
                        formatter: "{b}: {c}人 ({d}%)"
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{b}: {c}人 ({d}%)"
                },
                data: data[timeLineData[i]]
            }]
        })
    }

    if(s == 'out')
        pieOutChart.setOption(option);
    else
        pieInChart.setOption(option);
}//getMap函数结束

function showC(s){
    //-----------取数据开始------
    var xData = {},yData = {},xx = [], yy = [],timeLineData = [];
    var year = 1;
    for(var i = 0; i < citys[s].length; i++){
        if(citys[s][i].year != year){
            xData[year] = xx;
            yData[year] = yy;
            year = citys[s][i].year;
            xx = []; yy = [];
            timeLineData.push(citys[s][i].year);
        }
        xx.push(citys[s][i].name);
        yy.push(citys[s][i].value);
    }
    xData[year] = xx;
    yData[year] = yy;
    // -------------取数据结束，得到柱状图的x轴，y轴, 时间轴--------------

    var option;
    option = {
        baseOption: {
            timeline: {
                show: true,
                bottom: "0px",
                axisType: 'category',
                tooltip:{ //暂时没用
                    show:false,
                    formatter:function(params){
                        console.log(params);
                        return params.name+'月份数据统计';
                    }
                },
                symbolSize: 9,
                autoPlay:true,
                currentIndex: 0,
                playInterval: 3000,
                lineStyle:{
                    color: "white"
                },
                itemStyle:{
                    normal: {
                        color: "white"
                    }
                },
                controlStyle:{
                    normal:{
                        color: "white",
                        borderColor: "white"
                    }
                },
                label: {
                    normal: {
                        show: true,
                        interval: 'auto',
                        formatter:'{value}年',
                        textStyle:{
                            color: "white"
                        }
                    },
                },
                data:[],
            },
            title: {

            },
            grid: {
                bottom: 70
            },
            xAxis: {

            },
            yAxis: {

            },
            series: {
                type: 'bar'
            }
        },
        options: []
    };
    for(var i = 0; i < timeLineData.length;i++){
        option.baseOption.timeline.data.push(timeLineData[i]);
        option.options.push({
            title: {
                text: timeLineData[i]+"年全国各城市流出人口排行",
                textStyle:{
                    color: '#fff',
                    fontSize : 19,
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    interval: 0,
                    textStyle: {
                        color: '#ddd'
                    }
                },
                data: xData[timeLineData[i]]
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: true
                },
                axisLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    margin: 2,
                    textStyle: {
                        color: '#aaa'
                    }
                },
            },
            series:[{
                type: 'bar',
                barGap: 20,
                barWidth: 20,
                label: {
                    normal: {
                        show:false,
                    },
                    emphasis: {
                        show:false,
                    },
                },
                itemStyle: {
                    normal: {
                        color:'rgba(100,149,237,1)',
                    },
                    emphasis: {
                        color:'rgba(12, 218, 255, 0.99)',
                    },
                },
                data: yData[timeLineData[i]]
            }]
        });
    }

    // 使用刚指定的配置项和数据显示图表。
    if(s == 'in') barInChart.setOption(option);
    else barOutChart.setOption(option);
}

function showConclusion(cityName){

    //先确定全国流入流出的最大年和最小年
    var minBarInYear = 1*citys['in'][0].year;
    var minBarOutYear = 1*citys['out'][0].year;
    var maxBarInYear = 1*citys['in'][citys['in'].length - 1].year;
    var maxBarOutYear = 1*citys['out'][citys['out'].length - 1].year;

    //确定cityName这个城市流入流出的最大年和最小年
    var minPieOutYear = 10000;
    var minPieInYear = 10000;
    var maxPieOutYear = 10;
    var maxPieInYear = 10;

    for(var i = 1990; i <= 3000; i++){
        var i2 = i + "";
        if(pieData[cityName]['out'][i2]){
            if(i > maxPieOutYear){
                maxPieOutYear = i;
            }
            if( i < minPieOutYear){
                minPieOutYear = i;
            }
        }

        if(pieData[cityName]['in'][i2]){
            if(i > maxPieInYear){
                maxPieInYear = i;
            }
            if(i < minPieInYear){
                minPieInYear = i;
            }
        }
    }

    var PieOutYear = minPieOutYear + counter%(maxPieOutYear - minPieOutYear + 1);
    var PieInYear = minPieInYear + counter%(maxPieInYear - minPieInYear + 1);
    var BarOutYear = minBarOutYear + counter%(maxBarOutYear - minBarOutYear + 1);
    var BarInYear = minBarInYear + counter%(maxBarInYear - minBarInYear + 1);

    var BarIn,BarOut;

    for(var i = 0; i < citys['out'].length; i++){
        if(1*citys['out'][i].year == BarOutYear){
            BarOut = citys['out'][i];
            break;
        }
    }

    for(var i = 0; i < citys['in'].length; i++){
        if(1*citys['in'][i].year == BarInYear){
            BarIn = citys['in'][i];
            break;
        }
    }

    var PieOutCity, PieOutValue, PieInCity, PieInValue;

    PieOutCity =  pieData[cityName]['out'][""+PieOutYear][0].name;
    PieOutValue = pieData[cityName]['out'][""+PieOutYear][0].value;
    PieInCity =   pieData[cityName]['in'][""+PieInYear][0].name;
    PieInValue =  pieData[cityName]['in'][""+PieInYear][0].value;

    var a1 = document.getElementById("allIn");
    a1.innerHTML = BarInYear + "年全国流入人口数量最多的城市: "+ BarIn.name + ": "+ BarIn.value + "人";
    var a2 = document.getElementById("allOut");
    a2.innerHTML = BarOutYear + "年全国流入人口数量最多的城市: "+ BarOut.name + ": "+ BarOut.value + "人";
    var a3 = document.getElementById("cityIn");
    a3.innerHTML = PieInYear +　"年流入" + cityName + "人口最多的城市: " + PieInCity + "(" + PieInValue + "人)";
    var a4 = document.getElementById("cityOut");
    a4.innerHTML = PieOutYear + "年流出" + cityName + "人口最多的城市: " + PieOutCity + "(" + PieOutValue+ "人)";
    counter++;
}


