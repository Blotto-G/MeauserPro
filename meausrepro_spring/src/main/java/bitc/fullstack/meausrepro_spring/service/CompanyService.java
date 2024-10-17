package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProCompany;
import bitc.fullstack.meausrepro_spring.model.MeausreProProject;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.model.MeausreProUser;
import bitc.fullstack.meausrepro_spring.repository.CompanyRepository;
import bitc.fullstack.meausrepro_spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

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


    // 작업그룹 수정 시 필요
    public Optional<MeausreProCompany> findByIdx(int idx) {
        return companyRepository.findByIdx(idx);
    }

    // 작업그룹 수정
    public ResponseEntity<String> updateCompany(int idx, MeausreProCompany updateCompany) {
        Optional<MeausreProCompany> companyOptional = companyRepository.findByIdx(idx);
        if (companyOptional.isPresent()) {
            MeausreProCompany existingCompany = companyOptional.get();
            existingCompany.setCompany(updateCompany.getCompany());
            existingCompany.setCompanyName(updateCompany.getCompanyName());
            existingCompany.setCompanyIng(updateCompany.getCompanyIng());
            companyRepository.save(existingCompany);
            return ResponseEntity.ok("작업그룹 수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("작업그룹을 찾을 수 없습니다.");
        }
    }

    // 작업그룹 삭제
    public ResponseEntity<String> deleteCompany(int idx) {
        Optional<MeausreProCompany> companyOptional = companyRepository.findByIdx(idx);
        if (companyOptional.isPresent()) {
            MeausreProCompany company = companyOptional.get();

            // 작업그룹 속한 모든 사용자 삭제
            List<MeausreProUser> users = userRepository.findAllByCompanyIdx(company.getIdx());
            for (MeausreProUser user : users) {
                userService.deleteUser(user.getIdx());
            }

            // 작업그룹 삭제
            companyRepository.delete(company);
            return ResponseEntity.ok("작업그룹 삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("작업그룹을 찾을 수 없습니다.");
        }
    }
}