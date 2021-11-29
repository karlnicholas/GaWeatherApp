package gaweather;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;

import java.io.*;
import java.net.URI;
import java.util.*;
import java.util.concurrent.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

public class GaWeatherApp {
    private final Logger logger = Logger.getLogger(GaWeatherApp.class.getName());

    public static void main(String[] args) {
        new GaWeatherApp().run();
    }

    private void run() {
        GaStationProperties gaStationProperties = loadStationProperties();
        GaStationReadings gaStationReadings = getGaStationReadings(gaStationProperties);
        for (GaStationReading gaStationReading : gaStationReadings.getGaStationReadings()) {
            System.out.println(gaStationReading);
        }
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
