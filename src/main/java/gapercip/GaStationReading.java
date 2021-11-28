package gapercip;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
public class GaStationReading {
    private String siteKey;
    private String observationDate;
    private String temperature;
    private String relativeHumidity;
    private String dewPointTemperature;
    private String wetBulb;
    private String atmosphericPressure;
    private String windDirection;
    private String windSpeed;
    private String windGust;
    private String windChill;
    private String wBGTIndex;
    private String twoInchSoil;
    private String fourInchSoil;
    private String eightInchSoil;
    private String soilMoisture;
    private String solarRadiation;
    private String cumulativeRain;
    private String maxAirTemperature;
    private String minAirTemperature;
    private String maxWindSpeed;
}
