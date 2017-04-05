package org.scut.mychart.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.PUT;

import org.scut.mychart.mapper.StaffMapper;
import org.scut.mychart.model.StaffModel;
import org.scut.mychart.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class StaffServiceImpl implements StaffService{
	
	@Autowired
	private StaffMapper staff;
	/**
	 * @return
	 * 实现不同城市的流入人次对比
	 */
	@Override
	public Map<String, Object> getInData(String sTime,String eTime){
		Map<String,Object> data = new HashMap<String,Object>();
		String stime=sTime+"-01-01 00:00:00";
		String etime=eTime+"-12-31 00:00:00";
		
		List<StaffModel> list = this.staff.selectIn(stime,etime);
		
		
		int sum=0;
		for(int i=0;i<list.size();i++){
			sum+=list.get(i).getNum();	
		}
		for(int i=0;i<list.size();i++){
			double cur=(double)list.get(i).getNum()/sum;
			list.get(i).setPercent(cur);
			
		}


		data.put("num",list);
		data.put("sTime", sTime);
		data.put("eTime", eTime);
		data.put("type", "RingChart");
		return data;

	}
	
	/**
	 * @return
	 * 实现不同城市的流出人次对比
	 */
	@Override
	public Map<String, Object> getOutData(String sTime, String eTime){
		Map<String,Object> data = new HashMap<String,Object>();
		String stime=sTime+"-01-01 00:00:00";
		String etime=eTime+"-12-31 00:00:00";

		//stime = "2013-01-01 00:00:00"   etime = "2014-12-31 00:00:00"
		/*
		 select current_work_place as name,count(*) as num
		    from ryld
		    where turn_out_date between "2010-01-01 00:00:00" and "2016-12-31 00:00:00"
		    group by name
		    order by name

		    select original_work_place as name,count(*) as num
		    from ryld
		    where turn_out_date between "2010-01-01 00:00:00" and "2016-12-31 00:00:00"
		    group by name
		    order by name
		 */

		List<StaffModel> list = this.staff.selectOut(stime,etime);
		List<StaffModel> listRe=this.staff.selectRelationship(stime, etime);
		
		double sum=0.0;
		for(int i=0;i<list.size();i++){
			sum+=list.get(i).getNum();	
		}
		for(int i=0;i<list.size();i++){
			double cur=(double)list.get(i).getNum()/sum;
			list.get(i).setPercent(cur);
			
		}
		
		
		Map<String, Object> relaName=new HashMap<String, Object>();
		Map<String, Object> relaNum=new HashMap<String, Object>();
		List<String> name=new ArrayList<String>();
		
		List<Integer> num=new ArrayList<Integer>();
		
		String bef=listRe.get(0).getName();
		String cur;
		
		for(int i=0;i<listRe.size();i++){
			cur=listRe.get(i).getName();
			if(cur.equals(bef)){
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
			}
			else{
				relaName.put(bef, name);
				relaNum.put(bef, num);
				
				bef=cur;
				name.clear();
				num.clear();
				
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
					
			}

		}
		relaName.put(bef, name);
		relaNum.put(bef, num);
		
		
		data.put("num",list);
		data.put("relaName", relaName);
		data.put("relaNum",relaNum);
		data.put("sTime", sTime);
		data.put("eTime", eTime);
		data.put("type", "Map");
		
		return data;
	
	}
	
	
	/**
	 * @return
	 * 实现同一城市的流入流出人次对比
	 */
	@Override
	public Map<String, Object> getCityAllData(String sTime ,String eTime){
		Map<String,Object> data = new HashMap<String,Object>();
		String stime=sTime+"-01-01 00:00:00";
		String etime=eTime+"-12-31 00:00:00";
		
		List<StaffModel> listIn = this.staff.selectIn(stime,etime);
		List<StaffModel> listOut = this.staff.selectOut(stime,etime);
		List<StaffModel> listRe=this.staff.selectRelationship(stime, etime); 
		
		
		//Map<String, Double> percent = new HashMap<String, Double>();
		//List<StaffModel> percent=new ArrayList<StaffModel>();
		
		for(int i=0;i<listOut.size();i++){
			double cur=0.0;
			String string=listOut.get(i).getName();
			boolean ok=true;
			for(int j=0;j<listIn.size();j++){
				if(listIn.get(j).getName().equals(string)){
					cur=(double)listIn.get(i).getNum()/listOut.get(j).getNum();
					//percent.put(string, cur);
					//percent.get(haha).setName(string);
					//percent.get(haha).setPercent(cur);
					//haha++;
					
					listOut.get(i).setOtherNum(listIn.get(j).getNum());
					listOut.get(i).setPercent(cur);
					ok=false;
					break;
				}			
			}
//			if(ok){
//				percent.get(haha).setName(string);
//				percent.get(haha).setPercent(0.0);
//				haha++;
//			}
			
		}
		
		
		Map<String, Object> relaName=new HashMap<String, Object>();
		Map<String, Object> relaNum=new HashMap<String, Object>();
		List<String> name=new ArrayList<String>();
		
		List<Integer> num=new ArrayList<Integer>();
		
		String bef=listRe.get(0).getName();
		String cur;
		
		for(int i=0;i<listRe.size();i++){
			cur=listRe.get(i).getName();
			if(cur.equals(bef)){
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
			}
			else{
				relaName.put(bef, name);
				relaNum.put(bef, num);
				
				bef=cur;
				name.clear();
				num.clear();
				
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
					
			}

		}
		relaName.put(bef, name);
		relaNum.put(bef, num);
		
		
		
	
		data.put("listIn", listIn);
		data.put("listOut", listOut);
		data.put("reName",relaName);
		data.put("reNum", relaNum);
		data.put("type","relation");
		
		return data;
		
	}
	
	
	/**
	 * @return
	 * 实现所有数据的对比
	 */
	@Override
	public Map<String, Object> getAllData(){
		
		Map<String,Object> data = new HashMap<String,Object>();
		
		List<StaffModel> listIn = this.staff.selectInAll();
		//List<StaffModel> listOut = this.staff.selectOutAll();
		
		data.put("in", listIn);
		//data.put("out", listOut);
		return data;

		
	}

}
