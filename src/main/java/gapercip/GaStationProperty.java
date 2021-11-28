package gapercip;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class GaStationProperty {
    private String city;
    private String county;
    private String zipCode;
    private String localSiteName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal elevation;
    private String siteId;
    private LocalDate dateOfInstallation;
    private String siteKey;
}
