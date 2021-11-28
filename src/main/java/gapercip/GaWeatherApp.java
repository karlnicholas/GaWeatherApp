package gapercip;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;

import java.io.*;
import java.math.BigDecimal;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

public class GaWeatherApp {
    private ObjectMapper mapper;
    public static void main(String[] args) throws IOException {
        new GaWeatherApp().run();
    }

    private void run() throws IOException {
        mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        GaStationProperties gaStationProperties = loadStationProperties();
        GaStationReadings gaStationReadings = getGaStationReadings(gaStationProperties);
        for ( GaStationReading gaStationReading: gaStationReadings.getGaStationReadings()) {
            System.out.println(gaStationReading);
        }
    }

    private GaStationProperties loadStationProperties() throws IOException {
        GaStationProperties gaStationProperties = new GaStationProperties();
        gaStationProperties.setGaStationProperties(new ArrayList<>());
        try (InputStreamReader in = new InputStreamReader(GaWeatherApp.class.getResourceAsStream("/GaStationProperties.csv")) ) {
            Iterable<CSVRecord> records = CSVFormat.RFC4180.parse(in);
            int i=0;
            for (CSVRecord record : records) {
                GaStationProperty gaStationProperty = new GaStationProperty(
                        record.get(0),
                        record.get(1),
                        record.get(2),
                        record.get(3),
                        new BigDecimal(record.get(4)),
                        new BigDecimal(record.get(5)),
                        new BigDecimal(record.get(6)),
                        record.get(7),
                        LocalDate.parse(record.get(8), DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                        record.get(9)
                );
                gaStationProperties.getGaStationProperties().add(gaStationProperty);
            }
        }
        return gaStationProperties;
    }
    private GaStationReadings getGaStationReadings(GaStationProperties gaStationProperties) {
        GaStationReadings gaStationReadings = new GaStationReadings();
        gaStationReadings.setGaStationReadings(new ArrayList<GaStationReading>());

        ExecutorService executor = Executors.newFixedThreadPool(gaStationProperties.getGaStationProperties().size());

        // invoiceIDs is a collection of Invoice IDs
        List<Callable<GaStationReading>> tasks = gaStationProperties.getGaStationProperties().stream().map(p -> (Callable<GaStationReading>) () -> getGaStationReading(p.getSiteKey())).collect(Collectors.toList());
        try {
            List<Future<GaStationReading>> results = executor.invokeAll(tasks);
            for (Future<GaStationReading> result : results) {
                GaStationReading readingResult = result.get();
                gaStationReadings.getGaStationReadings().add(readingResult);
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }
        executor.shutdown();
        return gaStationReadings;
    }
    private GaStationReading getGaStationReading(String siteKey) throws IOException {
        Map<String, String> values = new HashMap<>();
        Element body = Jsoup.parse(URI.create("http://weather.uga.edu/index.php?variable=CC&site=" + siteKey).toURL(), 10000).body();
        String observationDate = body.select("tr.TableTitleRow").select("td").get(0).text();
        values.put("observationDate", observationDate);
        for ( Element element: body.select("tr.TableRow2[align=left]")) {
            String tdName = element.select("td.tdClass").get(0).text().replace("&nbsp", "");
            Element td = element.select("td.tdClass").get(1);
            if ( td.text().contentEquals("'") ) {
                values.put(tdName, td.select("img").attr("src").replace("/images/", "").replace("CUR.png", ""));
            } else {
                values.put(tdName, td.text().replace("&nbsp", "")
                        .replace("&degF", ""));
            }
        }
        GaStationReading gaStationReading = new GaStationReading(
                siteKey,
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
        return gaStationReading;
    }

}
