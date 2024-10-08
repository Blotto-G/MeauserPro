package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProCompany;
import bitc.fullstack.meausrepro_spring.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {
    @Autowired
    private CompanyRepository companyRepository;

    // 작업그룹 저장
    public MeausreProCompany saveCompany(MeausreProCompany company) {
        return companyRepository.save(company);
    }

    // 진행 중인 작업그룹 전체보기
    public List<MeausreProCompany> getNotDeleteCompany() {
        return companyRepository.findAllByNotDelete();
    }

    // 전체 작업그룹
    public List<MeausreProCompany> getAllCompany() {
        return companyRepository.findAll();
    }
}
