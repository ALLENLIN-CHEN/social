var myChart;
var timer =null;
var isInit = true;
var option;
var linkOption;

//用于保存查询地址
var areas = ['广东省-阳江市','广东省-珠海市','广东省-广州市','广东省-深圳市','上海市','北京市','安徽省-合肥市','江苏省-南京市','浙江省-杭州市','湖北省-孝感市','湖北省-武汉市'];

function setArea() {
	var options = [];
	for(var i = 0; i < areas.length; i++) {
		options.push('<option value="'+areas[i]+'">'+areas[i]+'</option>');
	}
	
	$('.area').html(options.join(''));
}

$(function(){
	hideLoading();
	setArea();
	myChart = echarts.init(document.getElementById('chartMain'));
	
	$(".tablesorter").tablesorter();
	$(".tab_content").hide(); //Hide all content
	$("ul.tabs li:first").addClass("active").show(); //Activate first tab
	$(".tab_content:first").show(); //Show first tab content
	
	$("ul.tabs li").click(function() {

		$("ul.tabs li").removeClass("active ");//Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).fadeIn(); //Fade in the active ID content
		return false;
	});
	$('.column').equalHeight();
	
	$('.item').on('click', function() {
		clearInterval(timer);
	});
	
	$(document).on('click', '.sub-item-wrap .type', function() {
		//清除定时器
		clearInterval(timer);
		
	
		if(isInit) {
			//这样写是为了能够让echarts能够得到所设置的width，而不是使用默认的width。 设置完毕后进行hide隐藏掉
			$('.right-content .single').css('visibility','visible').hide();
			
		}
		showLoading();
		$('.sub-item-wrap.active').removeClass('active');
		$(this).parent().addClass('active');
		
		
		if(!$('.time_wrap').is(':hidden')) {
			$('.time_wrap').hide();
		}
		
		
		if(!$(this).data('no-init')) {
			var url = $(this).data('url');
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'json',
				success: function(res) {
					formatOptionConfig(res);
					
				},
				error: function(err) {
					alert('获取数据出错，错误为：' + err);
				}
			});
		}else {
			hideLoading();
			if($(this).hasClass('type-area')) {
				$('.area-wrap').show();
			} else {
				$('.time_wrap').show();
			}
		}
	});
	
	$(window).on("load",function(){
		$(".left-content").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"dark-thick"
		});
		
	});
	
	$(document).on('click', '.time_wrap .search', function() {
		showLoading();
		
		var sTime = $('.startTime').val() - 0;
		var eTime = $('.endTime').val() - 0;
		if(eTime < sTime) {
			alert('起始时间不能大于结束时间！');
			hideLoading();
			return;
		}
		
		var url = $('.sub-item-wrap.active .type').data('url');
		var params = {
				sTime: sTime,
				eTime: eTime
		}
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'json',
			data: params,
			success: function(res) {
				formatOptionConfig(res);
			},
			error: function(err) {
				alert('获取数据出错，错误为：' + err);
				hideLoading();
				
			}
		});
	});
	
	$(document).on('click', '.area-wrap .area-search', function() {
		
	});
		

});

function showLoading() {
	$('.spinner').show();
}
//结束loading
function hideLoading() {
	$('.spinner').hide();
}


function formatOptionConfig(data) {
	$('.right-content .single').show();
	$('.right-content .multi').hide();
	$('.area-wrap').hide();
	//初始化用于获得设置echarts的句柄
	myChart.dispose();
	myChart = echarts.init(document.getElementById('chartMain'));
	hideLoading();
	if(!data.type) {
		myChart.setOption(eval('('+ data+')'));
	}else {
		switch(data.type) {
			case 'RingChart': 
				setRingChart(data);
				break;
			case 'relation':
				setRelation(data);
				myChart.on('click', handleClick);
				break;
			case 'Map':

				setMap(data);
			  // test(data);
				break;
			case 'treeMap':	
				setTreeMap(data);
				break;
				
			case 'allData':
				setAllData(data);
				break;
			case 'histogram_hos_percent':
				setHistogramHosPerOption(data);
				
				break;
			case 'histogram_dep':
				option=setHistogramDepOption(data);
				myChart.setOption(option);
				myChart.on('timelinechanged',handleTimeLineDep);
				break;
			case 'histogram_dep_percent':
				setHistogramDepPerOption(data);
				break;
				
			default:
		}
	}
}





