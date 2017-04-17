package org.scut.mychart.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.metadata.IIOInvalidTreeException;
import javax.ws.rs.PUT;

import org.scut.mychart.mapper.StaffMapper;
import org.scut.mychart.model.StaffModel;
import org.scut.mychart.service.StaffService;
import org.springframework.aop.aspectj.AspectJAdviceParameterNameDiscoverer.AmbiguousBindingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stringtemplate.v4.compiler.CodeGenerator.includeExpr_return;
import org.stringtemplate.v4.compiler.STParser.namedArg_return;

import com.mysql.fabric.xmlrpc.base.Array;


@Service
public class StaffServiceImpl implements StaffService{
	
	@Autowired
	private StaffMapper staff;
	/**
	 * @return
	 * 实现不同城市的流入人次对比
	 */
	@Override
	/*
	public Map<String, Object> getInData(String sTime,String eTime){

		Map<String,Object> data = new HashMap<String,Object>();
		String stime=sTime+"-01-01 00:00:00";
		String etime=eTime+"-12-31 00:00:00";

		List<StaffModel> list = this.staff.selectIn(stime,etime);

		List<StaffModel> province =new ArrayList<StaffModel>();
		List<StaffModel> proData =new ArrayList<StaffModel>();



		int sum=0;
		for(int i=0;i<list.size();i++){
			if(list.get(i).getName().contains("-")){
				String[] tmp = list.get(i).getName().split("-");
				StaffModel cur= new StaffModel();
				cur.setName(tmp[0]);
				cur.setOtherNum(list.get(i).getNum());
				province.add(cur);
			}
			else{
				String tmp = list.get(i).getName();
				StaffModel cur= new StaffModel();
				cur.setName(tmp);
				cur.setOtherNum(list.get(i).getNum());
				province.add(cur);
			}
//			if(list.get(i).getName().contains("-")){
//				String[] tmp = list.get(i).getName().split("-");
//				string=tmp[0];
//			}
//			


			sum+=list.get(i).getNum();
		}

		String bef = province.get(0).getName();
		Integer haha=0;
		int j=0;
		for(int i=0;i<province.size();i++){
			String cur = province.get(i).getName();
			if(cur.equals(bef)){
				haha+=province.get(i).getOtherNum();
			}
			else{
				StaffModel ttt= new StaffModel();
				ttt.setOtherNum(haha);
				ttt.setName(bef);
				proData.add(ttt);
				j++;
				haha=0;
				haha+=province.get(i).getOtherNum();
				bef=cur;
			}
		}

		StaffModel t= new StaffModel();
		t.setOtherNum(haha);
		t.setName(bef);
		proData.add(t);




		for(int i=0;i<list.size();i++){
			double cur=(double)list.get(i).getNum()/sum;
			list.get(i).setPercent(cur);

		}


		data.put("num",list);
		data.put("sTime", sTime);
		data.put("eTime", eTime);
		data.put("type", "RingChart");

		data.put("province", proData);
		return data;

		 //2017/4/6 临时需要同步getOutData的，所以原来代码暂时屏蔽

	}
	 2017/04/07 为了同步getOutData  原来代码暂时屏蔽
	*/
	public Map<String, Object> getInData(String sTime, String eTime){
		Map<String,Object> data = new HashMap<String,Object>();
		String stime=sTime+"-01-01 00:00:00";
		String etime=eTime+"-12-31 00:00:00";

		List<StaffModel> list = this.staff.selectIn(stime,etime);
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
				name = new ArrayList<String>();
				num=new ArrayList<Integer>();

				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());

			}

		}
		relaName.put(bef, name);
		relaNum.put(bef, num);
		
		Collections.sort(list);


		data.put("num",list);
		data.put("relaName", relaName);
		data.put("relaNum",relaNum);
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
				name = new ArrayList<String>();
				num=new ArrayList<Integer>();
				
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
					
			}

		}
		relaName.put(bef, name);
		relaNum.put(bef, num);
		
		Collections.sort(list);
		
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
		List<StaffModel> listReIn=this.staff.selectRelationshipPlus(stime, etime);
		

		
		
		for(int i=0;i<listOut.size();i++){
			double cur=0.0;
			String string=listOut.get(i).getName();
			
			for(int j=0;j<listIn.size();j++){
				if(listIn.get(j).getName().equals(string)){
					cur=(double)listIn.get(j).getNum()/listOut.get(i).getNum();					
					listOut.get(i).setOtherNum(listIn.get(j).getNum());
					listOut.get(i).setPercent(cur);
					listOut.get(i).setIsExist(false);
					listIn.get(j).setIsExist(false);
					break;
				}			
			}
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
				name = new ArrayList<String>();
				num=new ArrayList<Integer>();
				
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
					
			}

		}
		relaName.put(bef, name);
		relaNum.put(bef, num);
		
		
		
		for(int i =0 ;i<listIn.size();i++){
			if(listIn.get(i).getIsExist()){
				StaffModel c = new StaffModel();
				c.setName(listIn.get(i).getName());
				c.setOtherNum(listIn.get(i).getNum());
				c.setNum(0);
				c.setPercent(0.0);
				c.setIsExist(false);
				listOut.add(c);
				name = new ArrayList<String>();
				num=new ArrayList<Integer>();
				name.add("无");
				num.add(0);
				
				relaName.put(c.getName(), name);
				relaNum.put(c.getName(),num);
//				listIn.get(i).setIsExist(false);
			}
		}
		
		Map<String, Object> relaName2=new HashMap<String, Object>();
		Map<String, Object> relaNum2=new HashMap<String, Object>();
		List<String> name2=new ArrayList<String>();	
		List<Integer> num2=new ArrayList<Integer>();
		
		String bef2=listReIn.get(0).getName();
		String cur2;
		
		for(int i=0;i<listReIn.size();i++){
			cur2=listReIn.get(i).getName();
			if(cur2.equals(bef2)){
				name2.add(listReIn.get(i).getName2());
				num2.add(listReIn.get(i).getNum());
			}
			else{
				relaName2.put(bef2, name2);
				relaNum2.put(bef2, num2);
				
				bef2=cur2;
				name2=new ArrayList<String>();	
				num2=new ArrayList<Integer>();
				
				name2.add(listReIn.get(i).getName2());
				num2.add(listReIn.get(i).getNum());
					
			}

		}
		relaName2.put(bef2, name2);
		relaNum2.put(bef2, num2);
		for(int i =0 ;i<listOut.size();i++){
			if(listOut.get(i).getIsExist()){
				StaffModel c = new StaffModel();
				c.setName(listOut.get(i).getName());
				c.setOtherNum(listOut.get(i).getNum());
				c.setNum(0);
				c.setPercent(0.0);
				c.setIsExist(false);
				listIn.add(c);
				
				name2=new ArrayList<String>();	
				num2=new ArrayList<Integer>();
				name2.add("无");
				num2.add(0);
				
				relaName2.put(c.getName(), name2);
				relaNum2.put(c.getName(),num2);
			}
		}
		
		Collections.sort(listIn);
		Collections.sort(listOut);
	
		data.put("listIn", listIn);
		data.put("listOut", listOut);
		data.put("reName",relaName);
		data.put("reNum", relaNum);
		
		
		data.put("reName2",relaName2);
		data.put("reNum2", relaNum2);
		data.put("type","relation");
		data.put("sTime", sTime);
		data.put("eTime", eTime);
		return data;
		
