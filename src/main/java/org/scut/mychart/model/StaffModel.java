package org.scut.mychart.model;

import org.codehaus.groovy.runtime.dgmimpl.arrays.IntegerArrayGetAtMetaMethod;

/**
 * @author spiden
 *
 */
public class StaffModel implements Comparable<StaffModel> {
	
	private String name;
	private Integer num;
	private String year;
	private String name2;
	private Double percent;
	private Integer otherNum;
	boolean isExist = true;
	
	public String getName(){
		return name;
	}
	public String getName2(){
		return name2;
	}
	public Integer getNum(){
		return num;
	}
	public Integer getOtherNum(){
		return otherNum ;
	}
	public String getYear(){
		return year;
		
	}
	
	public Double getPercent(){
		return percent;
	}
	public boolean getIsExist(){
		return isExist;
	}
	
	public void setNum(Integer n){
		this.num=n;
	}
	public void setOtherNum(Integer n){
		this.otherNum=n;
	}
	public void setName(String name){
		this.name=name;
		
	}

	public void setName2(String name2){
		this.name2 = name2;
	}

	public void setPercent(Double percent){
		this.percent=percent;
	}
	
	public void setIsExist(boolean ok){
		isExist=ok;
		
	}
	public int compareTo(StaffModel arg0){
//		return this.getNum().compareTo(arg0.getNum());
		if(this.getNum()>arg0.getNum()){
			return -1;
		}else if(this.getNum()<arg0.getNum()){
			return 1;
		}
		else return 0;
	}

	public StaffModel simpleCopy(){ //仅仅复制year，num，name2，name
		StaffModel s2 = new StaffModel();
		s2.year = this.year;
		s2.name = this.name;
		s2.name2 = this.name2;
		s2.num = this.num;
		return s2;
	}

}
