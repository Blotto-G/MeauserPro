package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeausreProImgRepository extends JpaRepository<MeausreProImg, Integer> {
    // 특정 구간 이미지 보기
    @Query("SELECT im FROM MeausreProImg im WHERE im.sectionId.idx = :sectionId ORDER BY im.idx ASC")
    List<MeausreProImg> findAllBySectionId(int sectionId);
}
