package cn.jintongsoft.kb.admin.controller;

import cn.jintongsoft.cloud.bean.UserGet;
import cn.jintongsoft.cloud.exception.AdminUserServiceException;
import cn.jintongsoft.cloud.service.AdminUserService;
import cn.jintongsoft.kb.api.ReviewOrderService;
import cn.jintongsoft.kb.api.db.ReviewOrderGet;
import cn.jintongsoft.kb.api.exception.ReviewOrderServiceException;
import com.alibaba.dubbo.config.annotation.Reference;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("/api/review/order")
public class ReviewOrderController {

    @Reference
    private ReviewOrderService reviewOrderService;

    @Reference
    private AdminUserService adminUserService;

    /**
     * 获取审核流数据
     *
     * @return
     * @throws ReviewOrderServiceException
     */
    @ResponseBody
    @GetMapping("/list")
    public List<ReviewOrderGet> actionList(@SessionAttribute("appid") int appid) throws ReviewOrderServiceException {
        List<ReviewOrderGet> list = reviewOrderService.listReviewOrder(appid);
        List<ReviewOrderGet> rlist = new ArrayList<>();
        try {
            for (ReviewOrderGet user : list){
                // TODO 根据用户ID获取云平台用户信息
                UserGet u = adminUserService.getUser(user.getUserid());
                user.setUsername(u.getAlias());
                rlist.add(user);
            }
        } catch (AdminUserServiceException e) {
            throw new ReviewOrderServiceException(e.getMessage(),e);
        }
        return rlist;
    }


    /**
     * 新增审核者
     *
     * @return
     */
    @ResponseBody
    @PostMapping("/add")
    @PreAuthorize("hasRole('MANIPULATION_REVIEW_ORDER_DATA')")
    public ReviewOrderGet actionAdd(@SessionAttribute("appid") int appid, @RequestParam(value = "userid") Integer userid) throws ReviewOrderServiceException {
        ReviewOrderGet get = reviewOrderService.appendReviewer(userid, appid);
        // todo complete
        // reviewOrderGet.setUsername();
        return get;
    }


    /**
     * 删除审核者
     *
     * @param userid
     * @return
     */
    @ResponseBody
    @PostMapping("/delete")
    @PreAuthorize("hasRole('MANIPULATION_REVIEW_ORDER_DATA')")
    public ResponseEntity<?> actionDelete(@SessionAttribute("appid") int appid, @RequestParam(value = "userid") Integer userid) throws ReviewOrderServiceException {
        reviewOrderService.deleteReviewer(userid, appid);
        return ResponseEntity.ok().build();
    }

	/*@ResponseBody
	@PutMapping("/swap")
	public ResponseEntity<?> actionSwap(@SessionAttribute("appid") int appid,
			@RequestParam(value = "type", required = true) Integer type,
			@RequestParam(value = "userid", required = true) Integer userid) throws ReviewOrderServiceException {
		if(type == 1) {
            reviewOrderService.moveUpReviewer(userid, appid);
        } else{
            reviewOrderService.moveDownReviewer(userid, appid);
        }
		return ResponseEntity.ok().build();
	}*/

    @ResponseBody
    @PutMapping("/swap")
    @PreAuthorize("hasRole('MANIPULATION_REVIEW_ORDER_DATA')")
    public ResponseEntity<?> actionSwap(@SessionAttribute("appid") int appid,
                                        @RequestParam(value = "userids") Integer[] userids) throws ReviewOrderServiceException {
        reviewOrderService.moveReviewer(Arrays.asList(userids), appid);
        return ResponseEntity.ok().build();
    }

}
