/**
 * Created by scut on 2017/4/16.
 */
//用于存放伪造的数据

var citys = {
    'out':[
        { name: "阳江", year: 2012 , value: 171},
        { name: "梅州", year: 2012 , value: 167},
        { name: "江门", year: 2012 , value: 156},
        { name: "上海", year: 2012 , value: 144},
        { name: "北京", year: 2012 , value: 121},
        { name: "乌鲁木齐", year: 2012 , value: 111},
        { name: "福州", year: 2012 , value: 101},
        { name: "合肥", year: 2012 , value: 99},
        { name: "拉萨", year: 2012 , value: 70},
        { name: "昆明", year: 2012 , value: 14},
        { name: "广州", year: 2012 , value: 11},

        { name: "阳江", year: 2013 , value: 271},
        { name: "梅州", year: 2013 , value: 267},
        { name: "上海", year: 2013 , value: 256},
        { name: "江门", year: 2013 , value: 244},
        { name: "北京", year: 2013 , value: 221},
        { name: "乌鲁木齐", year: 2013 , value: 211},
        { name: "合肥", year: 2013 , value: 101},
        { name: "西安", year: 2013 , value: 99},
        { name: "拉萨", year: 2013 , value: 70},
        { name: "昆明", year: 2013 , value: 14},
        { name: "广州", year: 2013 , value: 11},

        { name: "阳江", year: 2014 , value: 171},
        { name: "梅州", year: 2014 , value: 167},
        { name: "江门", year: 2014 , value: 156},
        { name: "上海", year: 2014 , value: 144},
        { name: "北京", year: 2014 , value: 121},
        { name: "乌鲁木齐", year: 2014 , value: 111},
        { name: "福州", year: 2014 , value: 101},
        { name: "合肥", year: 2014 , value: 99},
        { name: "拉萨", year: 2014 , value: 70},
        { name: "昆明", year: 2014 , value: 14},
        { name: "广州", year: 2014 , value: 11},

        { name: "阳江", year: 2015 , value: 171},
        { name: "梅州", year: 2015 , value: 167},
        { name: "江门", year: 2015 , value: 156},
        { name: "上海", year: 2015 , value: 144},
        { name: "北京", year: 2015 , value: 121},
        { name: "乌鲁木齐", year: 2015 , value: 111},
        { name: "福州", year: 2015 , value: 101},
        { name: "合肥", year: 2015 , value: 99},
        { name: "拉萨", year: 2015 , value: 70},
        { name: "昆明", year: 2015 , value: 14},
        { name: "广州", year: 2015 , value: 11},

        { name: "阳江", year: 2016 , value: 171},
        { name: "梅州", year: 2016 , value: 167},
        { name: "江门", year: 2016 , value: 156},
        { name: "上海", year: 2016 , value: 144},
        { name: "北京", year: 2016 , value: 121},
        { name: "乌鲁木齐", year: 2016 , value: 111},
        { name: "福州", year: 2016 , value: 101},
        { name: "合肥", year: 2016 , value: 99},
        { name: "拉萨", year: 2016 , value: 70},
        { name: "昆明", year: 2016 , value: 14},
        { name: "广州", year: 2016 , value: 11},
    ],

    'in': [
        { name: "阳江", year: 2012 , value: 171},
        { name: "梅州", year: 2012 , value: 167},
        { name: "江门", year: 2012 , value: 156},
        { name: "上海", year: 2012 , value: 144},
        { name: "北京", year: 2012 , value: 121},
        { name: "乌鲁木齐", year: 2012 , value: 111},
        { name: "福州", year: 2012 , value: 101},
        { name: "合肥", year: 2012 , value: 99},
        { name: "拉萨", year: 2012 , value: 70},
        { name: "昆明", year: 2012 , value: 14},
        { name: "广州", year: 2012 , value: 11},

        { name: "阳江", year: 2013 , value: 271},
        { name: "梅州", year: 2013 , value: 267},
        { name: "上海", year: 2013 , value: 256},
        { name: "江门", year: 2013 , value: 244},
        { name: "北京", year: 2013 , value: 221},
        { name: "乌鲁木齐", year: 2013 , value: 211},
        { name: "合肥", year: 2013 , value: 101},
        { name: "西安", year: 2013 , value: 99},
        { name: "拉萨", year: 2013 , value: 70},
        { name: "昆明", year: 2013 , value: 14},
        { name: "广州", year: 2013 , value: 13},

        { name: "阳江", year: 2014 , value: 171},
        { name: "梅州", year: 2014 , value: 167},
        { name: "江门", year: 2014 , value: 156},
        { name: "上海", year: 2014 , value: 144},
        { name: "北京", year: 2014 , value: 121},
        { name: "乌鲁木齐", year: 2014 , value: 111},
        { name: "福州", year: 2014 , value: 101},
        { name: "合肥", year: 2014 , value: 99},
        { name: "拉萨", year: 2014 , value: 70},
        { name: "昆明", year: 2014 , value: 14},
        { name: "广州", year: 2014 , value: 3},

        { name: "阳江", year: 2015 , value: 171},
        { name: "梅州", year: 2015 , value: 167},
        { name: "江门", year: 2015 , value: 156},
        { name: "上海", year: 2015 , value: 144},
        { name: "北京", year: 2015 , value: 121},
        { name: "乌鲁木齐", year: 2015 , value: 111},
        { name: "福州", year: 2015 , value: 101},
        { name: "合肥", year: 2015 , value: 99},
        { name: "拉萨", year: 2015 , value: 70},
        { name: "昆明", year: 2015 , value: 14},
        { name: "广州", year: 2015 , value: 11},

        { name: "阳江", year: 2016 , value: 171},
        { name: "梅州", year: 2016 , value: 167},
        { name: "江门", year: 2016 , value: 156},
        { name: "上海", year: 2016 , value: 144},
        { name: "北京", year: 2016 , value: 121},
        { name: "乌鲁木齐", year: 2016 , value: 111},
        { name: "福州", year: 2016 , value: 101},
        { name: "合肥", year: 2016 , value: 99},
        { name: "拉萨", year: 2016 , value: 70},
        { name: "昆明", year: 2016 , value: 14},
        { name: "广州", year: 2016 , value: 7}
    ]
}
//--------上面两个数组，必须保证先按照年份排序，然后是人数
var cityNameSet = [
    { name: '乌鲁木齐'},
    { name: '佛山'},
    { name: '保定'},
    { name: '兰州'},
    { name: '包头'},
    { name: '北海'},
    { name: '南昌'},
    { name: '厦门'}
];

