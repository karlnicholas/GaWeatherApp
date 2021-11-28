package gapercip;

import com.fasterxml.jackson.databind.util.BeanUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.csv.CSVRecord;

import java.beans.BeanDescriptor;
import java.beans.BeanInfo;
import java.beans.BeanProperty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Map;

@Data
@AllArgsConstructor
public class GaStationProperty {
    public enum GaStationPropertyHeader {
        city,county,zipCode,localSiteName,latitude,longitude,elevation,siteId,dateOfInstallation,siteKey
    }
    public GaStationProperty(Map<String, String> map) {
        this(
                map.get("city"),
                map.get("county"),
                map.get("zipCode"),
                map.get("localSiteName"),
                new BigDecimal(map.get("latitude")),
                new BigDecimal(map.get("longitude")),
                new BigDecimal(map.get("elevation")),
                map.get("siteId"),
                LocalDate.parse(map.get("dateOfInstallation"), DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                map.get("siteKey")
        );
    }

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
