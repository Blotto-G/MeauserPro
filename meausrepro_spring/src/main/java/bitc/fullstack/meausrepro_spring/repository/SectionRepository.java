package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface SectionRepository extends JpaRepository<MeausreProSection, String> {
    // 특정 프로젝트 구간 보기
    @Query("SELECT s FROM MeausreProSection s WHERE s.projectId.idx = :projectId ORDER BY s.idx ASC")
    List<MeausreProSection> findAllByProjectId(int projectId);

    // 번호로 구간 찾기 -> 구간 수정시 필요
    @Query("SELECT s FROM MeausreProSection s WHERE s.idx = :idx")
    Optional<MeausreProSection> findByIdx(int idx);

    // 프로젝트 삭제 시 구간도 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM MeausreProSection s WHERE s.projectId.idx = :projectIdx")
    void deleteByProjectId(int projectIdx);
}
