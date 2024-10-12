package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InstrumentRepository extends JpaRepository<MeausreProInstrument, String> {
    // 특정 구간 계측기 보기
    @Query("SELECT i FROM MeausreProInstrument i WHERE i.sectionId.idx = :sectionId ORDER BY i.idx ASC")
    List<MeausreProInstrument> findAllBySectionId(int sectionId);

    // 프로젝트별 계측기 보기
    @Query("SELECT i FROM MeausreProInstrument i WHERE i.sectionId.projectId.idx = :projectId ORDER BY i.idx ASC")
    List<MeausreProInstrument> findAllByProjectId(int projectId);

    // 계측기 번호로 해당 계측기 찾기
    @Query("SELECT i FROM  MeausreProInstrument i WHERE i.idx = :idx")
    Optional<MeausreProInstrument> findByIdx(int idx);
}
