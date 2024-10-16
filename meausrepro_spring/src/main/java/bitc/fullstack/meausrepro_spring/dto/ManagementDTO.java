package bitc.fullstack.meausrepro_spring.dto;

import bitc.fullstack.meausrepro_spring.model.MeausreProManType;
import bitc.fullstack.meausrepro_spring.model.MeausreProManagement;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ManagementDTO {
    private MeausreProManagement management;
    private MeausreProManType managementType;
}