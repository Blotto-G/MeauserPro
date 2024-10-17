package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProCompany;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // 로그인
    public Optional<MeausreProUser> findById(String userId) {
        return userRepository.findByUserId(userId);
    }

    // 회원가입
    public MeausreProUser signUp(MeausreProUser signUpUser) {

        return userRepository.save(signUpUser);
    }

    // 아이디 중복 확인
    public int checkId(String id) {
        return userRepository.countById(id);
    }

    // 전체 관리자 겸 웹 관리자 제외 회원정보 보기
    public List<MeausreProUser> getNotTopManager() {
        return userRepository.findByAllNotTopManager();
    }

    // 비밀번호 확인
    public boolean checkPasswrod(String id, String password) {
        MeausreProUser user = userRepository.findByUserId(id).orElse(null);

        // 사용자가 존재하고 비밀번호가 일치하는지 확인
        return user != null && user.getPass().equals(password);
    }


    // 특정 작업그룹 사용자 보기
    public List<MeausreProUser> companyUsers(int companyIdx) {
        return userRepository.findAllByCompanyIdx(companyIdx);
    }

    // 회원정보 수정 시 필요
    public Optional<MeausreProUser> findByIdx(int idx) {
        return userRepository.findByIdx(idx);
    }

    // 회원정보 삭제
    public ResponseEntity<String> deleteUser(int idx) {
        Optional<MeausreProUser> UserOptional = userRepository.findByIdx(idx);
        if (UserOptional.isPresent()) {
            MeausreProUser user = UserOptional.get();
            userRepository.delete(user);
            return ResponseEntity.ok("회원정보 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원정보를 찾을 수 없습니다.");
        }
    }
}


