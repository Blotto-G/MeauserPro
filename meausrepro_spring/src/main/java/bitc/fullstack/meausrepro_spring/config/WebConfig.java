package bitc.fullstack.meausrepro_spring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    //    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // "uploads/" 경로를 외부 URL로 매핑
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:" + System.getProperty("user.home") + "/Downloads/");
//    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // "uploads/" 경로를 외부 URL로 매핑
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + System.getProperty("user.home") + "/Downloads/");
    }
}
