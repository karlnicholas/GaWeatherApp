package gaweather.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GaStationDto {
    private String key;
    private double latitude;
    private double longitude;
    private int temp;
    private int windSpeed;
    private int windDir;
    private int windGust;
    private int solar;
    private int elevation;
    private int rainFall;
    private int humidity;
}
