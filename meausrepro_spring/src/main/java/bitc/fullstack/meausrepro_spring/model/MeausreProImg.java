package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="meausre_img")
public class MeausreProImg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idx", nullable = false)
    private int idx; // 이미지 번호

    @ManyToOne
    @JoinColumn(name="section_id", nullable = false)
    private MeausreProSection sectionId;

    @Column(name="img_src", nullable = false, length = 300)
    private String imgSrc;

    @Column(name="img_des", nullable = true, length = 45)
    private String imgDes;
}
