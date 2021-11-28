package gapercip;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

/*
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Relative Humidity</font></h5></td><td class="tdClass"><h5><font color="black" >51.2 %</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Dew Point Temperature</font></h5></td><td class="tdClass"><h5><font color="black" >31 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Wet Bulb</font></h5></td><td class="tdClass"><h5><font color="black" >41.4 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Atmospheric Pressure</font></h5></td><td class="tdClass"><h5><font color="black" >29.97 in.<img src=/images/slowup.png alt='55' width='38' height='32' border=0'></font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Wind Direction</font></h5></td><td class="tdClass"><h5><font color="black" ><img src=/images/NWCUR.png alt='55' width='100' height ='100' border = 0>'</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Wind Speed</font></h5></td><td class="tdClass"><h5><font color="black" >2.5 mph</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Wind Gust</font></h5></td><td class="tdClass"><h5><font color="black" >7.8 mph at 6:30 PM</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Wind Chill</font></h5></td><td class="tdClass"><h5><font color="black" >48.1 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >WBGT Index</font></h5></td><td class="tdClass"><h5><font color="black" >52.4 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >2 Inch Soil</font></h5></td><td class="tdClass"><h5><font color="black" >49.1 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >4 Inch Soil</font></h5></td><td class="tdClass"><h5><font color="black" >48.9 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >8 Inch Soil</font></h5></td><td class="tdClass"><h5><font color="black" >49.4 F</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Soil Moisture</font></h5></td><td class="tdClass"><h5><font color="black" >21.1 %</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Solar Radiation</font></h5></td><td class="tdClass"><h5><font color="black" >0 W/m2</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Cumulative Rain Since 12:00 AM</font></h5></td><td class="tdClass"><h5><font color="black" >0 in.</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Max Air Temperature</font></h5></td><td class="tdClass"><h5><font color="black" >57.3 F at 3:45 PM</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Min Air Temperature</font></h5></td><td class="tdClass"><h5><font color="black" >24.4 F at 7:30 AM</font></h5></td>
		</tr><tr class = TableRow2 align = "left"><td class="tdClass"><h5><font color="black" >Max Wind Speed</font></h5></td><td class="tdClass"><h5><font color="black" >14.9 mph at 3:01 PM</font></h5></td>

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
