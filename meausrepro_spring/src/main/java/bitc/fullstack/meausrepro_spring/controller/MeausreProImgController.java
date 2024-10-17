package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.service.MeausreProImgService;
import bitc.fullstack.meausrepro_spring.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/MeausrePro/Img")
public class MeausreProImgController {

    @Autowired
    private MeausreProImgService meausreProImgService;

//    이미지 업로드
    @PostMapping("/upload/{sectionId}")
    public ResponseEntity<MeausreProImg> upload(
            @RequestParam("file") MultipartFile file,
            @PathVariable("sectionId") int sectionId
//            @RequestParam("description") String desc
    ) {

        MeausreProImg img = meausreProImgService.uploadImage(file, sectionId);
        if (img != null) {
            return ResponseEntity.ok(img);
        } else {
            return ResponseEntity.status(500).build();
        }
    }

    // 특정 구간 이미지 보기
    @GetMapping("/section/{sectionId}")
    public List<MeausreProImg> sectionImages(@PathVariable("sectionId") int sectionId) {
        return meausreProImgService.sectionImages(sectionId);
    }
}
