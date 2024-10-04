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

    @Column(name = "install_distance")
    private Double installDistance; // 설치거리

    @Column(name = "fac_gage")
    private Double facGage; // GAGE FACTOR

    @Column(name = "fac_thermal")
    private Double facThermal; // THERMAL FACTOR

    @Column(name = "pos_tip")
    private Double posTip; // TIP 설치위치

    @Column(name = "dep_install")
    private Double depInstall; // 설치심도

    @Column(name = "division", length = 1)
    private char division; // 상하단구분

    @Column(name = "constant_one")
    private Double constantOne; // 1차관리기준상수

    @Column(name = "constant_two")
    private Double constantTwo; // 2차관리기준상수

    @Column(name = "constant_three")
    private Double constantThree; // 3차관리기준상수

    @Column(name = "horizontal_plus")
    private Double horizontalPlus; // 수평변위 X+

    @Column(name = "horizontal_minus")
    private Double horizontalMinus; // 수평변위 X-

    @Column(name = "dep_indicated")
    private Double depIndicated; // 표기심도
}
