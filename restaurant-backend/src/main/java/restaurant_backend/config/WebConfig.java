package restaurant_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.menu-dir}")
    private String uploadDirectory;

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {

        Path imagePath = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/uploads/menu/**")
                .addResourceLocations(
                        imagePath.toUri().toString()
                );
    }
}