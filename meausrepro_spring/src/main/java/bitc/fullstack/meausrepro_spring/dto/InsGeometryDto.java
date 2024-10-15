package bitc.fullstack.meausrepro_spring.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InsGeometryDto {
    private String insGeometryData;
    private int idx; // 계측기 번호

    // 생성자 추가
    public InsGeometryDto(String insGeometryData, int idx) {
        this.insGeometryData = insGeometryData;
        this.idx = idx;
    }

    // 기본 생성자 추가
    public InsGeometryDto() {
    }
}
