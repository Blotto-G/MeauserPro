package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InstrumentRepository extends JpaRepository<MeausreProInstrument, String> {
    // 특정 구간 계측기 보기
    @Query("SELECT p FROM MeausreProInstrument p WHERE p.sectionId.idx = :sectionId ORDER BY p.idx ASC")
    List<MeausreProInstrument> findAllBySectionId(int sectionId);

    // 계측기 번호로 해당 계측기 찾기
    @Query("SELECT p FROM  MeausreProInstrument  p WHERE p.idx = :idx")
    Optional<MeausreProInstrument> findByIdx(int idx);
}
