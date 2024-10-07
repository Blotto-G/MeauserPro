package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    // 로그인
    public Optional<MeausreProUser> findById(String id) {
        return userRepository.findById(id);
    }

    // 회원가입
    public MeausreProUser signUp(MeausreProUser signUpUser) {
        return  userRepository.save(signUpUser);
    }

    // 아이디 중복 확인
    public int checkId(String id) {
        return userRepository.countById(id);
    }
}
