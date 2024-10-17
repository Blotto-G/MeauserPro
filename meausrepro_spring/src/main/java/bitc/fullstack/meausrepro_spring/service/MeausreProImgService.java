package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import bitc.fullstack.meausrepro_spring.model.MeausreProInstrument;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.repository.MeausreProImgRepository;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class MeausreProImgService {

    @Autowired
    private MeausreProImgRepository meausreProImgRepository;

    private String uploadDir = System.getProperty("user.home") + "/Downloads/"; // 수정 필요

    @Autowired
    private SectionRepository sectionRepository;

    @Transactional
    public MeausreProImg uploadImage(MultipartFile file, int sectionId) {
        String fileName = file.getOriginalFilename();
        File uploadFile = new File(uploadDir + fileName);

        MeausreProSection section = sectionRepository.findByIdx(sectionId).get();

        try {
            file.transferTo(uploadFile);

            MeausreProImg img = new MeausreProImg();
            img.setSectionId(section);
            img.setImgSrc(uploadFile.getPath());
            img.setImgDes(null);

            return meausreProImgRepository.save(img);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // 특정 구간 이미지 보기
    public List<MeausreProImg> sectionImages(int sectionId) {
        return meausreProImgRepository.findAllBySectionId(sectionId);
    }
}
