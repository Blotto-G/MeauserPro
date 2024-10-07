package bitc.fullstack.meausrepro_spring.controller;

import bitc.fullstack.meausrepro_spring.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/MeausrePro/Maps")
public class MeausreProController {
    @Autowired
    private ProjectService projectService;

    @RequestMapping({"", "/"})
    public String index() throws Exception {
        return "Spring server 접속";
    }
}
