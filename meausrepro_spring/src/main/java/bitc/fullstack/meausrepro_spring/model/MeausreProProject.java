package bitc.fullstack.meausrepro_spring.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name="meaurse_project")
public class MeausreProProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idx", nullable = false)
    private int idx; // 프로젝트 번호

    @OneToMany(mappedBy = "projectId", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MeausreProSection> sections;

    @ManyToOne
    @JoinColumn(name="user_idx", nullable = false)
    private MeausreProUser userIdx; // 사용자 테이블

    @ManyToOne
    @JoinColumn(name="company_idx", nullable = true)
    private MeausreProCompany companyIdx;

    @Column(name = "site_name", nullable = false, length = 45)
    private String siteName; // 현장명

    @Column(name = "site_address", nullable = false, length = 45)
    private String siteAddress; // 주소

    @Column(name = "start_date", nullable = false, length = 45)
    private String startDate; // 시작 일자 (String 형식으로 저장)

    @Column(name = "end_date", nullable = false, length = 45)
    private String endDate; // 종료 일자

    @Column(name = "contractor", nullable = false, length = 45)
    private String contractor; // 시공사

    @Column(name = "measurer", nullable = false, length = 45)
    private String measurer; // 계측사

    @Column(name = "site_check", nullable = false, length = 1)
    private char siteCheck = 'N'; // 검사 종료 여부 (N: 진행, Y: 종료)

    @Column(name = "geometry", nullable = false, columnDefinition = "TEXT")
    private String geometry; // 지오매트리 정보 (지도에 표시될 영역)
}
