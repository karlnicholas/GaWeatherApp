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
        for (GaStationReading gaStationReading : gaStationReadings.getGaStationReadings()) {
            System.out.println(gaStationReading);
        }
    }

    private GaStationProperties loadStationProperties() throws IOException {
        GaStationProperties gaStationProperties = new GaStationProperties();
        try (InputStreamReader in = new InputStreamReader(GaWeatherApp.class.getResourceAsStream("/GaStationProperties.csv"))) {
            gaStationProperties.setGaStationProperties( CSVFormat.Builder.create()
                    .setHeader(GaStationProperty.GaStationPropertyHeader.class)
                    .build().parse(in).stream().map(CSVRecord::toMap).map(GaStationProperty::new).collect(Collectors.toList()));
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
        GaStationReading gaStationReading = new GaStationReading(values);
        return gaStationReading;
    }

}
