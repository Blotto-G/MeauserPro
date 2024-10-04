package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="meausre_user")
public class MeausreProUser {
    @Id
    @Column(name="id", nullable = false, length = 45)
    private String id; // 아이디

    @Column(name = "pass", nullable = false, length = 45)
    private String pass; // 비밀번호

    @Column(name = "name", nullable = false, length = 45)
    private String name; // 이름

    @Column(name = "tel", nullable = false, length = 45)
    private String tel; // 전화번호

    @Column(name = "role", nullable = false, length = 1)
    private char role; // A: 총 책임자, B: 현장 관리자
}
