package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 계측기 기본 정보
@Getter
@Setter
@Entity
@Table(name="meausre_instrument")
public class MeausreProInstrument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private int idx; // 계측기 번호

    @ManyToOne
    @JoinColumn(name="section_id", nullable = false)
    private MeausreProSection sectionId; // 구간 번호

    @Column(name="ins_type", nullable = false)
    private char insType; // 계측기 종류

    @Column(name = "ins_num", nullable = false, length = 45)
    private String insNum; // 계측기 관리 번호

    @Column(name = "ins_name", length = 45)
    private String insName; // 제품명

    @Column(name = "ins_no", length = 45)
    private String insNo; // 시리얼 NO

    @Column(name = "ins_geometry", nullable = false)
    private String insGeometry;  // 지오메트리 정보

    @Column(name = "create_date", nullable = false, length = 45)
    private String createDate; // 설치일자

    @Column(name = "ins_location", nullable = false, length = 45)
    private String insLocation; // 설치 위치

    @Column(name = "measurement_1")
    private Double measurement1; // 관리기준치 1차

    @Column(name = "measurement_2")
    private Double measurement2; // 관리기준치 2차

    @Column(name = "measurement_3")
    private Double measurement3; // 관리기준치 3차

    @Column(name = "vertical_plus", nullable = false)
    private Double verticalPlus; // 수직변위 Y+

    @Column(name = "vertical_minus", nullable = false)
    private Double verticalMinus; // 수직변위 Y-

}
