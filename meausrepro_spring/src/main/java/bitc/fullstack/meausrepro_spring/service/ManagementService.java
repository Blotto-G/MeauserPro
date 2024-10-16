package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import bitc.fullstack.meausrepro_spring.repository.ManagementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagementService {
    @Autowired
    private ManagementRepository managementRepository;

    // 저장
    public MeausreProManagement save(MeausreProManagement management) {
        return managementRepository.save(management);
    }

    // 특정 계측기 그래프 보기
    public List<MeausreProManagement> insManagements(int instrId) {
        return managementRepository.findAllByInstrId(instrId);
    }
}