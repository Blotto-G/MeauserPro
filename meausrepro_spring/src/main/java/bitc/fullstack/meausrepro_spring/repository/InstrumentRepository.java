package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InstrumentRepository extends JpaRepository<MeausreProInstrument, String> {
    // 특정 구간 계측기 보기
    @Query("SELECT s FROM MeausreProInstrument s WHERE s.sectionId.idx = :sectionId ORDER BY s.idx ASC")
    List<MeausreProInstrument> findAllBySectionId(int sectionId);
}
