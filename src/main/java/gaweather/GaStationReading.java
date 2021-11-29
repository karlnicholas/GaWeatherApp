package gaweather;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

/*
    siteKey: ALAPAHA
    observationDate: Conditions at 6:30 PM EST on November 28, 2021
    Relative Humidity: 51.2 %
    Dew Point Temperature: 31 F
    Wet Bulb: 41.4 F
    Atmospheric Pressure: 29.97 in.
    Wind Direction: NW
    Wind Speed: 2.5 mph
    Wind Gust: 7.8 mph at 6:30 PM
    Wind Chill: 48.1 F
    WBGT Index: 52.4 F
    2 Inch Soil: 49.1 F
    4 Inch Soil: 48.9 F
    8 Inch Soil: 49.4 F
    Soil Moisture: 21.1 %
    Solar Radiation: 0 W/m2
    Cumulative Rain Since 12:00 AM: 0 in.
    Max Air Temperature: 57.3 F at 3:45 PM
    Min Air Temperature: 24.4 F at 7:30 AM
    Max Wind Speed: 14.9 mph at 3:01 PM
 */
@Data
@AllArgsConstructor
public class GaStationReading {
    public GaStationReading(Map<String, String> values) {
        this(
                values.get("siteKey"),
                values.get("observationDate"),
                values.get("Temperature"),
                values.get("Relative Humidity"),
                values.get("Dew Point Temperature"),
                values.get("Wet Bulb"),
                values.get("Atmospheric Pressure"),
                values.get("Wind Direction"),
                values.get("Wind Speed"),
                values.get("Wind Gust"),
                values.get("Wind Chill"),
                values.get("WBGT Index"),
                values.get("2 Inch Soil"),
                values.get("4 Inch Soil"),
                values.get("8 Inch Soil"),
                values.get("Soil Moisture"),
                values.get("Solar Radiation"),
                values.get("Cumulative Rain Since 12:00 AM"),
                values.get("Max Air Temperature"),
                values.get("Min Air Temperature"),
                values.get("Max Wind Speed")
        );
    }

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