function handleClick(param) {
	console.log(param);
	var name,allLinks;
	var numIn;
	var name2;
	if(param.componentType == "series" && param.seriesType == "graph" && param.seriesName == "流入流出情况"&&param.color=='#cfd8dc') {
		if(linkOption) {
			name = param.name;
			allLinks = linkOption.extend.allLinks;
			linkOption.series[0].links = allLinks.filter(function(link) {
				if(link.source.indexOf(name) >= 0 ) {
					link.lineStyle={
							normal:{
								color:'#009688',
				                opacity: 0.9,
				                width: 2,
				                curveness: 0.2
							}
					}
					return link; 
				}
				if( link.target.indexOf(name) >= 0){
					link.lineStyle={
							normal:{
								color:'#ff5722',
				                opacity: 0.9,
				                width: 2,
				                curveness: 0.2
							}
					}
					return link; 
				}
			});
			
			links=linkOption.series[0].links;
			console.log(links)
			var nameOut;
			var numOut=0;
			
			var nameIn;
			var numIn=0;
			for ( var i=0;i<links.length;i++){
				if(links[i].source==name&&links[i].value>=numOut){
					numOut=links[i].value;
					nameOut=links[i].target
				}
				if(links[i].target==name&&links[i].value>=numIn){
					numIn=links[i].value;
					nameIn=links[i].source;
				}
					
			}
				
			linkOption.title.subtext=param.name+'\n\n最多流出城市: '+nameOut+"\n人数: "+numOut+'人\n\n最多流入城市: '+nameIn+"\n人数: "+numIn+"人";
			linkOption.title.subtextStyle={
					color:'blue',
					fontSize:15
			}
			
			myChart.setOption(linkOption);
		}
	}
}

function setTreeMap(obj){
	
	var listIn=obj.listIn;
	var listOut = obj.listOut;
	var reName=obj.reName;
	var reNum=obj.reNum;
	
	var reName2=obj.reName2;
	var reNum2=obj.reNum2;
	
	var stime=obj.sTime;
	var etime=obj.eTime;
    
	
	var data=[];
	for(var i=0;i<listOut.length;i++){
		var children=[];
		var name = listOut[i].name;
		var dataOut = listOut[i].num;
		var dataIn=listOut[i].otherNum;
		var per=listOut[i].percent;
		
		var relaName=reName[name];
		var relaNum=reNum[name];
		var cur=[];
		for(var j=0;j<relaName.length;j++){
			cur.push({
				value:relaNum[j],
				name:'流入'+relaName[j]+relaNum[j]+'人'
				
			});
		}
		
		
		var relaName2=reName2[name];
		var relaNum2=reNum2[name];
		var cur2=[];
		for(var j=0;j<relaName2.length;j++){
			cur2.push({
				value:relaNum2[j],
				name:relaName2[j]+'流出'+relaNum2[j]+'人'
				
			});
		}
		data.push({
		
//		    name:name+'\n'+'流入流出总人次:'+dataOut+dataIn+'\n'+'流入流出人次比:'+(100*per).toFixed(2)+'%',
			name:name,
			per: per,
			value:dataOut+dataIn,
			children:[
				{
					value:dataOut,
					name:name+'： 流出人次:'+dataOut+'人',
					children:cur,
				},
				{
					value:dataIn,
					name:name+'： 流入人次:'+dataIn+'人',
   				    children:cur2,
				}
			]
		});
		
	
	}

	var t;
	if(stime===etime){
		t=stime;
	}
	else{
		t=stime+'-'+etime;
	}
	    myChart.setOption(option = {
	        title: {
	            text: '同一城市流入流出人次统计',
	            subtext: t+'年',
	            left: 'leafDepth'
	        },
	        tooltip: {
	        	 trigger: 'item',
//			     formatter: "{a} <br/>{b}"
	        	 formatter: function(v) {
	        		 if(v.name.indexOf('：') < 0 && v.name.indexOf('人') < 0) {
	        			 return v.name+"<br/>"+'流入流出总人次:'+v.value+"<br/>"+'流入流出比例：'+(100*v.data.per).toFixed(2)+'%';
	        		 }
	        		 
	        		 return v.seriesName + "<br/>" + v.name;
	        	 }
	        },
	        series: [{
	            name: '统计',
	            type: 'treemap',
	            visibleMin: 300,
	            roam: false,
	            data: data,
	            leafDepth: 1,
	            levels: [
	                {
	                    itemStyle: {
	                        normal: {
	                            borderColor: '#555',
	                            borderWidth: 4,
	                            gapWidth: 4
	                        }
	                    }
	                },
	                {
	                    colorSaturation: [0.3, 0.6],
	                    itemStyle: {
	                        normal: {
	                            borderColorSaturation: 0.7,
	                            gapWidth: 2,
	                            borderWidth: 2
	                        }
	                    }
	                },
	                {
	                    colorSaturation: [0.3, 0.5],
	                    itemStyle: {
	                        normal: {
	                            borderColorSaturation: 0.6,
	                            gapWidth: 1
	                        }
	                    }
	                },
	                {
	                    colorSaturation: [0.3, 0.5]
	                }
	            ]
	        }]
	    })

}