//		Map<String,Object> data = new HashMap<String,Object>();
//		String stime=sTime+"-01-01 00:00:00";
//		String etime=eTime+"-12-31 00:00:00";
//		
//		List<StaffModel> listIn = this.staff.selectIn(stime,etime);
//		List<StaffModel> listOut = this.staff.selectOut(stime,etime);
//		List<StaffModel> listRe=this.staff.selectRelationship(stime, etime); 
//		List<StaffModel> listReIn=this.staff.selectRelationshipPlus(stime, etime);
//		
//		
//		
//	
//		
//		for(int i=0;i<listOut.size();i++){
//			double cur=0.0;
//			String string=listOut.get(i).getName();
//			boolean ok=true;
//			for(int j=0;j<listIn.size();j++){
//				if(listIn.get(j).getName().equals(string)){
//					cur=(double)listIn.get(j).getNum()/listOut.get(i).getNum();
//					
//					listOut.get(i).setOtherNum(listIn.get(j).getNum());
//					listOut.get(i).setPercent(cur);
//					ok=false;
//					break;
//				}			
//			}
//		}
//		
//		
//		Map<String, Object> relaName=new HashMap<String, Object>();
//		Map<String, Object> relaNum=new HashMap<String, Object>();
//		
//		
//		List<String> name=new ArrayList<String>();	
//		List<Integer> num=new ArrayList<Integer>();
//		
//		String bef=listRe.get(0).getName();
//		String cur;
//		
//		for(int i=0;i<listRe.size();i++){
//			cur=listRe.get(i).getName();
//			if(cur.equals(bef)){
//				name.add(listRe.get(i).getName2());
//				num.add(listRe.get(i).getNum());
//			}
//			else{
//				relaName.put(bef, name);
//				relaNum.put(bef, num);
//				
//				bef=cur;
//				name = new ArrayList<String>();
//				num=new ArrayList<Integer>();
//				
//				name.add(listRe.get(i).getName2());
//				num.add(listRe.get(i).getNum());
//					
//			}
//
//		}
//		relaName.put(bef, name);
//		relaNum.put(bef, num);
//		
//		
//		Map<String, Object> relaName2=new HashMap<String, Object>();
//		Map<String, Object> relaNum2=new HashMap<String, Object>();
//		List<String> name2=new ArrayList<String>();	
//		List<Integer> num2=new ArrayList<Integer>();
//		
//		String bef2=listReIn.get(0).getName();
//		String cur2;
//		
//		for(int i=0;i<listReIn.size();i++){
//			cur2=listReIn.get(i).getName();
//			if(cur2.equals(bef2)){
//				name2.add(listReIn.get(i).getName2());
//				num2.add(listReIn.get(i).getNum());
//			}
//			else{
//				relaName2.put(bef2, name2);
//				relaNum2.put(bef2, num2);
//				
//				bef2=cur2;
//				name2=new ArrayList<String>();	
//				num2=new ArrayList<Integer>();
//				
//				name2.add(listReIn.get(i).getName2());
//				num2.add(listReIn.get(i).getNum());
//					
//			}
//
//		}
//		relaName2.put(bef2, name2);
//		relaNum2.put(bef2, num2);
//		
//	
//		data.put("listIn", listIn);
//		data.put("listOut", listOut);
//		data.put("reName",relaName);
//		data.put("reNum", relaNum);
//		
//		
//		data.put("reName2",relaName2);
//		data.put("reNum2", relaNum2);
//		data.put("type","relation");
//		data.put("sTime", sTime);
//		data.put("eTime", eTime);
//		return data;
		
	}
	
	
	@Override
	public Map<String, Object> getCityTreeMapData(String sTime ,String eTime){
		Map<String,Object> data = new HashMap<String,Object>();
		String stime=sTime+"-01-01 00:00:00";
		String etime=eTime+"-12-31 00:00:00";
		
		List<StaffModel> listIn = this.staff.selectIn(stime,etime);
		List<StaffModel> listOut = this.staff.selectOut(stime,etime);
		List<StaffModel> listRe=this.staff.selectRelationship(stime, etime); 
		List<StaffModel> listReIn=this.staff.selectRelationshipPlus(stime, etime);
		
		
		
		
		for(int i=0;i<listOut.size();i++){
			double cur=0.0;
			String string=listOut.get(i).getName();
			
			for(int j=0;j<listIn.size();j++){
				if(listIn.get(j).getName().equals(string)){
					cur=(double)listIn.get(j).getNum()/listOut.get(i).getNum();					
					listOut.get(i).setOtherNum(listIn.get(j).getNum());
					listOut.get(i).setPercent(cur);
					listOut.get(i).setIsExist(false);
					listIn.get(j).setIsExist(false);
					break;
				}			
			}
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
				name = new ArrayList<String>();
				num=new ArrayList<Integer>();
				
				name.add(listRe.get(i).getName2());
				num.add(listRe.get(i).getNum());
					
			}

		}
		relaName.put(bef, name);
		relaNum.put(bef, num);
		
		
		
		for(int i =0 ;i<listIn.size();i++){
			if(listIn.get(i).getIsExist()){
				StaffModel c = new StaffModel();
				c.setName(listIn.get(i).getName());
				c.setOtherNum(listIn.get(i).getNum());
				c.setNum(0);
				c.setPercent(0.0);
				c.setIsExist(false);
				listOut.add(c);
				name = new ArrayList<String>();
				num=new ArrayList<Integer>();
				
				name.add("无");
				num.add(0);
				
				relaName.put(c.getName(), name);
				relaNum.put(c.getName(),num);
			}
		}
		
		Map<String, Object> relaName2=new HashMap<String, Object>();
		Map<String, Object> relaNum2=new HashMap<String, Object>();
		List<String> name2=new ArrayList<String>();	
		List<Integer> num2=new ArrayList<Integer>();
		
		String bef2=listReIn.get(0).getName();
		String cur2;
		
		for(int i=0;i<listReIn.size();i++){
			cur2=listReIn.get(i).getName();
			if(cur2.equals(bef2)){
				name2.add(listReIn.get(i).getName2());
				num2.add(listReIn.get(i).getNum());
			}
			else{
				relaName2.put(bef2, name2);
				relaNum2.put(bef2, num2);
				
				bef2=cur2;
				name2=new ArrayList<String>();	
				num2=new ArrayList<Integer>();
				
				name2.add(listReIn.get(i).getName2());
				num2.add(listReIn.get(i).getNum());
					
			}

		}
		relaName2.put(bef2, name2);
		relaNum2.put(bef2, num2);
		
		for(int i =0 ;i<listOut.size();i++){
			if(listOut.get(i).getIsExist()){
				StaffModel c = new StaffModel();
				c.setName(listOut.get(i).getName());
				c.setOtherNum(listOut.get(i).getNum());
				c.setNum(0);
				c.setPercent(0.0);
				c.setIsExist(false);
				listIn.add(c);
				name2=new ArrayList<String>();	
				num2=new ArrayList<Integer>();
				
				name2.add("无");
				num2.add(0);
				
				relaName2.put(c.getName(), name2);
				relaNum2.put(c.getName(),num2);
			}
		}
		
		Collections.sort(listIn);
		Collections.sort(listOut);
	
		data.put("listIn", listIn);
		data.put("listOut", listOut);
		data.put("reName",relaName);
		data.put("reNum", relaNum);
		
		
		data.put("reName2",relaName2);
		data.put("reNum2", relaNum2);
		data.put("type","treeMap");
		data.put("sTime", sTime);
		data.put("eTime", eTime);
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
		List<StaffModel> listOut = this.staff.selectOutAll();
		
		for(int i = 0;i<listOut.size();i++){
			String name=listOut.get(i).getName();
			String year = listOut.get(i).getYear();
			for(int j =0;j<listIn.size();j++){
				if(name.equals(listIn.get(j).getName())&&year.equals(listIn.get(j).getYear())){
					Integer num = listIn.get(j).getNum();
					Double per = (double)num/listOut.get(i).getNum();
					listOut.get(i).setOtherNum(num);
					listOut.get(i).setPercent(per);
					listIn.get(j).setIsExist(false);
				}
			}
		}
		
		data.put("allData", listOut);
		data.put("type", "allData");
		return data;
	
	}
	@Override
	public List<StaffModel> getDeveloped(List<StaffModel> cur){
		List<StaffModel> res = new ArrayList<StaffModel>();
		StaffModel tmp = new StaffModel();
		String[] dev={"广东省-广州市","广东省-深圳市","广东省-珠海市","广东省-佛山市","广东省-江门市","广东省-东莞市","广东省-中山市","广东省-惠州市","广东省-肇庆市","上海市","江苏省-南京市","浙江省-杭州市","安徽省-合肥市","北京市"};
		
		for(int i =0;i<cur.size();i++){
			String name = cur.get(i).getName();
			if(Arrays.asList(dev).contains(name)){
				res.add(cur.get(i));
				
			}
		}
		return res;
		
	}

}
