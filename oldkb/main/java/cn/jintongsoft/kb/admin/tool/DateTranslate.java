package cn.jintongsoft.kb.admin.tool;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateTranslate {
	private static SimpleDateFormat formatTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd");
	private static String startTimeOfOneDay = " 00:00:00";
    private static String endTimeOfOneDay = " 23:59:59";

    public static Date getStartTimeOfOneDay(String str){
        if(str == null || str.isEmpty()) return null;
        Date date = null;
        try {
            date = formatTime.parse(str + startTimeOfOneDay);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    public static Date getEndTimeOfOneDay(String str){
        if(str == null || str.isEmpty()) return null;
        Date date = null;
        try {
            date = formatTime.parse(str + endTimeOfOneDay);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

	/**
	 * Date->String yyyy-MM-dd HH:mm:ss
	 * @param date
	 * @return
	 */
	public static String dateToStringDate(Date date) {
		String str = null;
		str = formatTime.format(date);
		return str;
	}

	/**
	 * String->Date yyyy-MM-dd HH:mm:ss
	 * @param str
	 * @return
	 */
	public static Date stringDateToDate(String str) {
		Date date = null;
		try {
			date = formatTime.parse(str);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * Date->String yyyy-MM-dd
	 * @param date
	 * @return
	 */
	public static String dateToStringDay(Date date) {
		String str = null;
		str = formatDate.format(date);
		return str;
	}

	/**
	 * String->Date yyyy-MM-dd
	 * @param str
	 * @return
	 */
	public static Date stringDayToDate(String str) {
		Date date = null;
		try {
			date = formatDate.parse(str);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}

	/**
	 * 获取当前Timestamp
	 * @return
	 */
	public static Timestamp getNowTime(){
        Timestamp time = new Timestamp(new java.util.Date().getTime());
        time.setNanos(0);
        return time;
	}
}
