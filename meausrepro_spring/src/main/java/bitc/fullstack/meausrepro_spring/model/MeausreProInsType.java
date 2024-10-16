package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 계측기 기본 정보 타입별 추가
@Getter
@Setter
@Entity
@Table(name="meausre_instrument_type")
public class MeausreProInsType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private int idx; // 추가 정보 번호

    @OneToOne
    @JoinColumn(name="instr_id", nullable = false)
    private MeausreProInstrument instrId; // 계측기 번호

    @Column(name = "logger", length = 45)
    private String logger; // logger

    @Column(name = "a_plus", length = 45)
    private String aPlus; // A+

    @Column(name = "a_minus", length = 45)
    private String aMinus; // A-

    @Column(name = "b_plus", length = 45)
    private String bPlus; // B+

    @Column(name = "b_minus", length = 45)
    private String bMinus; // B-

    @Column(name = "kn_tone")
    private Double knTone; // 1KN_TONE

    @Column(name = "displacement")
    private Double displacement; // 설계변위량

    @Column(name = "dep_excavation")
    private Double depExcavation; // 굴착고

    @Column(name = "zero_read")
    private Double zeroRead; // ZERO_READ

    @Column(name = "instrument")
    private Double instrument; // 계기상수

    @Column(name = "ten_allowable")
    private Double tenAllowable; // 허용인장력

    @Column(name = "ten_design")
    private Double tenDesign; // 설계긴장력

}