var geoCoordMap = {
	'上海': [121.4648, 31.2891],
	'东莞': [113.8953, 22.901],
	'东营': [118.7073, 37.5513],
	'中山': [113.4229, 22.478],
	'临汾': [111.4783, 36.1615],
	'临沂': [118.3118, 35.2936],
	'丹东': [124.541, 40.4242],
	'丽水': [119.5642, 28.1854],
	'乌鲁木齐': [87.9236, 43.5883],
	'佛山': [112.8955, 23.1097],
	'十堰': [110.7900, 32.6500],
	'保定': [115.0488, 39.0948],
	'兰州': [103.5901, 36.3043],
	'宜昌': [111.3000, 30.7010],
	'包头': [110.3467, 41.4899],
	'北京': [116.4551, 40.2539],
	'咸宁': [114.2800, 29.8700],
	'北海': [109.314, 21.6211],
	'南京': [118.8062, 31.9208],
	'南宁': [108.479, 23.1152],
	'南昌': [116.0046, 28.6633],
	'南通': [121.1023, 32.1625],
	'厦门': [118.1689, 24.6478],
	'台州': [121.1353, 28.6688],
	'合肥': [117.29, 32.0581],
	'呼和浩特': [111.4124, 40.4901],
	'咸阳': [108.4131, 34.8706],
	'哈尔滨': [127.9688, 45.368],
	'唐山': [118.4766, 39.6826],
	'嘉兴': [120.9155, 30.6354],
	'大同': [113.7854, 39.8035],
	'大连': [122.2229, 39.4409],
	'天津': [117.4219, 39.4189],
	'太原': [112.3352, 37.9413],
	'威海': [121.9482, 37.1393],
	'宁波': [121.5967, 29.6466],
	'宝鸡': [107.1826, 34.3433],
	'宿迁': [118.5535, 33.7775],
	'常州': [119.4543, 31.5582],
	'广州': [113.5107, 23.2196],
	'廊坊': [116.521, 39.0509],
	'延安': [109.1052, 36.4252],
	'张家口': [115.1477, 40.8527],
	'徐州': [117.5208, 34.3268],
	'德州': [116.6858, 37.2107],
	'惠州': [114.6204, 23.1647],
	'成都': [103.9526, 30.7617],
	'扬州': [119.4653, 32.8162],
	'承德': [117.5757, 41.4075],
	'拉萨': [91.1865, 30.1465],
	'无锡': [120.3442, 31.5527],
	'日照': [119.2786, 35.5023],
	'昆明': [102.9199, 25.4663],
	'杭州': [119.5313, 29.8773],
	'枣庄': [117.323, 34.8926],
	'柳州': [109.3799, 24.9774],
	'株洲': [113.5327, 27.0319],
	'武汉': [114.3896, 30.6628],
	'荆州': [112.2312, 30.3300],
	'荆门': [112.1900, 31.0200],
	'襄樊': [112.1700, 30.0200],
	'鄂州': [114.8700, 30.4400],
	'汕头': [117.1692, 23.3405],
	'随州': [113.3701, 37.7212],
	'江门': [112.6318, 22.1484],
	'沈阳': [123.1238, 42.1216],
	'沧州': [116.8286, 38.2104],
	'黄冈': [114.8700, 30.4413],
	'黄石': [115.0301, 30.2568],
	'河源': [114.917, 23.9722],
	'泉州': [118.3228, 25.1147],
	'泰安': [117.0264, 36.0516],
	'泰州': [120.0586, 32.5525],
	'济南': [117.1582, 36.8701],
	'济宁': [116.8286, 35.3375],
	'海口': [110.3893, 19.8516],
	'淄博': [118.0371, 36.6064],
	'淮安': [118.927, 33.4039],
	'深圳': [114.5435, 22.5439],
	'清远': [112.9175, 24.3292],
	'温州': [120.498, 27.8119],
	'渭南': [109.7864, 35.0299],
	'湖州': [119.8608, 30.7782],
	'湘潭': [112.5439, 27.7075],
	'滨州': [117.8174, 37.4963],
	'潍坊': [119.0918, 36.524],
	'烟台': [120.7397, 37.5128],
	'玉溪': [101.9312, 23.8898],
	'珠海': [113.7305, 22.1155],
	'阳江': [111.9861, 21.8662],
	'孝感': [113.9189, 30.9230],
	'盐城': [120.2234, 33.5577],
	'盘锦': [121.9482, 41.0449],
	'石家庄': [114.4995, 38.1006],
	'福州': [119.4543, 25.9222],
	'秦皇岛': [119.2126, 40.0232],
	'绍兴': [120.564, 29.7565],
	'聊城': [115.9167, 36.4032],
	'肇庆': [112.1265, 23.5822],
	'舟山': [122.2559, 30.2234],
	'苏州': [120.6519, 31.3989],
	'莱芜': [117.6526, 36.2714],
	'菏泽': [115.6201, 35.2057],
	'营口': [122.4316, 40.4297],
	'葫芦岛': [120.1575, 40.578],
	'衡水': [115.8838, 37.7161],
	'衢州': [118.6853, 28.8666],
	'西宁': [101.4038, 36.8207],
	'西安': [109.1162, 34.2004],
	'贵阳': [106.6992, 26.7682],
	'连云港': [119.1248, 34.552],
	'邢台': [114.8071, 37.2821],
	'邯郸': [114.4775, 36.535],
	'郑州': [113.4668, 34.6234],
	'鄂尔多斯': [108.9734, 39.2487],
	'重庆': [107.7539, 30.1904],
	'金华': [120.0037, 29.1028],
	'铜川': [109.0393, 35.1947],
	'银川': [106.3586, 38.1775],
	'镇江': [119.4763, 31.9702],
	'长春': [125.8154, 44.2584],
	'长沙': [113.0823, 28.2568],
	'长治': [112.8625, 36.4746],
	'阳泉': [113.4778, 38.0951],
	'青岛': [120.4651, 36.3373],
	'韶关': [113.7964, 24.7028]
};//数组保存了地理坐标

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


