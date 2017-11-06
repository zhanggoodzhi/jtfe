package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.cloud.bean.UserGet;

import cn.jintongsoft.cloud.bean.UserSearch;
import cn.jintongsoft.cloud.service.AdminUserService;
import cn.jintongsoft.kb.admin.bean.UserOutPut;
import cn.jintongsoft.kb.admin.bean.UserPostAll;
import cn.jintongsoft.kb.admin.bean.UserPut;
import cn.jintongsoft.kb.api.ReviewOrderService;
import cn.jintongsoft.kb.api.RolePrivilegeService;
import cn.jintongsoft.kb.api.db.*;
import cn.jintongsoft.kb.api.tool.Page;
import cn.jintongsoft.kb.api.tool.Pageable;
import com.alibaba.dubbo.config.annotation.Reference;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

/**
 * Created by Liu on 2017/1/22.
 */
@Controller
@RequestMapping("/api/member")
@Slf4j
public class MemberManagerController {

	@Reference
	private RolePrivilegeService rolePrivilegeService;

	@Reference
	private AdminUserService adminUserService;

	@Reference
	ReviewOrderService reviewOrderService;

	/**
	 * 成员管理主页
	 *
	 * @param model
	 * @param session
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/index")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public String actionIndex(ModelMap model, HttpSession session) throws Exception {
		List<RoleGetPut> roles = rolePrivilegeService.listOfRole();
		List<PrivilegeGet> privileges = rolePrivilegeService.listOfPrivilege();
		model.addAttribute("roles", roles);
		model.addAttribute("privileges", privileges);
		return "member/index/index";
	}

	/**
	 * 成员列表分页
	 *
	 * @param search
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/user/page")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public Page<UserOutPut> actionPageUser(UserSearch search, @SessionAttribute("appid") int appid,
			@RequestParam(value = "roleids", required = false) List<Long> roleids) throws Exception {
		// TODO 从云平台获取所有用户数据
		// TODO 通过用户ID集合以及角色条件限制获取对应角色信息
		int end = search.getPage() * search.getSize();
		// 筛选用户状态为启用：1的用户
		search.setStatus(1);
		List<UserGet> gets = adminUserService.listOfUserNoPage(search, appid);
		List<Integer> userids = new ArrayList<>();
		Map<String, UserOutPut> usermap = new HashMap<>();
		List<UserOutPut> outs = new ArrayList<>();
		;
		for (UserGet userGet : gets) {
			UserOutPut target = new UserOutPut();
			BeanUtils.copyProperties(userGet, target);
			Integer uid = userGet.getId();
			userids.add(uid);
			usermap.put(uid.toString(), target);
		}
		// Integer roleid = search.getRoleid();
		if (roleids == null) {
			List<UserRoleRelGet> rels = rolePrivilegeService.listOfRole(userids, null);
			for (UserRoleRelGet userRoleRelGet : rels) {
				Integer userid = userRoleRelGet.getUserid();
				List<RoleSimple> roles = userRoleRelGet.getRoles();
				if (userid != null && outs.size() <= end) {
					UserOutPut target = usermap.get(userid.toString());
					target.setRoles(roles);
					outs.add(target);
				}
			}
		}
		if (roleids != null) {
			for (Long roleid : roleids) {
				List<UserRoleRelGet> rels = rolePrivilegeService.listOfRole(userids, roleid);
				for (UserRoleRelGet userRoleRelGet : rels) {
					Integer userid = userRoleRelGet.getUserid();
					List<RoleSimple> roles = userRoleRelGet.getRoles();
					UserOutPut target = usermap.get(userid.toString());
					target.setRoles(roles);
					if (outs.size() <= end) {
						outs.add(target);
					}
				}
			}
		}
		int index = search.getPage() - 1;
		// List<UserOutPut> contents = outs.subList(index,end);
		Page<UserOutPut> page = new Page<UserOutPut>();
		page.setContent(outs);
		page.setTotal(outs.size());
		page.setPageable(new Pageable(search.getPage(), search.getSize()));
		return page;
	}

	/**
	 * 获取除去审核流以外的所有成员信息
	 */
	@ResponseBody
	@GetMapping("/user/listAll")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public List<UserGet> actionListAllUser(@SessionAttribute("appid") int appid) throws Exception {
		UserSearch search = new UserSearch();
		List<UserGet> gets = adminUserService.listOfUserNoPage(search, appid);
		List<ReviewOrderGet> reviewOrderGetList = reviewOrderService.listReviewOrder(appid);
		List<UserGet> getsNeedDel = new ArrayList<>();
		for (ReviewOrderGet rOrderGet : reviewOrderGetList) {
            for(UserGet userGet:gets){
                if(Objects.equals(userGet.getId(), rOrderGet.getUserid())){
                    gets.remove(userGet);
                    break;
                }
            }
        }
//			UserGet userGet = adminUserService.getUser(rOrderGet.getUserid());
////			getsNeedDel.add(userGet);
//            gets.removeIndividual(userGet);
//            break;
//		}
//		gets.removeAll(getsNeedDel);

		return gets;
	}

