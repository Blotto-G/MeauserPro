package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class SectionService {
    @Autowired
    private SectionRepository sectionRepository;

    // 구간 저장
    public ResponseEntity<String> saveSection(@RequestBody MeausreProSection section) {
        sectionRepository.save(section);

        return ResponseEntity.ok("Saved");
    }

    // 특정 프로젝트 구간 보기
    public List<MeausreProSection> projectSections(int projectId) {
        return sectionRepository.findAllByProjectId(projectId);
    }

    // 구간 수정
    public boolean updateSection(MeausreProSection section) {
        Optional<MeausreProSection> existingSection = sectionRepository.findByIdx(section.getIdx());
        if (existingSection.isPresent()) {
            MeausreProSection updatedSection = existingSection.get();
            updatedSection.setSectionName(section.getSectionName());
            updatedSection.setSectionSta(section.getSectionSta());
            updatedSection.setWallStr(section.getWallStr());
            updatedSection.setGroundStr(section.getGroundStr());
            updatedSection.setRearTarget(section.getRearTarget());
            updatedSection.setUnderStr(section.getUnderStr());
            sectionRepository.save(updatedSection);
            return true;
        }
        return false;
    }

    // 구간 삭제
    public boolean deleteSection(int idx) {
        Optional<MeausreProSection> section = sectionRepository.findById(String.valueOf(idx));
        if (section.isPresent()) {
            sectionRepository.deleteById(String.valueOf(idx));
            return true;
        }
        return false;
    }
}
