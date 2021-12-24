package gaweather.service;

import gaweather.dto.GaStationDto;
import gaweather.dto.GaStationsDto;
import gaweather.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.time.temporal.ChronoUnit.HOURS;

@Service
public class GaStationsService {
    Logger logger = LoggerFactory.getLogger(GaStationsService.class);
    private final GaStationProperties gaStationProperties;
    private final GaStationReadingService gaStationReadingService;
    private final GaState gaState;
    private final double xScale, yScale;
    private final DateTimeFormatter df = DateTimeFormatter.ofPattern("h:mm a v 'on' MMM dd, uuuu");

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
            Optional<GaStationReading> gaStationReadingOpt = gaStationReadingService.getGaStationReadings().getGaStationReading(gaStationProp.getSiteKey());
            Optional<GaStationReading> gaPriorStationReadingOpt = gaStationReadingService.getGaStationReadings().getPriorGaStationReading(gaStationProp.getSiteKey());
            gaStationReadingOpt.ifPresent(gaStationReading-> {
                double rainFall = gaPriorStationReadingOpt.map(priorReading->{
                    double a = rainFalloDouble(gaStationReading) - rainFalloDouble(priorReading);
                    if ( a < 0.0 ) a = 0.0;
                    // 15 mins or 0
                    Duration m = Duration.between(observationToDateTime(priorReading), observationToDateTime(gaStationReading));
                    if ( !m.isZero()) {
                        long tp = Duration.of(1, HOURS).dividedBy(m);
                        a *= (double)tp;
                    }
                    if ( a < 1.0 && a > 0.0 ) {
                        a = .99;
                    }
                    return a;
                }).orElse(0.0);
//System.out.println("rain: " + gaStationProp.getSiteKey() + ":" + (int)(rainFall + 0.5));
                GaStationDto gaStationDto = GaStationDto.builder()
                        .key(gaStationProp.getSiteKey())
                        .x(xPixLoc)
                        .y(yPixLoc)
                        .temp(tempToInt(gaStationReading))
                        .windSpeed(windSpeedToInt(gaStationReading))
                        .windDir(windDirectionToDegrees(gaStationReading))
                        .windGust(windGustToInt(gaStationReading))
                        .solar(solarRadiationToInt(gaStationReading))
                        .elevation(gaStationProp.getElevation().intValue())
                        .rainFall((int)(rainFall + 0.5))
                        .humidity(humidityToInt(gaStationReading))
                        .build();
                gaStationDtoList.add(gaStationDto);

            });
        }
        return GaStationsDto.builder().gaStations(gaStationDtoList).build();
    }

    private int humidityToInt(GaStationReading r) {
        String t = r.getRelativeHumidity();
        if (t == null) return 0;
        return (int) (Double.parseDouble(t.substring(0, t.indexOf(' '))) + 0.5);
    }


    private LocalDateTime observationToDateTime(GaStationReading r) {
        String t = r.getObservationDate();
        if (t == null) return LocalDateTime.now();
        int i = t.indexOf("onditions on ");
        if ( i < 0 ) {
            i = t.indexOf("onditions at ");
            if ( i < 0 ) {
                logger.error("Unparsable: {} {} ", r.getSiteKey(), t);
                return LocalDateTime.now();
            }
        }
        t = t.substring(i + 13).replace("January", "Jan")
                .replace("February", "Feb")
                .replace("March", "Mar")
                .replace("April", "Apr")
//                .replace("May", "May")
                .replace("June", "Jun")
                .replace("July","Jul")
                .replace("August","Aug")
                .replace("September","Sep")
                .replace("October","Oct")
                .replace("November","Nov")
                .replace("December","Dec");
        try {
            return LocalDateTime.parse(t, df);
        } catch ( DateTimeParseException dte ) {
            logger.error("DateTimeParseException: " + r.getSiteKey() + " " + t, dte);
            return LocalDateTime.now();
        }
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

    private double rainFalloDouble(GaStationReading r) {
        String t = r.getCumulativeRain();
        if (t == null) return 0;
        return Double.parseDouble(t.substring(0, t.indexOf(' ')));
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
