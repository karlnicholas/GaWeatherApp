package gaweather.model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class GaState {
    private BigDecimal atlLatitude = new BigDecimal("33.753746");
    private BigDecimal atlLongitude = new BigDecimal("-84.386330");
    private int atlX = 232;
    private int atlY = 306;
    private BigDecimal savLatitude = new BigDecimal("32.076176");
    private BigDecimal savLongitude = new BigDecimal("-81.088371");
    private int savX = 689;
    private int savY = 583;
}
