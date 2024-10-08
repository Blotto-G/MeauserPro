package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProCompany;
import bitc.fullstack.meausrepro_spring.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
