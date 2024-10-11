package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MapsInsGeometryRepository extends JpaRepository<MeausreProInstrument, Integer> {

}
