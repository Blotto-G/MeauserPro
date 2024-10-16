package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ManagementRepository extends JpaRepository<MeausreProManagement, String> {
    List<MeausreProManagement> findByInstr(MeausreProInstrument instr);
}