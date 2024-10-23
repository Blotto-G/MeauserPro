package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.model.MeausreProImg;
import bitc.fullstack.meausrepro_spring.service.ImgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/MeausrePro/Img")
public class ImgController {

    @Autowired
    private ImgService imgService;

    // 이미지 업로드
    @PostMapping("/upload/{sectionId}")
    public ResponseEntity<MeausreProImg> upload(
            @RequestParam("file") MultipartFile file,
            @PathVariable("sectionId") int sectionId
    ) {

        MeausreProImg img = imgService.uploadImage(file, sectionId);
        if (img != null) {
            return ResponseEntity.ok(img);
        } else {
            return ResponseEntity.status(500).build();
        }
    }

    // 특정 구간 이미지 보기
    @GetMapping("/section/{sectionId}")
    public List<MeausreProImg> sectionImages(@PathVariable("sectionId") int sectionId) {
        return imgService.sectionImages(sectionId);
    }

    // 이미지 다운로드
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String fileName) {
        try {
            // 파일 경로 설정 (uploads 디렉토리 또는 다른 경로)
            Path downloadPath = Paths.get("C:/fullstack405/MeausrePro/meausrepro_spring/image/" + fileName);
            Resource resource = new UrlResource(downloadPath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString());

                // Content-Disposition 헤더 설정
                HttpHeaders headers = new HttpHeaders();
                headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"");

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException | UnsupportedEncodingException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 이미지 설명 수정
    @PutMapping("/update")
    public ResponseEntity<String> updateImgDes(@RequestBody MeausreProImg image) {
        boolean isUpdate = imgService.updateImgDes(image);

        if (isUpdate) {
            return ResponseEntity.ok("Update");
        } else {
            return ResponseEntity.badRequest().body("수정에 실패했습니다.");
        }
    }

    // 이미지 삭제
    @DeleteMapping("/delete/{idx}")
    public ResponseEntity<String> deleteImage(@PathVariable int idx) {
        boolean isDeleted = imgService.deleteImage(idx);
        if (isDeleted) {
            return ResponseEntity.ok("이미지가 삭제되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("이미지 삭제에 실패했습니다.");
        }
    }
}
