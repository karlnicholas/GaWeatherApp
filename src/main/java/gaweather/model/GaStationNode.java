package gaweather.model;

import lombok.Data;

import java.util.List;

@Data
public class GaStationNode {
    private String siteKey;
    private List<String> edges;
    private int id;
}
