package org.scut.mychart.model;

/**
 * @author spiden
 *
 */
public class StaffModel {
	
	private String name;
	private Integer num;
	private String year;
	private String name2;
	private Double percent;
	private Integer otherNum;
	
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
	
	public void setOtherNum(Integer n){
		this.otherNum=n;
	}
	public void setName(String name){
		this.name=name;
		
	}
	public void setPercent(Double percent){
		this.percent=percent;
	}


}
