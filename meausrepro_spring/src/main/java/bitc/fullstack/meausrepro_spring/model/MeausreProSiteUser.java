package bitc.fullstack.meausrepro_spring.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="meausre_site_user")
public class MeausreProSiteUser {
    @Id
    @Column(name="id", nullable = false, length = 45)
    private String id;

    @ManyToOne
    @JoinColumn(name="project_idx", nullable = false)
    private MeausreProProject projectIdx;

    @Column(name="pass", nullable = false, length = 45)
    private String pass;
}
