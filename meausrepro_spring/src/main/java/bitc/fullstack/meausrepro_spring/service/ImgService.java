package bitc.fullstack.meausrepro_spring.service;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.repository.ImgRepository;
import bitc.fullstack.meausrepro_spring.repository.SectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ImgService {
    @Autowired
    private ImgRepository imgRepository;

    @Autowired
    private SectionRepository sectionRepository;

    // 이미지 저장
    @Transactional
    public MeausreProImg uploadImage(MultipartFile file, int sectionId) {
        String fileName = file.getOriginalFilename();
        String uploadDirPath = "C:/fullstack405/MeausrePro/meausrepro_spring/image/";
        File uploadDir = new File(uploadDirPath);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        File uploadFile = new File(uploadDir, fileName);

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

            return imgRepository.save(img);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    // 특정 구간 이미지 보기
    public List<MeausreProImg> sectionImages(int sectionId) {
        return imgRepository.findAllBySectionId(sectionId);
    }

    // 이미지 설명 수정
    public boolean updateImgDes(MeausreProImg image) {
        Optional<MeausreProImg> existingImgDes = imgRepository.findByIdx(image.getIdx());
        if (existingImgDes.isPresent()) {
            MeausreProImg updatedImgDes = existingImgDes.get();
            updatedImgDes.setImgDes(image.getImgDes());
            imgRepository.save(updatedImgDes);
            return true;
        }
        return false;
    }

    // 이미지 삭제
    @Transactional
    public boolean deleteImage(int idx) {
        Optional<MeausreProImg> imgOptional = imgRepository.findByIdx(idx);

        if (imgOptional.isPresent()) {
            MeausreProImg img = imgOptional.get();

            String fileName = img.getImgSrc().substring(img.getImgSrc().lastIndexOf("/") + 1);
            File fileToDelete = new File("C:/fullstack405/MeausrePro/meausrepro_spring/image/" + fileName);

            if (fileToDelete.exists()) {
                boolean deleted = fileToDelete.delete();
                if (!deleted) {
                    System.out.println("파일 삭제 실패: " + fileToDelete.getAbsolutePath());
                }
            }
            imgRepository.delete(img);
            return true;
        }
        return false;
    }

    public void deleteBySectionIdx(int idx) {
        List<MeausreProImg> imgList = imgRepository.findAllBySectionId(idx);

        for (MeausreProImg img : imgList) {
            deleteImage(img.getIdx());
        }
    }
}
