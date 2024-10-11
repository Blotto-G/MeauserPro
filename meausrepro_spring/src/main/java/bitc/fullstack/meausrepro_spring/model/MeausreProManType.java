package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 계측기 관리 정보 타입별
@Getter
@Setter
@Entity
@Table(name="meausre_management_type")
public class MeausreProManType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private int idx; // 글 번호

    @OneToOne
    @JoinColumn(name="ma_idx", nullable = false)
    private MeausreProManagement maIdx; // 관리 번호

    @Column(name = "gage_1")
    private Double gage1; // 측정값 1

    @Column(name = "gage_2")
    private Double gage2; // 측정값 2

    @Column(name = "gage_3")
    private Double gage3; // 측정값 3

    @Column(name = "gage_4")
    private Double gage4; // 측정값 4

    @Column(name = "in_name", length = 45)
    private String inName;  // 계측기

    @Column(name = "bs")
    private Double bs; // B.S

    @Column(name = "fs")
    private Double fs; // F.S

    @Column(name = "ih")
    private Double ih; // I.H

    @Column(name = "gh")
    private Double gh; // G.H
}
