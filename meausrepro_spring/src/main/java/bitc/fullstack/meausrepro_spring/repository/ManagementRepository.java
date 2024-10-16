package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ManagementRepository extends JpaRepository<MeausreProManagement, String> {
    // 특정 계측기 그래프 보기
    @Query("SELECT m FROM MeausreProManagement m WHERE m.instr_id.idx = :instrId ORDER BY m.idx ASC")
    List<MeausreProManagement> findAllByInstrId(int instrId);
}
