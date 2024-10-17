package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProCompany;
import bitc.fullstack.meausrepro_spring.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/MeausrePro/Company")
public class CompanyController {
    @Autowired
    private CompanyService companyService;

    // 작업그룹 저장
    @PostMapping("/SaveCompany")
    public MeausreProCompany saveCompany(@RequestBody MeausreProCompany company) {
        return companyService.saveCompany(company);
    }

    // 작업그룹 전체 보기
    @GetMapping("/all")
    public List<MeausreProCompany> getAllCompany() {
        return companyService.getAllCompany();
    }
    // 작업그룹 전체 보기 (삭제 x)
    @GetMapping("/allCompany/notDelete")
    public List<MeausreProCompany> getNotDeleteCompany() {
        return companyService.getNotDeleteCompany();
    }


    // 특정 작업그룹 데이터 보기 (수정)
    @GetMapping("/getCompany/{idx}")
    public ResponseEntity<MeausreProCompany> getCompanyById(@PathVariable("idx") int idx) {
        Optional<MeausreProCompany> companyOptional = companyService.findByIdx(idx);
        if (companyOptional.isPresent()) {
            MeausreProCompany company = companyOptional.get();
            return ResponseEntity.ok(company);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 작업그룹 수정
    @PutMapping("/update/{idx}")
    public ResponseEntity<String> updateCompany(@PathVariable("idx") int idx, @RequestBody MeausreProCompany updateCompany) {
        Optional<MeausreProCompany> companyOptional = companyService.findByIdx(idx);

        if (companyOptional.isPresent()) {
            MeausreProCompany existingCompany = companyOptional.get();

            existingCompany.setCompany(updateCompany.getCompany());
            existingCompany.setCompanyName(updateCompany.getCompanyName());
            existingCompany.setCompanyIng(updateCompany.getCompanyIng());

            companyService.saveCompany(existingCompany);

            return ResponseEntity.ok("작업그룹 수정 완료");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("작업그룹 수정에 실패하였습니다.");
        }
    }

    // 작업그룹 삭제
    @DeleteMapping("/delete/{idx}")
    public ResponseEntity<String> deleteCompany(@PathVariable("idx") int idx) {
        return companyService.deleteCompany(idx);
    }
}