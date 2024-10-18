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
import java.util.Optional;

@Service
public class MeausreProImgService {

    @Autowired
    private MeausreProImgRepository meausreProImgRepository;

//    private String uploadDir = System.getProperty("user.home") + "/Downloads/";

    @Autowired
    private SectionRepository sectionRepository;

    @Transactional
    public MeausreProImg uploadImage(MultipartFile file, int sectionId) {
        String fileName = file.getOriginalFilename();
        File uploadDir = new File(System.getProperty("user.home") + "/Downloads/");

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        File uploadFile = new File(uploadDir + fileName);

        MeausreProSection section = sectionRepository.findByIdx(sectionId).get();

        try {
            file.transferTo(uploadFile);

            uploadFile.setReadable(true, false);

            // 서버 URL 생성 (정적 경로를 통해 접근할 수 있는 URL)
            String fileUrl = "http://localhost:8080/uploads/" + fileName;

            MeausreProImg img = new MeausreProImg();
            img.setSectionId(section);
            img.setImgSrc(fileUrl);
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

    // 이미지 설명 수정
    public boolean updateImgDes(MeausreProImg image) {
        Optional<MeausreProImg> existingImgDes = meausreProImgRepository.findByIdx(image.getIdx());
        if (existingImgDes.isPresent()) {
            MeausreProImg updatedImgDes = existingImgDes.get();
            updatedImgDes.setImgDes(image.getImgDes());
            meausreProImgRepository.save(updatedImgDes);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean deleteImage(int imageId) {
        Optional<MeausreProImg> imgOptional = meausreProImgRepository.findByIdx(imageId);

        if (imgOptional.isPresent()) {
            MeausreProImg img = imgOptional.get();
            File fileToDelete = new File(System.getProperty("user.home") + "/Downloads/" + img.getImgSrc().substring(img.getImgSrc().lastIndexOf("/") + 1));

            if (fileToDelete.exists()) {
                boolean deleted = fileToDelete.delete();
                if (!deleted) {
                    System.out.println("파일 삭제 실패: " + fileToDelete.getAbsolutePath());
                }
            }
            meausreProImgRepository.delete(img);
            return true;
        }
        return false;
    }
}


