package bitc.fullstack.meausrepro_spring.repository;

import bitc.fullstack.meausrepro_spring.model.MeausreProCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CompanyRepository extends JpaRepository<MeausreProCompany, String> {
    // 삭제되지 않은 작업그룹 전체보기
    @Query("SELECT c FROM MeausreProCompany c WHERE c.companyIng = 'Y'")
    List<MeausreProCompany> findAllByNotDelete();
}
