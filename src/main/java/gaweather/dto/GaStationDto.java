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
    private int x;
    private int y;
    private int temp;
    private int windSpeed;
    private int windDir;
    private int windGust;
}
