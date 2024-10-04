package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManagementRepository extends JpaRepository<MeausreProManagement, String> {
}