	/**
	 * 通过用户id数组获取对应用户信息
	 *
	 * @param userids
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/user/list")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public List<UserGet> actionListUser(@RequestParam(value = "userids") Integer[] userids) throws Exception {
		return adminUserService.listOfUser(Arrays.asList(userids));
	}

	/**
	 * 创建用户,之后建立用户与角色之间的关系
	 *
	 * @param postAll
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PostMapping("/user/create")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public UserOutPut actionCreateUser(@RequestBody UserPostAll postAll, @SessionAttribute("appid") int appid)
			throws Exception {
		UserGet get = adminUserService.createUser(postAll, appid);
		if (get == null || get.getId() == null){
            throw new Exception("云平台接口返回的user为空");
        }
		List<RoleSimple> roles = null;
		List<Long> roleIds = postAll.getRoleids();
		if (roleIds != null && !roleIds.isEmpty()) {
			roles = rolePrivilegeService.modifyUserRoleRel(get.getId(), roleIds);
		}
		UserOutPut target = new UserOutPut();
		BeanUtils.copyProperties(get, target);
		target.setRoles(roles);
		return target;
	}

	/**
	 * 更新用户
	 *
	 * @param put
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PutMapping("/user/update")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public UserOutPut actionUpdateUser(@RequestBody UserPut put,
			@RequestParam(value = "oldPassword", required = true) String oldPassword,
			@RequestParam(value = "roleids", required = false) List<Long> roleids) throws Exception {

		// MD5加密2次
		String password = DigestUtils
				.md5DigestAsHex(DigestUtils.md5DigestAsHex(put.getPassword().getBytes()).getBytes());
		oldPassword = DigestUtils.md5DigestAsHex(DigestUtils.md5DigestAsHex(oldPassword.getBytes()).getBytes());
		boolean ispassword = adminUserService.checkPwd(put.getId(), oldPassword);
		if (!ispassword) {
			throw new Exception("输入密码密码有误，请重新输入");
		}
		put.setPassword(password);
		UserGet get = adminUserService.updateUser(put);
		// List<Integer> roleids = put.getRoleids();
		List<RoleSimple> roles = null;
		if (roleids != null && !roleids.isEmpty()) {
			roles = rolePrivilegeService.modifyUserRoleRel(get.getId(), roleids);
		}
		UserOutPut target = new UserOutPut();
		BeanUtils.copyProperties(get, target);
		target.setRoles(roles);
		return target;
	}

	/**
	 * 更新用户无需验证密码
	 *
	 * @param put
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PutMapping("/user/updateSimple")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public UserOutPut actionUpdateUserNoPassword(@RequestBody UserPut put) throws Exception {
		// MD5加密2次
		String password = DigestUtils
				.md5DigestAsHex(DigestUtils.md5DigestAsHex(put.getPassword().getBytes()).getBytes());
		put.setPassword(password);
		UserGet get = adminUserService.updateUser(put);
		// List<Integer> roleids = put.getRoleids();
		List<RoleSimple> roles = null;
		if (put.getRoleids() != null && !put.getRoleids().isEmpty()) {
			roles = rolePrivilegeService.modifyUserRoleRel(get.getId(), put.getRoleids());
		}
		UserOutPut target = new UserOutPut();
		BeanUtils.copyProperties(get, target);
		target.setRoles(roles);
		return target;
	}

	/**
	 * 删除用户
	 *
	 * @param userid
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@DeleteMapping("/user/delete")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public ResponseEntity<?> actionDeleteUser(@RequestParam(value = "userid") Integer userid) throws Exception {
        UserGet userGet=adminUserService.getUser(userid);
		adminUserService.deleteUser(userid);
		rolePrivilegeService.deleteRoleByUserId(userid);
		return ResponseEntity.ok(userGet);
	}

	/**
	 * 获取所有角色
	 *
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/role/list")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public List<RoleGetPut> actionGetRolePrivileges() throws Exception {
		return rolePrivilegeService.listOfRole();
	}

	/**
	 * 获取角色所有权限
	 *
	 * @param roleid
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@GetMapping("/role/privileges")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public List<PrivilegeGet> actionGetRolePrivileges(@RequestParam(value = "roleid") Long roleid) throws Exception {
		return rolePrivilegeService.listOfRolePrivilege(roleid);
	}

	/**
	 * 创建角色，前端注意存在角色选择下拉框的页面，需要维护角色数据
	 *
	 * @param post
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PostMapping("/role/create")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public RoleGetPut actionCreateRole(@RequestBody RolePost post) throws Exception {
		RoleGetPut get = rolePrivilegeService.createRole(post);
		return get;
	}

	/**
	 * 更新角色，前端注意存在角色选择下拉框的页面，需要维护角色数据
	 *
	 * @param put
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PutMapping("/role/update")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public RoleGetPut actionUpdateRole(@RequestBody RoleGetPut put) throws Exception {
		RoleGetPut get = rolePrivilegeService.updateRole(put);
		return get;
	}

	/**
	 * 删除某角色，前端注意存在角色选择下拉框的页面，需要维护角色数据
	 *
	 * @param roleid
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@DeleteMapping("/role/delete")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public ResponseEntity<?> actionDeleteRole(@RequestParam(value = "roleid") Long roleid) throws Exception {
        RoleGetPut roleGetPut=rolePrivilegeService.getRole(roleid);
		rolePrivilegeService.deleteRole(roleid);
		return ResponseEntity.ok(roleGetPut);
	}

	/**
	 * 某角色修改权限
	 *
	 * @param roleid
	 * @param privileges
	 * @return
	 * @throws Exception
	 */
	@ResponseBody
	@PostMapping("/privilege/modify")
	@PreAuthorize("hasRole('MANIPULATION_ROLE_AND_PRIVILEGE')")
	public ResponseEntity<?> actionModifyPrivilege(@RequestParam(value = "roleid") Long roleid,
			@RequestParam(value = "privileges") List<Long> privileges) throws Exception {
		rolePrivilegeService.modifyPrivilege(roleid, privileges);
        List<PrivilegeGet> privilegeGetList=rolePrivilegeService.listOfRolePrivilege(roleid);
		return ResponseEntity.ok(privilegeGetList);
	}

}
