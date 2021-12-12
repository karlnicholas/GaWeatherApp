package gaweather;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
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

    //    siteKey: ALAPAHA
    private String siteKey;
    //    observationDate: Conditions at 6:30 PM EST on November 28, 2021
    private String observationDate;
    //    Temperature: 44.9 F
    private String temperature;
    //    Relative Humidity: 51.2 %
    private String relativeHumidity;
    //    Dew Point Temperature: 31 F
    private String dewPointTemperature;
    //    Wet Bulb: 41.4 F
    private String wetBulb;
    //    Atmospheric Pressure: 29.97 in.
    private String atmosphericPressure;
    //    Wind Direction: NW
    private String windDirection;
    //    Wind Speed: 2.5 mph
    private String windSpeed;
    //    Wind Gust: 7.8 mph at 6:30 PM
    private String windGust;
    //    Wind Chill: 48.1 F
    private String windChill;
    //    WBGT Index: 52.4 F
    private String wBGTIndex;
    //    2 Inch Soil: 49.1 F
    private String twoInchSoil;
    //    4 Inch Soil: 48.9 F
    private String fourInchSoil;
    //    8 Inch Soil: 49.4 F
    private String eightInchSoil;
    //    Soil Moisture: 21.1 %
    private String soilMoisture;
    //    Solar Radiation: 0 W/m2
    private String solarRadiation;
    //    Cumulative Rain Since 12:00 AM: 0 in.
    private String cumulativeRain;
    //    Max Air Temperature: 57.3 F at 3:45 PM
    private String maxAirTemperature;
    //    Min Air Temperature: 24.4 F at 7:30 AM
    private String minAirTemperature;
    //    Max Wind Speed: 14.9 mph at 3:01 PM
    private String maxWindSpeed;

}
