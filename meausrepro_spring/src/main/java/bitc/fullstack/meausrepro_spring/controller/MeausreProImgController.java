package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import bitc.fullstack.meausrepro_spring.model.MeausreProSection;
import bitc.fullstack.meausrepro_spring.service.MeausreProImgService;
import bitc.fullstack.meausrepro_spring.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

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

    // 이미지 다운로드
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String fileName) throws MalformedURLException {
        try {
            // 파일 경로 설정 (uploads 디렉토리 또는 다른 경로)
            Path filePath = Paths.get("uploads/" + fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                // Content-Disposition 헤더 설정
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 이미지 설명 수정
    @PutMapping("/update")
    public ResponseEntity<String> updateImgDes(@RequestBody MeausreProImg image) {
        boolean isUpdate = meausreProImgService.updateImgDes(image);

        if (isUpdate) {
            return ResponseEntity.ok("Update");
        } else {
            return ResponseEntity.badRequest().body("수정에 실패했습니다.");
        }
    }
}
