package gaweather;

import lombok.Data;

import java.util.List;
import java.util.Optional;

@Data
public class GaStGraph {
    List<GaStationNode> gaStGraph;
    public Optional<GaStationNode> getGaStationNode(String siteKey) {
        return gaStGraph.stream().filter(n->n.getSiteKey().equalsIgnoreCase(siteKey)).findAny();
    }
}
