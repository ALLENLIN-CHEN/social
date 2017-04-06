var myChart;
var timer =null;
var isInit = true;
var option;
var linkOption;

//用于保存查询地址
var areas = ['广东省-阳江市','广东省-珠海市','广东省-广州市','广东省-深圳市','上海市','北京市','安徽省-合肥市','江苏省-南京市','浙江省-杭州市','湖北省-孝感市','湖北省-武汉市'];

function setArea() {
	
}

$(function(){
	hideLoading();
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
			$('.time_wrap').show();
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
				//setMap(data);
//			    setMap(data);
				break;
			case 'treeMap':	
				setTreeMap(data);
				break;
				
			case 'histogram_hos':
				option=setHistogramHosOption(data);
				myChart.setOption(option);
				myChart.on('timelinechanged',handleTimeLine);
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


function test(obj){
	var geoCoordMap = {
		    '上海': [121.4648,31.2891],
		    '东莞': [113.8953,22.901],
		    '东营': [118.7073,37.5513],
		    '中山': [113.4229,22.478],
		    '临汾': [111.4783,36.1615],
		    '临沂': [118.3118,35.2936],
		    '丹东': [124.541,40.4242],
		    '丽水': [119.5642,28.1854],
		    '乌鲁木齐': [87.9236,43.5883],
		    '佛山': [112.8955,23.1097],
		    '保定': [115.0488,39.0948],
		    '兰州': [103.5901,36.3043],
		    '包头': [110.3467,41.4899],
		    '北京': [116.4551,40.2539],
		    '北海': [109.314,21.6211],
		    '南京': [118.8062,31.9208],
		    '南宁': [108.479,23.1152],
		    '南昌': [116.0046,28.6633],
		    '南通': [121.1023,32.1625],
		    '厦门': [118.1689,24.6478],
		    '台州': [121.1353,28.6688],
		    '合肥': [117.29,32.0581],
		    '呼和浩特': [111.4124,40.4901],
		    '咸阳': [108.4131,34.8706],
		    '哈尔滨': [127.9688,45.368],
		    '唐山': [118.4766,39.6826],
		    '嘉兴': [120.9155,30.6354],
		    '大同': [113.7854,39.8035],
		    '大连': [122.2229,39.4409],
		    '天津': [117.4219,39.4189],
		    '太原': [112.3352,37.9413],
		    '威海': [121.9482,37.1393],
		    '宁波': [121.5967,29.6466],
		    '宝鸡': [107.1826,34.3433],
		    '宿迁': [118.5535,33.7775],
		    '常州': [119.4543,31.5582],
		    '广州': [113.5107,23.2196],
		    '廊坊': [116.521,39.0509],
		    '延安': [109.1052,36.4252],
		    '张家口': [115.1477,40.8527],
		    '徐州': [117.5208,34.3268],
		    '德州': [116.6858,37.2107],
		    '惠州': [114.6204,23.1647],
		    '成都': [103.9526,30.7617],
		    '扬州': [119.4653,32.8162],
		    '承德': [117.5757,41.4075],
		    '拉萨': [91.1865,30.1465],
		    '无锡': [120.3442,31.5527],
		    '日照': [119.2786,35.5023],
		    '昆明': [102.9199,25.4663],
		    '杭州': [119.5313,29.8773],
		    '枣庄': [117.323,34.8926],
		    '柳州': [109.3799,24.9774],
		    '株洲': [113.5327,27.0319],
		    '武汉': [114.3896,30.6628],
		    '汕头': [117.1692,23.3405],
		    '江门': [112.6318,22.1484],
		    '沈阳': [123.1238,42.1216],
		    '沧州': [116.8286,38.2104],
		    '河源': [114.917,23.9722],
		    '泉州': [118.3228,25.1147],
		    '泰安': [117.0264,36.0516],
		    '泰州': [120.0586,32.5525],
		    '济南': [117.1582,36.8701],
		    '济宁': [116.8286,35.3375],
		    '海口': [110.3893,19.8516],
		    '淄博': [118.0371,36.6064],
		    '淮安': [118.927,33.4039],
		    '深圳': [114.5435,22.5439],
		    '清远': [112.9175,24.3292],
		    '温州': [120.498,27.8119],
		    '渭南': [109.7864,35.0299],
		    '湖州': [119.8608,30.7782],
		    '湘潭': [112.5439,27.7075],
		    '滨州': [117.8174,37.4963],
		    '潍坊': [119.0918,36.524],
		    '烟台': [120.7397,37.5128],
		    '玉溪': [101.9312,23.8898],
		    '珠海': [113.7305,22.1155],
		    '盐城': [120.2234,33.5577],
		    '盘锦': [121.9482,41.0449],
		    '石家庄': [114.4995,38.1006],
		    '福州': [119.4543,25.9222],
		    '秦皇岛': [119.2126,40.0232],
		    '绍兴': [120.564,29.7565],
		    '聊城': [115.9167,36.4032],
		    '肇庆': [112.1265,23.5822],
		    '舟山': [122.2559,30.2234],
		    '苏州': [120.6519,31.3989],
		    '莱芜': [117.6526,36.2714],
		    '菏泽': [115.6201,35.2057],
		    '营口': [122.4316,40.4297],
		    '葫芦岛': [120.1575,40.578],
		    '衡水': [115.8838,37.7161],
		    '衢州': [118.6853,28.8666],
		    '西宁': [101.4038,36.8207],
		    '西安': [109.1162,34.2004],
		    '贵阳': [106.6992,26.7682],
		    '连云港': [119.1248,34.552],
		    '邢台': [114.8071,37.2821],
		    '邯郸': [114.4775,36.535],
		    '郑州': [113.4668,34.6234],
		    '鄂尔多斯': [108.9734,39.2487],
		    '重庆': [107.7539,30.1904],
		    '金华': [120.0037,29.1028],
		    '铜川': [109.0393,35.1947],
		    '银川': [106.3586,38.1775],
		    '镇江': [119.4763,31.9702],
		    '长春': [125.8154,44.2584],
		    '长沙': [113.0823,28.2568],
		    '长治': [112.8625,36.4746],
		    '阳泉': [113.4778,38.0951],
		    '青岛': [120.4651,36.3373],
		    '韶关': [113.7964,24.7028]
		};
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

function setMap(obj){
	var geoCoordMap = {
		    '上海': [121.4648,31.2891],
		    '东莞': [113.8953,22.901],
		    '东营': [118.7073,37.5513],
		    '广东省中山市': [113.4229,22.478],
		    '临汾': [111.4783,36.1615],
		    '临沂': [118.3118,35.2936],
		    '丹东': [124.541,40.4242],
		    '丽水': [119.5642,28.1854],
		    '乌鲁木齐': [87.9236,43.5883],
		    '佛山': [112.8955,23.1097],
		    '保定': [115.0488,39.0948],
		    '兰州': [103.5901,36.3043],
		    '包头': [110.3467,41.4899],
		    '北京': [116.4551,40.2539],
		    '北海': [109.314,21.6211],
		    '南京': [118.8062,31.9208],
		    '南宁': [108.479,23.1152],
		    '南昌': [116.0046,28.6633],
		    '南通': [121.1023,32.1625],
		    '厦门': [118.1689,24.6478],
		    '台州': [121.1353,28.6688],
		    '合肥': [117.29,32.0581],
		    '呼和浩特': [111.4124,40.4901],
		    '咸阳': [108.4131,34.8706],
		    '哈尔滨': [127.9688,45.368],
		    '唐山': [118.4766,39.6826],
		    '嘉兴': [120.9155,30.6354],
		    '大同': [113.7854,39.8035],
		    '大连': [122.2229,39.4409],
		    '天津': [117.4219,39.4189],
		    '太原': [112.3352,37.9413],
		    '威海': [121.9482,37.1393],
		    '宁波': [121.5967,29.6466],
		    '宝鸡': [107.1826,34.3433],
		    '宿迁': [118.5535,33.7775],
		    '常州': [119.4543,31.5582],
		    '广东省广州市': [113.5107,23.2196],
		    '廊坊': [116.521,39.0509],
		    '延安': [109.1052,36.4252],
		    '张家口': [115.1477,40.8527],
		    '徐州': [117.5208,34.3268],
		    '德州': [116.6858,37.2107],
		    '惠州': [114.6204,23.1647],
		    '成都': [103.9526,30.7617],
		    '扬州': [119.4653,32.8162],
		    '承德': [117.5757,41.4075],
		    '拉萨': [91.1865,30.1465],
		    '无锡': [120.3442,31.5527],
		    '日照': [119.2786,35.5023],
		    '昆明': [102.9199,25.4663],
		    '杭州': [119.5313,29.8773],
		    '枣庄': [117.323,34.8926],
		    '柳州': [109.3799,24.9774],
		    '株洲': [113.5327,27.0319],
		    '武汉': [114.3896,30.6628],
		    '汕头': [117.1692,23.3405],
		    '江门': [112.6318,22.1484],
		    '沈阳': [123.1238,42.1216],
		    '沧州': [116.8286,38.2104],
		    '河源': [114.917,23.9722],
		    '泉州': [118.3228,25.1147],
		    '泰安': [117.0264,36.0516],
		    '泰州': [120.0586,32.5525],
		    '济南': [117.1582,36.8701],
		    '济宁': [116.8286,35.3375],
		    '海口': [110.3893,19.8516],
		    '淄博': [118.0371,36.6064],
		    '淮安': [118.927,33.4039],
		    '深圳': [114.5435,22.5439],
		    '清远': [112.9175,24.3292],
		    '温州': [120.498,27.8119],
		    '渭南': [109.7864,35.0299],
		    '湖州': [119.8608,30.7782],
		    '湘潭': [112.5439,27.7075],
		    '滨州': [117.8174,37.4963],
		    '潍坊': [119.0918,36.524],
		    '烟台': [120.7397,37.5128],
		    '玉溪': [101.9312,23.8898],
		    '珠海': [113.7305,22.1155],
		    '盐城': [120.2234,33.5577],
		    '盘锦': [121.9482,41.0449],
		    '石家庄': [114.4995,38.1006],
		    '福州': [119.4543,25.9222],
		    '秦皇岛': [119.2126,40.0232],
		    '绍兴': [120.564,29.7565],
		    '聊城': [115.9167,36.4032],
		    '肇庆': [112.1265,23.5822],
		    '舟山': [122.2559,30.2234],
		    '苏州': [120.6519,31.3989],
		    '莱芜': [117.6526,36.2714],
		    '菏泽': [115.6201,35.2057],
		    '营口': [122.4316,40.4297],
		    '葫芦岛': [120.1575,40.578],
		    '衡水': [115.8838,37.7161],
		    '衢州': [118.6853,28.8666],
		    '西宁': [101.4038,36.8207],
		    '西安': [109.1162,34.2004],
		    '贵阳': [106.6992,26.7682],
		    '连云港': [119.1248,34.552],
		    '邢台': [114.8071,37.2821],
		    '邯郸': [114.4775,36.535],
		    '郑州': [113.4668,34.6234],
		    '鄂尔多斯': [108.9734,39.2487],
		    '重庆': [107.7539,30.1904],
		    '金华': [120.0037,29.1028],
		    '铜川': [109.0393,35.1947],
		    '银川': [106.3586,38.1775],
		    '镇江': [119.4763,31.9702],
		    '长春': [125.8154,44.2584],
		    '长沙': [113.0823,28.2568],
		    '长治': [112.8625,36.4746],
		    '阳泉': [113.4778,38.0951],
		    '青岛': [120.4651,36.3373],
		    '韶关': [113.7964,24.7028],
		    '广东省深圳市':[114.0666,22.6166],
		    '广东省珠海市':[113.5200,22.3150],
		    '广东省佛山市':[113.1100,23.0500],
		    '湖北省十堰市':[110.7900,32.6500],
		    '湖北省咸宁市':[114.2800,29.8700],
		    '湖北省孝感市':[113.9100,31.9200],
		    '湖北省宜昌市':[111.3000,30.7010],
		    '湖北省武汉市':[114.3100,30.5200],
		    '湖北省荆州市':[112.2312,30.3300],
		    '湖北省荆门市':[112.1900,31.0200],
		    '湖北省襄樊市':[112.1700,30.0200],
		    '湖北省鄂州市':[114.8700,30.4400],
		    '湖北省随州市':[113.3701,37.7212],
		    '湖北省黄冈市':[114.8700,30.4413],
		    '湖北省黄石市':[115.0301,30.2568]
		    
		};
	var list=obj.num;
	var relaName=obj.relaName;
	var relaNum=obj.relaNum;
	var stime=obj.sTime;
	var etime=obj.eTime;
	
	var cityData=[];
	for(var i=0;i<list.length;i++){
		var name=list[i].name;
		var num=list[i].num;
		var per=list[i].percent;
		
		
		
		var reNa=relaName[name];
		var reNum=relaNum[name];
		var cao=[];
		
		for(var j=0;j<reNum.length;j++){
			var cur = [];
			cur.push({
				'name':name,
				'value':'流出人数:'+num+'人    流出占比：'+per
			});
			cur.push({
				
					'name':reNa[j],
					'value':reNum[j]							
			});
			cao.push(cur);
					
		}
		var wtf=[name,cao];
	
		cityData.push(wtf);
	}

		

		var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

		var convertData = function (data) {
		    var res = [];
		    for (var i = 0; i < data.length; i++) {
		        var dataItem = data[i];
		        var fromCoord = geoCoordMap[dataItem[0].name];
		        var toCoord = geoCoordMap[dataItem[1].name];
		        if (fromCoord && toCoord) {
		            res.push({
		                fromName: dataItem[0].name,
		                toName: dataItem[1].name,
		                coords: [fromCoord, toCoord]
		            });
		        }
		    }
		    return res;
		};

		var color = ['#a6c84c', '#ffa022', '#46bee9'];
		var series = [];
		cityData.forEach(function (item, i) {
		    series.push({
		        name: item[0] + ' Top10',
		        type: 'lines',
		        zlevel: 1,
		        effect: {
		            show: true,
		            period: 6,
		            trailLength: 0.7,
		            color: '#fff',
		            symbolSize: 3
		        },
		        lineStyle: {
		            normal: {
		                color: color[i],
		                width: 0,
		                curveness: 0.2
		            }
		        },
		        data: convertData(item[1])
		    },
		    {
		        name: item[0] + ' Top10',
		        type: 'lines',
		        zlevel: 2,
		        symbol: ['none', 'arrow'],
		        symbolSize: 10,
		        effect: {
		            show: true,
		            period: 6,
		            trailLength: 0,
		            symbol: planePath,
		            symbolSize: 15
		        },
		        lineStyle: {
		            normal: {
		                color: color[i],
		                width: 1,
		                opacity: 0.6,
		                curveness: 0.2
		            }
		        },
		        data: convertData(item[1])
		    },
		    {
		        name: item[0] + ' Top10',
		        type: 'effectScatter',
		        coordinateSystem: 'geo',
		        zlevel: 2,
		        rippleEffect: {
		            brushType: 'stroke'
		        },
		        label: {
		            normal: {
		                show: true,
		                position: 'right',
		                formatter: '{b}'
		            }
		        },
		        symbolSize: function (val) {
		            return val[2] / 8;
		        },
		        itemStyle: {
		            normal: {
		                color: color[i]
		            }
		        },
		        data: item[1].map(function (dataItem) {
		            return {
		                name: dataItem[1].name,
		                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
		            };
		        })
		    });
		});

		option = {
		    backgroundColor: '#404a59',
		    title : {
		        text: '模拟迁徙',
		        subtext: '数据纯属虚构',
		        left: 'center',
		        textStyle : {
		            color: '#fff'
		        }
		    },
		    tooltip : {
		        trigger: 'item'
		    },
		    legend: {
		        orient: 'vertical',
		        top: 'bottom',
		        left: 'right',
		        data:['北京 Top10', '上海 Top10', '广州 Top10'],
		        textStyle: {
		            color: '#fff'
		        },
		        selectedMode: 'single'
		    },
		    geo: {
		        map: 'china',
		        label: {
		            emphasis: {
		                show: false
		            }
		        },
		        roam: true,
		        itemStyle: {
		            normal: {
		                areaColor: '#323c48',
		                borderColor: '#404a59'
		            },
		            emphasis: {
		                areaColor: '#2a333d'
		            }
		        }
		    },
		    series: series
		};
	
}

function isCover(arr, r, x, y) {
	var tempX, tempY;
	for(var i = 0; i < arr.length; i++) {
		tempX = arr[i]['x'];
		tempY = arr[i]['y'];
		
		if(Math.sqrt(Math.pow((x-tempX),2) + Math.pow((y-tempY),2)) < r) {
			return false;
		}
	}
	
	return true;
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
	
	if(stime===etime){
		t=stime;
	}
	else{
		t=stime+'-'+etime;
	}

	
	for(var i=0;i<num.length;i++){
		var cur={};
		cur.name=num[i].name;
		cur.value=num[i].num;
		
		cityNames[i]=num[i].name;

		citys.push(cur);
	}
	
	
	option = {
			title: {text: t+"年流入人次情况统计",
				    
				   x: 'center'
			},
			
	        
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c}人 ({d}%)"
		    },
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


