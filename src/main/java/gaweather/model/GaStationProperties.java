package gaweather.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;
import java.util.Optional;

@Data
public class GaStationProperties {
    private List<GaStationProperty> gaStationProperties;
    @JsonIgnore
    public Optional<GaStationProperty> getGaStationProperty(String siteKey) {
        return gaStationProperties.stream().filter(p->p.getSiteKey().equalsIgnoreCase(siteKey)).findAny();
    }
}
