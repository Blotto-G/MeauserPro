package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

// 계측기 관리 정보
@Getter
@Setter
@Entity
@Table(name="meausre_management")
public class MeausreProManagement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private int idx; // 관리 번호

    @ManyToOne
    @JoinColumn(name="instr_id", nullable = false)
    private MeausreProInstrument instr_id; // 계측기 번호

    @Column(name="instr_type", nullable = false)
    private char instrType; // 계측기 타입

    @Column(name="create_date", nullable = false, length = 45)
    private String createDate; // 측정일자

    @Column(name="comment", nullable = true, length = 200)
    private String comment; // 비고
}
