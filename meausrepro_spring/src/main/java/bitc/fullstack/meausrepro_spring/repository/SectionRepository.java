package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionRepository extends JpaRepository<MeausreProSection, String> {
}
