package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProInsType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstrumentTypeRepository extends JpaRepository<MeausreProInsType, String> {
}