function setMap(obj) {
    	//	我把geoCoordMap数组和convertCityName函数扔到了函数外部

	/*
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

	 var ccData = [
	 {name:'北京',data:BJData},
	 {name:'上海',data:SHData},
	 {name:'广州',data:GZData}
	 ];
	 */
	//--------------------下面都是对接的-----------------


	var relaName = obj.relaName;
	var relaNum = obj.relaNum;
	var list = obj.num;
	var stime = obj.sTime;
	var etime = obj.eTime;


	function sortOutValue(a ,b){
		return a.value - b.value;
	}

	/*
	 var cityNameSet = [
	 { name: '乌鲁木齐'},
	 { name: '佛山'},
	 { name: '保定'},
	 { name: '兰州'},
	 { name: '包头'},
	 { name: '北海'},
	 { name: '南昌'},
	 { name: '厦门'}
	 ]; //用于做流出城市的普通散点
	 */
	var cityNameSet = []; //用于做流出城市的普通散点
	for (var i = 0; i < list.length; i++) {
		var c = {name: convertCityName(list[i].name)};
		cityNameSet.push(c);
	}

	//开始做ccData
	var ccData = [];
	for (var i = 0; i < list.length; i++) {
		var fromCity = list[i].name;
		var toCityNameList = relaName[fromCity];
		var toCityValList = relaNum[fromCity];
		var BJData = [];

		for (var j = 0; j < toCityNameList.length; j++) {
			//{name:'上海',value:95},
			var cc = {name: convertCityName(toCityNameList[j]), value: toCityValList[j]};
			BJData.push(cc);
		}
		BJData.sort(sortOutValue);
		//{name:'北京',data:BJData},
		var ccc = {name: convertCityName(fromCity), data: BJData};
		ccData.push(ccc);

	}


	var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

	var convertData = function (cityData) {
//cityData是上面ccData的一个数值,格式 “{name:'北京',data:BJData}”
		var res = [];
		var data = cityData.data; //data是上面数组之一，比如BJData
		var fromCity, toCity;
		fromCity = cityData.name;
		for (var i = 0; i < data.length; i++) {
			var dataItem = data[i];       //dataItem格式：{name:'福州',value:95}
			toCity = dataItem.name;
			var fromCoord = geoCoordMap[fromCity];
			var toCoord = geoCoordMap[toCity];
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

	function convertData2(cityNameSet) {
		var ret = [];
		for (var i = 0; i < cityNameSet.length; i++) {
			var c = {name: cityNameSet[i].name, value: geoCoordMap[cityNameSet[i].name]};
			ret.push(c);
		}
		return ret;
	}

	function showCity(cityData) {
		//cityData是ccData的其中一项，格式： “ {name:'北京',data:BJData} ”
		var fromCity = cityData.name;
		var fromCityData = cityData.data;  //比如BJData

		var data2 = cityData.data;

		var minValue = cityData.data[0].value;
		var maxValue = cityData.data[cityData.data.length-1].value;

		var categoryData = [], barData = []; //柱状图的两个轴
		for (var i = 0; i < data2.length; i++) {
			categoryData.push(data2[i].name);
			barData.push(data2[i].value);
		}

		var series = []; //一开始，series为空

		series.push({ //层0 路线
				name: fromCity + ' Top10',
				type: 'lines',
				zlevel: 1,
				effect: {
					show: true,
					period: 4,
					trailLength: 0.7,
					symbolSize: 2
				},
				lineStyle: {
					normal: {
						width: 0,
						curveness: 0.2
					}
				},
				data: convertData(cityData)
				/*
				 res = [
				 [{coord: fromCoord},{coord: toCoord, value: 人口流出量}],
				 ......
				 ......
				 ];
				 */
			},

			{   //层1 路线
				name: fromCity + ' Top10',
				type: 'lines',
				zlevel: 2,
				effect: {  //线上动点的效果，可以显示为飞机
					show: true,
					period: 4,
					trailLength: 0,
					symbol: planePath,
					symbolSize: 13
				},

				tooltip: {
					formatter: function(params){
						return params.data.fromName + "--" +params.data.toName+"<br/>"+"人数: "+params.data.value;
					}
				},

				lineStyle: {  //线的样式
					normal: {
						width: 1,
						opacity: 0.6,
						curveness: 0.2
					}
				},
				data: convertData(cityData)
				/*
				 convertData输出
				 res = [
				 [fromName: 流出城市, toName: 流入城市A, coords: [流出城市坐标, 流入城市A坐标], value: 人数],
				 ......
				 [fromName: 流出城市, toName: 流入城市V, coords: [流出城市坐标, 流入城市V坐标], value: 人数],
				 ];
				 */
			},

			{   //层2 带涟漪效果的点(表示流入城市)
				name: fromCity + ' Top10',
				type: 'effectScatter',
				coordinateSystem: 'geo',
				zlevel: 4,
				rippleEffect: {     //涟漪效果设置
					brushType: 'stroke',
					scale: 4
				},
				label: {     //涟漪点文本标签
					normal: {
						show: true,
						position: 'right',  //文本标签相对于涟漪点的位置
						formatter: '{b}'
					}
				},
				tooltip: {
					formatter: function(parmas){
						return "终点: "+ parmas.data.name+"<br/>"+"人数: "+parmas.data.value[2];
					}
				},
				symbolSize: function (val) {  //涟漪点大小
					if(val[2]>100) return 15;
					return 5 + val[2] / 20;
				},

				data: fromCityData.map(function (dataItem) { // 例如: dataItem是BJData的某项
					return {
						name: dataItem.name,
						value: geoCoordMap[dataItem.name].concat([dataItem.value])
					};
				})
			},

			{  //层3起点
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
				tooltip: {
					formatter: function(params){
						return "起点: " + params.name;
					}
				},
				itemStyle: {
					normal: {
						color: 'rgba(100,149,237,1)' //这里暂时起不了作用，颜色被visualmap影响了
					}
				},
				symbolSize: 12,
				data: [{name: fromCity, value: geoCoordMap[fromCity]}]
			},

			{//层4 普通点
				name: '普通点',
				type: 'scatter',
				coordinateSystem: 'geo',
				symbolSize: 5,
				zlevel: 3,
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
			},

			{//层5 右边的柱状图
				type: 'bar',
				symbol: 'none',
				itemStyle: {
					normal: {
						color: 'rgba(100,149,237,1)'
					}
				},
				label: {
					normal: {
						show: true,
						position: 'right',
						formatter: '{c}'
					}
				},
				data: barData
			}

		);//series结束

		var option;
		option = {
			backgroundColor: '#1b1b1b',
			title : {
				text: cityData.name+'人口流出排行',
				//subtext: '数据纯属虚构',
				right: "13%",
				top: "20%",
				textStyle : {
					color: '#fff'
				}
			},
			visualMap: {
				type: 'continuous',
				min: minValue,
				max: maxValue,
				calculable: true,
				color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
				textStyle: {
					color: '#fff'
				}
			},
			grid: { //坐标系数据设置（位置）
				right: 40,
				top: '30%',
				bottom: '20%',
				width: '30%'
			},
			tooltip: {

			},
			geo: {  //地图数据设置（颜色，位置，大小,中心点等）
				map: 'china',
				left: '10',
				right: '35%',
				center: [107.98561551896913, 31.205000490896193],
				zoom: 1.5,
				label: {
					emphasis: {
						show: false
					}
				},
				roam: true,
				itemStyle: {
					normal: {
						areaColor: '#1b1b1b',
						borderColor: 'rgba(100,149,237,1)',
						borderWidth: 0.5
					},
					emphasis: {
						areaColor: '#2a333d'
					}
				}
			},
			series: series,
			xAxis: {
				type: 'value',
				scale: true,
				position: 'top',
				boundaryGap: false,
				splitLine: {
					show: false
				},
				axisLine: {
					show: false
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
			yAxis: {
				type: 'category',
				nameGap: 16,
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
				data: categoryData //流入城市的名字，以后要按照大小排序,现在算了
			},
			label: {
				normal: {
					show: true,
					position: 'top',
					//  formatter: '{c}'
				}
			}
		}
		myChart.setOption(option);
	}//showCity函数结束

	showCity(ccData[2]);


	myChart.on('click', function (e) {
		console.log(e);
		if (e.componentType != "series") return;
		if (e.componentSubType != "effectScatter" && e.componentSubType != "scatter") return;
		//判断是不是设置的点击事件

		var fromCityName = e.name;
		var id = -1;
		for (var i = 0; i < ccData.length; i++) {
			if (ccData[i].name == fromCityName)
				id = i;
		}
		if (id == -1) return; //所选的城市没有数据，退出

		showCity(ccData[id]); //把所选的城市改为被点击的城市
	})
}


function setRelation(obj){
	
	var listIn=obj.listIn;
	var listOut = obj.listOut;
	var reName=obj.reName;
	var reNum=obj.reNum;
	
	
	var data=[];
	
	for(var i =0;i<listOut.length;i++){
		var cur={};
		var str = listOut[i].name;
		var rela=reName[str];
		var relaData=reNum[str];
		
		cur.cityIn=str;
		cur.rela=rela;
		cur.relaData=relaData;
		cur.dataIn=listOut[i].otherNum;
		cur.dataOut=listOut[i].num;
		cur.per=listOut[i].percent;
		data.push(cur);

		
	}
	
	var nodes=[];
	var tmp_nodes=[];
	var categories=[];
	var pos=[100,200,300,400,500,600,700,800,900,1000];
	var x, y;
	for(var i in data){
		
		tmp_nodes.push(data[i].cityIn);
		x=parseInt(Math.random()*500);
		y=parseInt(Math.random()*400);
		while(!isCover(nodes, 80, x, y)) {
			x=parseInt(Math.random()*500);
			y=parseInt(Math.random()*400);
		}
		categories[i]=data[i].cityIn;
		nodes.push(
				{
					'name':data[i].cityIn,
					'x':x,
					'y':y,
					'value':'流出:'+data[i].dataOut+'人     流入:'+data[i].dataIn+'人    流入流出比率:'+(data[i].per.toFixed(2)*100)+'%',
					
					'label': {
	                    'normal': {
	                        'show': true,
	                        textStyle: {
	                            'color': 'red',
	                            'fontSize': 6
	                        }
	                    }
	                }
					
				}
			);
		
			
		
		
//		var rela=data[i].rela;
//		var relaData=data[i].relaData;
//		
//		var coord_i=parseInt(i)+1;
//		for(var j=0;j<rela.length;j++){
//			nodes.push(
//					{
//						'name':rela[j],
//						'x':(parseInt(j)+1)*200,
//						'y':(parseInt(coord_i)+parseInt(j))*100,
//						'label': {
//	                        'normal': {
//	                            'show': true,
//	                            textStyle: {
//	                                'color': 'red',
//	                                'fontSize': 8
//	                            }
//	                        }
//	                    }
//					}
//					);	
//		}

	}
	
	var links=[];
	for(var i=0;i<data.length;i++){
		var rela=data[i].rela;
		if(rela[0]==='无'){
			break;
		}
		var relaData=data[i].relaData;
		for(var j in rela){
			links.push({
				'source':data[i].cityIn,
				'target':rela[j],
				'value':relaData[j]
			})
		}
	}
	console.log(links);
	linkOption = {
			extend: {
				allLinks: links
			},
		    title: {
		        text: '流入流出关系图',
		        subtext: "",
		    },
		    tooltip: {
		    	trigger: 'item',
		        formatter: "{a} <br/>{b}: {c}"
		    },
//		    legend: [{
//		        orient: 'vertical',
//		        x: 'left',
//		        data:categories
//		       
//		    }],
		    series: [{
		   
	            name:'流入流出情况',	    
		        type: 'graph',
		        legendHoverLink: false,
		        hoverAnimation: false,
		        layout: 'none',
		        focusNodeAdjacency: false,
		        symbolSize: 80,
		        roam: false,
		        label: {
		            normal: {
		                show: true
		            }
		        },
		        edgeSymbol: ['circle', 'arrow'],
		        edgeSymbolSize: [4, 16],
		        edgeLabel: {
		            normal: {
		                textStyle: {
		                    fontSize: 8
		                }
		            }
		        },
		        itemStyle: {
		            normal: {
		                color: '#cfd8dc',
		                borderColor: '#3b50ce',
		                
		            }
		        },
		        categories: categories,
		        data: nodes,
		        links: [],
//		        lineStyle: {
//		            normal: {
//		            	color:'green',
//		                opacity: 0.9,
//		                width: 2,
//		                curveness: 0.2
//		            }
//		        }
		    }]
		};
	myChart.setOption(linkOption);
	

	
}
function setRingChart(obj) {
	
	var num = obj.num;   
	var proData=obj.province;
	var stime=obj.sTime;
	var etime=obj.eTime;
	var t;
	var citys=[];
	var cityNames=[];
	
	var province=[];

	province.push({
		value:proData[0].otherNum,
		name:proData[0].name,
		selected:true,
	})
	for(var i =1;i<proData.length;i++){
		province.push({
			value:proData[i].otherNum,
			name:proData[i].name
		})
	}
	//各省的name，value，selected, 饼图中间的部分
	
	if(stime===etime){
		t=stime;
	}
	else{
		t=stime+'-'+etime;
	}
	//t是时间范围
	
	for(var i=0;i<num.length;i++){
		var cur={};
		cur.name=num[i].name;
		cur.value=num[i].num;
		
		cityNames[i]=num[i].name;

		citys.push(cur);
	}
	//city保留了城市的value，name，是饼图外围部分  cityNames数组保留所有城市的名字
	
	option = {
			title: {text: t+"年流入人次情况统计",
				   x: 'center'
			},
			
	        
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c}人 ({d}%)"
		    },

		    // legend: {
		    //     orient: 'horizontal',
		    //     y: 'bottom',
		    //     data:names
		    // },

//		    legend: {
//		        orient: 'vertical',
//		        x: 'left',
//		        data:names
//		    },

		    series: [
		        {
		            name:'流入人次情况',
		            type:'pie',
		            selectedMode: 'single',
		            center:['25%','50%'],
		            radius: [0, '40%'],
		            x:'left',

		            label: {
		                normal: {
		                    position: 'inner'
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:province
		        },
		        {
		            name:'流入人次情况',
		            type:'pie',
		            center:['25%','50%'],
		            radius: ['50%', '70%'],

		            data: citys
		        }
		    ]
		};
	
	myChart.setOption(option);
}
function setAllData(obj){
	
	var allData = obj.allData;
	
	var years=[];
	var name='北京市';
	var InData=[];
	var OutData=[];
	var total=[];
	var percents = [];
	
	for(var i =0,j=0;i< allData.length;i++){
		if(allData[i].name==name){
			years[j]=allData[i].year+'年';
			InData[j]=allData[i].otherNum;
			OutData[j]=allData[i].num;
			total[j]=allData[i].otherNum + allData[i].num;
			percents[j]=100*allData[i].percent.toFixed(2);
			j++;
		}
	}
	

	option = {
	    backgroundColor: '#0f375f',
	    tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'shadow',
	            label: {
	                show: true,
	                backgroundColor: '#333'
	            }
	        }
	    },
	    legend: {
	        data: ['流入', '流出','流入流出率'],
	        textStyle: {
	            color: '#ccc'
	        }
	    },
	    xAxis: {
	        type:'category',
	        data: years,
	        axisLine: {
	            lineStyle: {
	                color: '#ccc'
	            }
	        }
	    },
	    yAxis:[ {
	        type:'value',
	        name:'人数',
	        splitLine: {show: false},
	        axisLine: {
	            lineStyle: {
	                color: '#ccc'
	            }
	        }
	    },
	    {
	        type: 'value',
	            name: '流入流出率',
	            min: 0,
	            max: 100,
	            splitLine: {show: false},
	            position: 'right',
	            // offset: 80,
	            axisLine: {
	                lineStyle: {
	                    color: '#ccc'
	                }
	            },
	            axisLabel: {
	                formatter: '{value}%'
	            }
	    }],
	    series: [
	        {
	        name: '流入流出率',
	        type: 'line',
	        smooth: true,
	        showAllSymbol: true,
	        symbol: 'emptyCircle',
	        symbolSize: 15,
	        data: percents
	    },
	    
	    {
	        name: '流出',
	        type: 'bar',
	        stack:'总数',
	        barWidth: 10,
	        itemStyle: {
	            normal: {
	                barBorderRadius: 5,
	                color: new echarts.graphic.LinearGradient(
	                    0, 0, 0, 1,
	                    [
	                        {offset: 0, color: '#14c8d4'},
	                        {offset: 1, color: '#43eec6'}
	                    ]
	                )
	            }
	        },
	        data: OutData
	    },
	   
	  {
	        name: '流入',
	        type: 'bar',
	        stack:'总数',
	        barGap: '-100%',
	        barWidth: 10,
	        itemStyle: {
	            normal: {
	                color: new echarts.graphic.LinearGradient(
	                    0, 0, 0, 1,
	                    [
	                        {offset: 0, color: 'rgba(20,200,212,0.5)'},
	                        {offset: 0.2, color: 'rgba(20,200,212,0.5)'},
	                        {offset: 1, color: 'rgba(20,200,212,0.5)'}
	                    ]
	                )
	            }
	        },
	        z: -12,
	        data: InData
	    },
	     
//	    {
//	        name: '总数',
//	        type: 'pictorialBar',
//	        symbol: 'rect',
//	        itemStyle: {
//	            normal: {
//	                color: '#0f375f'
//	            }
//	        },
//	        symbolRepeat: true,
//	        symbolSize: [12, 4],
//	        symbolMargin: 1,
//	        z: -10,
//	        data: total
//	    }
	    ]
	};
	myChart.setOption(option);
}