var BJData = [
    {name:'上海',value:95},
    {name:'广州',value:90},
    {name:'大连',value:80},
    {name:'南宁',value:70},
    {name:'南昌',value:60},
    {name:'拉萨',value:50},
    {name:'长春',value:40},
    {name:'包头',value:30},
    {name:'重庆',value:20},
    {name:'常州',value:10}
];

var SHData = [
    {name:'包头',value:95},
    {name:'昆明',value:90},
    {name:'广州',value:80},
    {name:'郑州',value:70},
    {name:'长春',value:60},
    {name:'重庆',value:50},
    {name:'长沙',value:40},
    {name:'北京',value:30},
    {name:'丹东',value:20},
    {name:'大连',value:10}
];

var GZData = [
    {name:'福州',value:95},
    {name:'太原',value:90},
    {name:'长春',value:80},
    {name:'重庆',value:70},
    {name:'西安',value:60},
    {name:'成都',value:50},
    {name:'常州',value:40},
    {name:'北京',value:30},
    {name:'北海',value:20},
    {name:'衡水',value:20},
    {name:'海口',value:10}
];




var ccData = {
    '北京': { 'out':BJData, 'in':BJData},
    '上海': { 'out':SHData, 'in':SHData},
    '广州': { 'out':GZData, 'in':GZData}
}

//上面这几个数组用于具体城市的图
