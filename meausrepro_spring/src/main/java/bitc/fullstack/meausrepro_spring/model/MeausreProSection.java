package bitc.fullstack.meausrepro_spring.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name="meausre_section")
public class MeausreProSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idx", nullable = false)
    private int idx; // 구간 번호

    @ManyToOne
    @JoinColumn(name="project_id", nullable = false)
    private MeausreProProject projectId; // 프로젝트 번호

    @OneToMany(mappedBy = "sectionId", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MeausreProInstrument> instruments;

    @Column(name="section_name", nullable = false, length = 45)
    private String sectionName; // 구간명

    @Column(name = "section_sta", nullable = false, length = 45)
    private String sectionSta; // 구간 위치

    @Column(name = "wall_str", nullable = false, length = 45)
    private String wallStr; // 벽체종

    @Column(name = "ground_str", nullable = false, length = 45)
    private String groundStr; // 지지종

    @Column(name = "rear_target", nullable = false, length = 45)
    private String rearTarget; // 대상물 배면

    @Column(name = "under_str", nullable = false, length = 45)
    private String underStr; // 대상물 도로하부

    @Column(name = "rep_img", nullable = true, length = 300)
    private String repImg; // 대표 이미지 (NULL 허용)
}
