package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProManType;
import bitc.fullstack.meausrepro_spring.repository.ManagementTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManagementTypeService {
    @Autowired
    private ManagementTypeRepository manTypeRepository;

    // 저장
    public MeausreProManType save(MeausreProManType manType) {
        return manTypeRepository.save(manType);
    }
}