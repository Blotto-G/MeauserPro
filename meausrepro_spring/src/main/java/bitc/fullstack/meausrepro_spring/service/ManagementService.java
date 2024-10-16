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

    // 조회
    public List<MeausreProManagement> findByInstrument(int instrIdx) {
        MeausreProInstrument instrument = new MeausreProInstrument();
        instrument.setIdx(instrIdx); // 계측기 ID 설정
        return managementRepository.findByInstr(instrument); // 해당 계측기와 관련된 관리 정보 반환
    }
}