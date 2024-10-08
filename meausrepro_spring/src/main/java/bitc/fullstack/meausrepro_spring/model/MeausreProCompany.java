package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="meausre_company")
public class MeausreProCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idx")
    private int idx; // 작업그룹 번호

    @Column(name="company", nullable = false, length = 45)
    private String company;

    @Column(name="company_name", nullable = false, length = 45)
    private String companyName;

    @Column(name="company_ing", nullable = false, length = 1)
    private char companyIng = 'Y'; // 진행 중인 작업 그룹
}
