package cn.jintongsoft.kb.admin.tool;

import cn.jintongsoft.kb.api.db.NonSharedMaterial;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * 正则表达式验证
 *
 * @author trch
 */
@Component
public class RegularExpressionsTool {
    private static final String reg_identityCard1 = "^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$";
    private static final String reg_identityCard2 = "^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$";
    //	private static final String reg_email = "^\\s*\\w+(?:\\.{0,1}[\\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\\.[a-zA-Z]+\\s*$";
    private static final String reg_email = "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$";
    private static final String reg_number = "^[0-9]*$";
    private static final String reg_mobile = "^1[3458]\\d{9}$";
    private static final String reg_username = "^[A-Za-z0-9]{5,20}$";
    private static final String reg_password = "^.{6,20}$";
    private static final String reg_mobileOrPhone = "^(0[0-9]{2,3}\\-)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?$";
    private static final String reg_url = "((http|ftp|https)://)(([a-zA-Z0-9\\._-]+\\.[a-zA-Z]{2,6})|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\\&%_\\./-~-]*)?";

    /**
     * 身份证号码验证
     *
     * @param identityCard
     * @return
     */
    public static boolean validateIdentityCard(String identityCard) {
        if (identityCard.matches(reg_identityCard1)
            || identityCard.matches(reg_identityCard2)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 邮箱验证
     *
     * @param email
     * @return
     */
    public static boolean validateEmail(String email) {
        if (email.matches(reg_email)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断数字的正则表达式
     *
     * @param pattern
     * @return
     */
    public static boolean validateNumber(String pattern) {
        if (pattern.matches(reg_number)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 手机号验证
     *
     * @param mobile
     * @return
     */
    public static boolean validateMobile(String mobile) {
        if (mobile.matches(reg_mobile)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 手机号码或座机电话 如（区号-座机号码-分机号）
     *
     * @param phone
     * @return
     */
    public static boolean validateMobileOrPhone(String phone) {
        if (phone.matches(reg_mobileOrPhone) || phone.matches(reg_mobile)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 验证用户名
     *
     * @param username
     * @return
     */
    public static boolean validateUsername(String username) {
        if (username.matches(reg_username)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 密码验证
     *
     * @param password
     * @return
     */
    public static boolean validatePassword(String password) {
        if (password.matches(reg_password)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 网址验证
     *
     * @param url
     * @return
     */
    public static boolean validataUrl(String url) {
        return url.matches(reg_url);
    }

//    public static void validateUrl(NonSharedMaterial nonSharedMaterial) throws Exception {
//        Pattern pattern = Pattern.compile(
//            "((http|ftp|https)://)(([a-zA-Z0-9\\._-]+\\.[a-zA-Z]{2,6})|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}))(:[0-9]{1,4})*(/[a-zA-Z0-9\\&%_\\./-~-]*)?");
//        if (nonSharedMaterial.getLinkUrl() != null) {
//            String url = nonSharedMaterial.getLinkUrl();
//            if (!pattern.matcher(url).matches()) {
//                throw new Exception("链接格式不合法！");
//            }
//        }
//    }
}
