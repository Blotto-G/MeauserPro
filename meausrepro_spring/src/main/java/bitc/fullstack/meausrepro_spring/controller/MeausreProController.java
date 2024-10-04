package bitc.fullstack.meausrepro_spring.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:5173/"})
@RestController
@RequestMapping("/meausre")
public class MeausreProController {
    @RequestMapping({"", "/"})
    public String index() throws Exception {
        return "Spring server 접속";
    }
}
