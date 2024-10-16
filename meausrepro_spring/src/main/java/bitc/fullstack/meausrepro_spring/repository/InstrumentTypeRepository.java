package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface InstrumentTypeRepository extends JpaRepository<MeausreProInsType, String> {
    // 계측기 삭제
    @Modifying
    @Transactional
    @Query("DELETE FROM MeausreProInsType s WHERE s.instrId.idx = :idx")
    void deleteByInsId(int idx);

    // 계측기 타입 조회
    @Query("SELECT s FROM MeausreProInsType s WHERE s.instrId.idx = :instrumentId")
    List<MeausreProInsType> findByInstrumentId(@Param("instrumentId") int instrumentId);
}