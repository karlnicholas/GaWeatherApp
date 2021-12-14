package gaweather.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import gaweather.GaWeatherApp;
import gaweather.model.GaStGraph;
import gaweather.model.GaStationNode;
import gaweather.model.GaStationProperties;
import gaweather.model.GaStationProperty;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.logging.Logger;

public class GaPrintUtils {
    private final Logger logger = Logger.getLogger(GaPrintUtils.class.getName());
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    private void printVisGraph(GaStationProperties gaStationProperties, GaStGraph gaStGraph) {
        System.out.println("var nodes = new vis.DataSet([");
        int i = 1;
        double maxLat = 0.0, minLon = 0.0;
        for ( GaStationNode n: gaStGraph.getGaStGraph() ) {
            GaStationProperty gaStationProperty = gaStationProperties.getGaStationProperty(n.getSiteKey()).get();
            n.setId(i++);
            if (gaStationProperty.getLatitude().doubleValue() > maxLat ) {
                maxLat = gaStationProperty.getLatitude().doubleValue();
            }
            if (minLon > gaStationProperty.getLongitude().doubleValue()) {
                minLon = gaStationProperty.getLongitude().doubleValue();
            }
        }
//        for ( GaStationNode n: gaStGraph.getGaStGraph() ) {
//            GaStationProperty gaStationProperty = gaStationProperties.getGaStationProperty(n.getSiteKey()).get();
//            System.out.println("{ id: " + n.getId() + ", label: \"" + n.getSiteKey() + "\""
//                    + ", x: " + (int)((0 - (minLon - gaStationProperty.getLongitude().doubleValue()))*300)
//                    + ", y: " + (int)((maxLat - gaStationProperty.getLatitude().doubleValue())*300)
//                    + "},");
//        }
        for ( GaStationNode n: gaStGraph.getGaStGraph() ) {
            GaStationProperty gaStationProperty = gaStationProperties.getGaStationProperty(n.getSiteKey()).get();
            System.out.println("{ id: " + n.getId() + ", label: \"" + n.getSiteKey() + "\""
//                    + ", x: " + (int)((0 - (minLon - gaStationProperty.getLongitude().doubleValue()))*300)
//                    + ", y: " + (int)((maxLat - gaStationProperty.getLatitude().doubleValue())*300)
                    + "},");
        }
        System.out.println("]);");
        System.out.println("var edges = new vis.DataSet([");
        gaStGraph.getGaStGraph().forEach(n->{
            gaStationProperties.getGaStationProperty(n.getSiteKey()).ifPresent(gaStationPropertyNode -> {
                n.getEdges().forEach(e->{
                    gaStationProperties.getGaStationProperty(e).ifPresent(gaStationPropertyEdge -> {
                        gaStGraph.getGaStationNode(gaStationPropertyEdge.getSiteKey()).ifPresent(gaStationNode -> {
                            double distance = distance(
                                    gaStationPropertyNode.getLatitude().doubleValue(),
                                    gaStationPropertyEdge.getLatitude().doubleValue(),
                                    gaStationPropertyNode.getLongitude().doubleValue(),
                                    gaStationPropertyEdge.getLongitude().doubleValue(),
                                    gaStationPropertyNode.getElevation().doubleValue(),
                                    gaStationPropertyEdge.getElevation().doubleValue()
                            );
                            System.out.println("{ from: " + n.getId() + " , to:  " + gaStationNode.getId() + ", length: " + String.format("%1$.1f", distance/1609) + "},");
                        });
                    });
                });
            });
        });
        System.out.println("]);");
    }

    private void printDOTGraph(GaStationProperties gaStationProperties, GaStGraph gaStGraph) {
        System.out.println("gaweather {");
        gaStGraph.getGaStGraph().forEach(n->{
            gaStationProperties.getGaStationProperty(n.getSiteKey()).ifPresent(gaStationPropertyNode -> {
                n.getEdges().forEach(e->{
                    gaStationProperties.getGaStationProperty(e).ifPresent(gaStationPropertyEdge -> {
                        double distance = distance(
                                gaStationPropertyNode.getLatitude().doubleValue(),
                                gaStationPropertyEdge.getLatitude().doubleValue(),
                                gaStationPropertyNode.getLongitude().doubleValue(),
                                gaStationPropertyEdge.getLongitude().doubleValue(),
                                gaStationPropertyNode.getElevation().doubleValue(),
                                gaStationPropertyEdge.getElevation().doubleValue()
                        );
                        System.out.println(gaStationPropertyNode.getSiteKey()  + " -- " + gaStationPropertyEdge.getSiteKey() + ", length: " + String.format("%1$.1f", distance/1609) + "]; \\");
                    });
                });
            });
        });
        System.out.println("}");
    }

    /**
     * Calculate distance between two points in latitude and longitude taking
     * into account height difference. If you are not interested in height
     * difference pass 0.0. Uses Haversine method as its base.
     *
     * lat1, lon1 Start point lat2, lon2 End point el1 Start altitude in meters
     * el2 End altitude in meters
     * @returns Distance in Meters
     */
    public static double distance(double lat1, double lat2, double lon1,
                                  double lon2, double el1, double el2) {

        final int R = 6371; // Radius of the earth

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c * 1000; // convert to meters

        double height = el1 - el2;

        distance = Math.pow(distance, 2) + Math.pow(height, 2);

        return Math.sqrt(distance);
    }

    private GaStGraph loadStGraph() {
        GaStGraph gaStGraph = new GaStGraph();
        InputStream resource = GaWeatherApp.class.getResourceAsStream("/GaStGraph.json");
        if ( resource != null ) {
            try (InputStreamReader in = new InputStreamReader(resource)) {
                return objectMapper.readValue(in, GaStGraph.class);
            } catch ( Exception e) {
                logger.severe(e.getMessage());
                gaStGraph.setGaStGraph(new ArrayList<>());
            }
        } else {
            logger.severe("Resource /GaStationProperties.csv not found");
            gaStGraph.setGaStGraph(new ArrayList<>());
        }
        return gaStGraph;
    }

}
