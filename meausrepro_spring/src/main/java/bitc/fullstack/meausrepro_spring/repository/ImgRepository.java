package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImgRepository extends JpaRepository<MeausreProImg, String> {
}
