package gaweather;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;

import java.io.*;
import java.net.URI;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class GaWeatherApp {
    private final Logger logger = Logger.getLogger(GaWeatherApp.class.getName());

    public static void main(String[] args) {
        new GaWeatherApp().run();
    }
    private void run() {
        GaStationProperties gaStationProperties = loadStationProperties();
//        GaStationReadings gaStationReadings = getGaStationReadings(gaStationProperties);
//        for (GaStationReading gaStationReading : gaStationReadings.getGaStationReadings()) {
//            System.out.println(gaStationReading);
//        }
        GaStGraph gaStGraph = loadStGraph();
        printVisGraph(gaStationProperties, gaStGraph);
    }
    private void printVisGraph(GaStationProperties gaStationProperties, GaStGraph gaStGraph) {
        System.out.println("var nodes = new vis.DataSet([");
        int i = 1;
        double maxLat = 0.0, maxLon = 0.0;
        for ( GaStationNode n: gaStGraph.getGaStGraph() ) {
            GaStationProperty gaStationProperty = gaStationProperties.getGaStationProperty(n.getSiteKey()).get();
            n.setId(i++);
            if (gaStationProperty.getLatitude().doubleValue() > maxLat ) {
                maxLat = gaStationProperty.getLatitude().doubleValue();
            }
            if (maxLon > gaStationProperty.getLongitude().doubleValue()) {
                maxLon = gaStationProperty.getLongitude().doubleValue();
            }
        }
        for ( GaStationNode n: gaStGraph.getGaStGraph() ) {
            GaStationProperty gaStationProperty = gaStationProperties.getGaStationProperty(n.getSiteKey()).get();
            System.out.println("{ id: " + n.getId() + ", label: \"" + n.getSiteKey() + "\""
                    + ", x: " + (int)((0 - (maxLon - gaStationProperty.getLongitude().doubleValue()))*300)
                    + ", y: " + (int)((maxLat - gaStationProperty.getLatitude().doubleValue())*300)
                    + "},");
        }
        System.out.println("]);");
        System.out.println("var edges = new vis.DataSet([");
        gaStGraph.getGaStGraph().forEach(n->{
            gaStationProperties.getGaStationProperty(n.getSiteKey()).ifPresent(gaStationPropertyNode -> {
                n.getEdges().forEach(e->{
                    gaStationProperties.getGaStationProperty(e).ifPresent(gaStationPropertyEdge -> {
                        gaStGraph.getGaStationNode(gaStationPropertyEdge.getSiteKey()).ifPresent(gaStationNode -> {
//                            double distance = distance(
//                                    gaStationPropertyNode.getLatitude().doubleValue(),
//                                    gaStationPropertyEdge.getLatitude().doubleValue(),
//                                    gaStationPropertyNode.getLongitude().doubleValue(),
//                                    gaStationPropertyEdge.getLongitude().doubleValue(),
//                                    gaStationPropertyNode.getElevation().doubleValue(),
//                                    gaStationPropertyEdge.getElevation().doubleValue()
//                            );
                            System.out.println("{ from: " + n.getId() + " , to:  " + gaStationNode.getId() + "},");
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
                        System.out.println(gaStationPropertyNode.getSiteKey()  + " -- " + gaStationPropertyEdge.getSiteKey() + "[len=" + String.format("%1$.1f", distance/1609) + "]; \\");
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

    private GaStationProperties loadStationProperties() {
        GaStationProperties gaStationProperties = new GaStationProperties();
        InputStream resource = GaWeatherApp.class.getResourceAsStream("/GaStationProperties.csv");
        if ( resource != null ) {
            try (InputStreamReader in = new InputStreamReader(resource)) {
                gaStationProperties.setGaStationProperties(CSVFormat.Builder.create()
                        .setHeader(GaStationProperty.GaStationPropertyHeader.class)
                        .build().parse(in).stream().map(CSVRecord::toMap).map(GaStationProperty::new).collect(Collectors.toList()));
            } catch ( Exception e) {
                logger.severe(e.getMessage());
                gaStationProperties.setGaStationProperties(new ArrayList<>());
            }
        } else {
            logger.severe("Resource /GaStationProperties.csv not found");
            gaStationProperties.setGaStationProperties(new ArrayList<>());
        }
        return gaStationProperties;
    }

    private GaStGraph loadStGraph() {
        GaStGraph gaStGraph = new GaStGraph();
        ObjectMapper objectMapper = new ObjectMapper();
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

    private GaStationReadings getGaStationReadings(GaStationProperties gaStationProperties) {
        GaStationReadings gaStationReadings = new GaStationReadings();
        ExecutorService executor = Executors.newFixedThreadPool(gaStationProperties.getGaStationProperties().size());
        List<Callable<GaStationReading>> tasks = gaStationProperties.getGaStationProperties().stream().map(p -> (Callable<GaStationReading>) () -> getGaStationReading(p.getSiteKey())).collect(Collectors.toList());
        try {
            gaStationReadings.setGaStationReadings(executor.invokeAll(tasks).stream().map(f -> {
                try {
                    return Optional.of(f.get());
                } catch (ExecutionException | InterruptedException e) {
                    logger.severe(e.getMessage());
                }
                return Optional.<GaStationReading>empty();
            }).filter(Optional::isPresent).map(Optional::get).collect(Collectors.toList()));
        } catch (InterruptedException e) {
            logger.severe(e.getMessage());
            gaStationReadings.setGaStationReadings(new ArrayList<>());
        }
        executor.shutdown();
        return gaStationReadings;
    }

    private GaStationReading getGaStationReading(String siteKey) throws Exception {
        try {
            Map<String, String> values = new HashMap<>();
            values.put("siteKey", siteKey);
            Element body = Jsoup.parse(URI.create("http://weather.uga.edu/index.php?variable=CC&site=" + siteKey).toURL(), 10000).body();
            String observationDate = body.select("tr.TableTitleRow").select("td").get(0).text();
            values.put("observationDate", observationDate);
            for (Element element : body.select("tr.TableRow2[align=left]")) {
                String tdName = element.select("td.tdClass").get(0).text().replace("&nbsp", "");
                Element td = element.select("td.tdClass").get(1);
                if (td.text().contentEquals("'")) {
                    values.put(tdName, td.select("img").attr("src").replace("/images/", "").replace("CUR.png", ""));
                } else {
                    values.put(tdName, td.text().replace("&nbsp", "").replace("&degF", "F"));
                }
            }
            return new GaStationReading(values);
        } catch (Exception e) {
            String n = e.getClass().getName();
            throw new Exception("Site exception for " + siteKey + ": " + n);
        }
    }

}
