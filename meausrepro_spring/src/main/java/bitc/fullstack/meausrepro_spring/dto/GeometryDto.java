package bitc.fullstack.meausrepro_spring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeometryDto {
    private String geometryData;
    private int idx; // 프로젝트 번호

    // 생성자 추가
    public GeometryDto(String geometryData, int idx) {
        this.geometryData = geometryData;
        this.idx = idx;
    }

    // 기본 생성자 추가
    public GeometryDto() {
    }
}
