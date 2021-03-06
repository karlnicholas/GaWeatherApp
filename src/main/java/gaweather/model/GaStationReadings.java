package gaweather.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.List;
import java.util.Optional;

@Data
public class GaStationReadings {
    private List<GaStationReading> gaStationReadings;
    private List<GaStationReading> priorGaStationReadings;
    @JsonIgnore
    public Optional<GaStationReading> getGaStationReading(String siteKey) {
        return gaStationReadings.stream().filter(p->p.getSiteKey().equalsIgnoreCase(siteKey)).findAny();
    }

    @JsonIgnore
    public Optional<GaStationReading> getPriorGaStationReading(String siteKey) {
        return Optional.ofNullable(priorGaStationReadings)
                .flatMap(r->r.stream().filter(p -> p.getSiteKey().equalsIgnoreCase(siteKey)).findAny());
    }

    public void saveCurrentToPrior() {
        priorGaStationReadings = gaStationReadings;
    }
}
