package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProManType;
import bitc.fullstack.meausrepro_spring.repository.ManagementTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ManagementTypeService {
    @Autowired
    private ManagementTypeRepository manTypeRepository;

    // 저장
    public MeausreProManType save(MeausreProManType manType) {
        return manTypeRepository.save(manType);
    }

    // 조회
    public Optional<MeausreProManType> findByMaIdx(int maIdx) {
        return manTypeRepository.findById(String.valueOf(maIdx)); // 관리번호로 조회
    }
}