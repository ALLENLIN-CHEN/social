package org.scut.mychart.controller;

import java.util.Map;

import org.scut.mychart.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 *获取数据
 * @author spiden
 *
 */
@Controller
@RequestMapping(value="/staff", produces="application/json;charset=UTF-8")
public class StaffController {
	@Autowired
	private StaffService staffservice;
	
	
	/**
	 * 获取每个城市指定时间得流入人次
	 * @return
	 */
	@RequestMapping("/staffIn")
    @ResponseBody
    public Map<String, Object> getStaffIn(@RequestParam String sTime, @RequestParam String eTime){
		Map<String, Object> map =  staffservice.getInData(sTime, eTime);
        return map;
    } 
	
	/**
	 * 获取每个城市指定时间得流出人次
	 * @return
	 */
	@RequestMapping("/staffOut")
    @ResponseBody
    public Map<String, Object> getStaffOut(String sTime, String eTime){
		Map<String, Object> map =  staffservice.getOutData(sTime, eTime);
		for(Map.Entry entry: map.entrySet()){
			System.out.println(entry.getKey()+"   ??=??  "+entry.getValue());
		}

		return map;
    }
	
	/**
	 * 获取同一城市的流入流出人次对比
	 * @param area
	 * @return
	 */
	@RequestMapping("/staffCityAll")
    @ResponseBody
    public Map<String, Object> getStaffCityAll(String sTime, String eTime){
		
		Map<String, Object> map =staffservice.getCityAllData(sTime, eTime);   
				return map;
    }
	
	/**
	 * 获取所有数据
	 * @return
	 */
	@RequestMapping("/staffAllData")
    @ResponseBody
    public Map<String, Object> getStaffAllData(){
		Map<String, Object> map =  staffservice.getAllData();
        return map;
    }
	
	
}
