package gaweather.service;

import gaweather.dto.GaStationDto;
import gaweather.dto.GaStationsDto;
import gaweather.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GaStationsService {
    private final GaStationProperties gaStationProperties;

    @Autowired
    public GaStationsService(GaStationProperties gaStationProperties) {
        this.gaStationProperties = gaStationProperties;
    }

    public GaStationsDto getGaStationsDto(GaStationReadings gaStationReadings) {
        List<GaStationDto> gaStationDtoList = new ArrayList<>();
        String observationDate = null;

        for (GaStationProperty gaStationProp : gaStationProperties.getGaStationProperties()) {
            Optional<GaStationReading> readingOpt = gaStationReadings.getGaStationReading(gaStationProp.getSiteKey());
            if (readingOpt.isEmpty()) {
                continue;
            }
            GaStationReading gaStationReading = readingOpt.get();
            if (observationDate == null && gaStationReading.getObservationDate() != null) {
                observationDate = gaStationReading.getObservationDate();
            }
            gaStationDtoList.add(GaStationDto.builder()
                    .key(gaStationProp.getSiteKey())
                    .latitude(gaStationProp.getLatitude().doubleValue())
                    .longitude(gaStationProp.getLongitude().doubleValue())
                    .temp(tempToInt(gaStationReading))
                    .windSpeed(windSpeedToInt(gaStationReading))
                    .windDir(windDirectionToDegrees(gaStationReading))
                    .windGust(windGustToInt(gaStationReading))
                    .solar(solarRadiationToInt(gaStationReading))
                    .elevation(gaStationProp.getElevation().intValue())
                    .rainToday(rainTodayInches(gaStationReading))
                    .humidity(humidityToInt(gaStationReading))
                    .build());
        }
        return GaStationsDto.builder()
                .gaStations(gaStationDtoList)
                .observationDate(observationDate)
                .build();
    }

    private int humidityToInt(GaStationReading r) {
        String t = r.getRelativeHumidity();
        if (t == null) return 0;
        return (int) (Double.parseDouble(t.substring(0, t.indexOf(' '))) + 0.5);
    }


    private int tempToInt(GaStationReading r) {
        String t = r.getTemperature();
        if (t == null) return 0;
        return (int) (Double.parseDouble(t.substring(0, t.indexOf(' '))) + 0.5);
    }

    private int windSpeedToInt(GaStationReading r) {
        String t = r.getWindSpeed();
        if (t == null) return 0;
        return (int) (Double.parseDouble(t.substring(0, t.indexOf(' '))) + 0.5);
    }

    private double rainTodayInches(GaStationReading r) {
        String t = r.getCumulativeRain();
        if (t == null) return 0;
        int space = t.indexOf(' ');
        if (space < 0) return 0;
        return Double.parseDouble(t.substring(0, space));
    }

    private int windDirectionToDegrees(GaStationReading r) {
        String t = r.getWindDirection();
        if (t == null) return 0;
        return CompassDirections.convertToDegrees(CompassDirections.valueOf(t));
    }

    private int windGustToInt(GaStationReading r) {
        String t = r.getWindGust();
        if (t == null) return 0;
        return (int) (Double.parseDouble(t.substring(0, t.indexOf(' '))) + 0.5);
    }

    private int solarRadiationToInt(GaStationReading r) {
        String t = r.getSolarRadiation();
        if (t == null) return 0;
        return (int) (Double.parseDouble(t.substring(0, t.indexOf(' '))) + 0.5);
    }
}
