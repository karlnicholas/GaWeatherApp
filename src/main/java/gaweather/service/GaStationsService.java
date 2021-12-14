package gaweather.service;

import gaweather.dto.GaStationDto;
import gaweather.dto.GaStationsDto;
import gaweather.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GaStationsService {
    private final GaStationProperties gaStationProperties;
    private final GaStationReadingService gaStationReadingService;
    private final GaState gaState;
    private final double xScale, yScale;

    @Autowired
    public GaStationsService(GaStationProperties gaStationProperties, GaStationReadingService gaStationReadingService) {
        this.gaStationProperties = gaStationProperties;
        this.gaStationReadingService = gaStationReadingService;
        gaState = new GaState();
        // -84.386330 - -81.088371 = -3.297959
        double xDblDiff = gaState.getAtlLongitude().doubleValue() - gaState.getSavLongitude().doubleValue();
        // 225 - 827 = -602
        int xIntDiff = gaState.getAtlX() - gaState.getSavX();
        // -602 / -3.297959 = 182.5371388789248
        xScale = (double) xIntDiff / xDblDiff;
        // 33.753746 - 32.076176 = 1.67757
        double yDblDiff = gaState.getAtlLatitude().doubleValue() - gaState.getSavLatitude().doubleValue();
        // 278 - 644 = -366
        int yIntDiff = gaState.getAtlY() - gaState.getSavY();
        // -366 / 1.67757 = -218.1727141043295
        yScale = (double) yIntDiff / yDblDiff;
    }

    public GaStationsDto getGaStationsDto() {
        List<GaStationDto> gaStationDtoList = new ArrayList<>();

        for (GaStationProperty gaStationProp : gaStationProperties.getGaStationProperties()) {
            double xDist = gaState.getAtlLongitude().doubleValue() - gaStationProp.getLongitude().doubleValue();
            int xPixLoc = gaState.getAtlX() - (int) (xDist * xScale);
            double yDist = gaState.getAtlLatitude().doubleValue() - gaStationProp.getLatitude().doubleValue();
            int yPixLoc = gaState.getAtlY() - (int) (yDist * yScale);
            GaStationReading gaStationReading = gaStationReadingService.getGaStationReadings().getGaStationReading(gaStationProp.getSiteKey()).get();
            GaStationDto gaStationDto = GaStationDto.builder()
                    .key(gaStationProp.getSiteKey())
                    .x(xPixLoc)
                    .y(yPixLoc)
                    .temp(tempToInt(gaStationReading))
                    .windSpeed(windSpeedToInt(gaStationReading))
                    .windDir(windDirectionToDegrees(gaStationReading))
                    .windGust(windGustToInt(gaStationReading))
                    .build();
            gaStationDtoList.add(gaStationDto);

        }
        return GaStationsDto.builder().gaStations(gaStationDtoList).build();
    }

    private int tempToInt(GaStationReading r) {
        String t = r.getTemperature();
        if (t == null) return 0;
        return (int) (Double.valueOf(t.substring(0, t.indexOf(' '))).doubleValue() + 0.5);
    }

    private int windSpeedToInt(GaStationReading r) {
        String t = r.getWindSpeed();
        if (t == null) return 0;
        return (int) (Double.valueOf(t.substring(0, t.indexOf(' '))).doubleValue() + 0.5);
    }

    private int windDirectionToDegrees(GaStationReading r) {
        String t = r.getWindDirection();
        if (t == null) return 0;
        return CompassDirections.convertToDegrees(CompassDirections.valueOf(t));
    }

    private int windGustToInt(GaStationReading r) {
        String t = r.getWindGust();
        if (t == null) return 0;
        return (int) (Double.valueOf(t.substring(0, t.indexOf(' '))).doubleValue() + 0.5);
    }

}
