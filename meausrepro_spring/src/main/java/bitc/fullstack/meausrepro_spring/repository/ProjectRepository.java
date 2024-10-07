package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<MeausreProProject, String> {
    // 프로젝트 번호로 해당 프로젝트 찾기
    @Query("SELECT p FROM  MeausreProProject  p WHERE p.idx = :idx")
    Optional<MeausreProProject> findByIdx(int idx);
    // 공사현장 검색
    @Query("SELECT p FROM MeausreProProject  p WHERE p.manager.id = :id AND p.siteName LIKE %:siteName%")
    List<MeausreProProject> searchSite(String id, String siteName);

    // 진행 중인 프로젝트 모두 보기
    @Query("SELECT p FROM MeausreProProject  p WHERE p.manager.id = :id AND p.siteCheck = 'N'")
    List<MeausreProProject> findAllByIdInProgress(String id);
}
