package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="meausre_user")
public class MeausreProUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idx")
    private int idx; // 사용자 테이블 번호

    @ManyToOne
    @JoinColumn(name = "company_idx",nullable = true)
    private MeausreProCompany companyIdx;

    @Column(name="id", nullable = false, length = 45)
    private String id; // 아이디

    @Column(name = "pass", nullable = false, length = 45)
    private String pass; // 비밀번호

    @Column(name = "name", nullable = false, length = 45)
    private String name; // 이름

    @Column(name = "tel", nullable = false, length = 45)
    private String tel; // 전화번호

    @Column(name="role", nullable = false, length = 1)
    private String role; // 역할 0 = 웹, 1 = 앱

    @Column(name="top_manager", nullable = true, length = 1)
    private String topManager; // 최고 관리자

    @Column(name="create_date", nullable = false, length = 45)
    private String createDate;
}
