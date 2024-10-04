package bitc.fullstack.meausrepro_spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GeometryDto {
    private Long id;
    private String geometryData;
}
