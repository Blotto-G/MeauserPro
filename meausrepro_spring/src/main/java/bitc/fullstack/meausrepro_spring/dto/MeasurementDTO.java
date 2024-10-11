package bitc.fullstack.meausrepro_spring.dto;

import bitc.fullstack.meausrepro_spring.model.Measurement;

import java.time.LocalDate;

public class MeasurementDTO {
    private String date;
    private double value;

    public MeasurementDTO(Measurement measurement) {
        this.date = measurement.getDate().toString();
        this.value = measurement.getValue();
    }

    // Getters and setters
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
