package org.scut.mychart.service;

import java.util.List;
import java.util.Map;

import org.scut.mychart.model.StaffModel;

/**
 * @author spiden
 *
 */
public interface StaffService {
	
	/**
	 * @return
	 * 实现不同城市的流入人次对比
	 */
	public Map<String, Object> getInData(String sTime,String eTime);
	
	/**
	 * @return
	 * 实现不同城市的流出人次对比
	 */
	public Map<String, Object> getOutData(String sTime, String eTime);
	
	/**
	 * @return
	 * 实现同一城市的流入流出人次对比
	 */
	public Map<String, Object> getCityAllData(String sTime ,String eTime);
	
	/**
	 * @param sTime
	 * @param eTime
	 * 矩形树图数据
	 * @return
	 */
	public Map<String, Object> getCityTreeMapData(String sTime ,String eTime);
	/**
	 * @return
	 * 实现所有数据的对比
	 */
	public Map<String, Object> getAllData();
	
	
	public List<StaffModel> getDeveloped(List<StaffModel> cur);
	
	
	/*
	  大屏展示的取数据部分
	 */
	public Map<String, Object> getBigScreen();
}
