package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/MeausrePro/User")
public class UserController {
    @Autowired
    private UserService userService;

    // 로그인
    @PostMapping("/login")
    public MeausreProUser login(@RequestBody MeausreProUser loginUser) {
        System.out.println("\n" + loginUser.getId() + "\n");
        Optional<MeausreProUser> user = userService.findById(loginUser.getId());

        if (user.isPresent()) {
            if (user.get().getPass().equals(loginUser.getPass())) {
                return user.get();
            }
            else {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
            }
        } else {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
    }

    // 아이디 중복 확인
    @PostMapping("/checkId/{id}")
    public boolean checkId(@PathVariable String id) {
        return userService.checkId(id) == 0;
    }

    // 회원가입
    @PostMapping("/SignUp")
    public MeausreProUser signUp(@RequestBody MeausreProUser signUpUser) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
        String formattedDate = sdf.format(new Date());

        signUpUser.setCreateDate(formattedDate);
        return userService.signUp(signUpUser);
    }

    // 전체 관리자 겸 웹 관리자 제외 회원정보 보기
    @GetMapping("/notTopManager")
    public List<MeausreProUser> getNotTopManager() {
        List<MeausreProUser> users = userService.getNotTopManager();
        System.out.println("\n" + users.size());
        return users;
    }
}
