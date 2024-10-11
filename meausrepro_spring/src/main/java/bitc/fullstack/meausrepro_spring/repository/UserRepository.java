package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<MeausreProUser, String> {
    // 로그인
    @Query("SELECT u FROM MeausreProUser u WHERE u.id = :userId")
    Optional<MeausreProUser> findByUserId(String userId);

    // 아이디 중복 체크
    @Query("SELECT COUNT(u.id) FROM MeausreProUser u WHERE u.id = :id")
    int countById(String id);

    // 전체 관리자 겸 웹 관리자 제외 회원정보 보기
    @Query("SELECT u FROM MeausreProUser u WHERE u.topManager is null")
    List<MeausreProUser> findByAllNotTopManager();

    // 회원 정보 수정 시 필요
    @Query("SELECT u FROM MeausreProUser u WHERE u.idx = :idx")
    Optional<MeausreProUser> findByIdx(int idx);
}
