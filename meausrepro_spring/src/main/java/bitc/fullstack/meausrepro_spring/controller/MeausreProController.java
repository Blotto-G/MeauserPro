package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/MeausrePro/Maps")
public class MeausreProController {
    @Autowired
    private ProjectService projectService;

    @RequestMapping({"", "/"})
    public String index() throws Exception {
        return "Spring server 접속";
    }

    @GetMapping("/geocode")
    public ResponseEntity<?> geocodeAddress(@RequestParam String query) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-NCP-APIGW-API-KEY-ID", "jxpgjljq8x");
            headers.set("X-NCP-APIGW-API-KEY", "EchwcWhTakyGy8hERIBUBr2exrtq7yugU2Ygs1Pd");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=" + query;

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("주소 검색 중 오류 발생");
        }
    }

}
