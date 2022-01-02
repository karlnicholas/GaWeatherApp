package gaweather.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gaweather.model.GaStationProperties;
import gaweather.model.GaStationReading;
import gaweather.model.GaStationReadings;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.*;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
public class GaStationReadingService {
    private final Logger logger = LoggerFactory.getLogger(GaStationReadingService.class.getName());
    private final GaStationProperties gaStationProperties;
    private GaStationReadings gaStationReadings;
    private final ObjectMapper objectMapper;

    @Autowired
    public GaStationReadingService(GaStationProperties gaStationProperties, ObjectMapper objectMapper) {
        this.gaStationProperties = gaStationProperties;
        this.objectMapper = objectMapper;
        this.gaStationReadings = new GaStationReadings();
    }

    public GaStationReadings getGaStationReadings() {
        return gaStationReadings;
    }

    @Scheduled(fixedRate = 900000, initialDelay = 0)
    public void readGaStations() {
        readGaStationReadings();
        logger.info("GaStationReadings executed: " + gaStationReadings.getGaStationReadings().size() + " stations read.");
    }

    private void readGaStationReadings() {
        gaStationReadings.saveCurrentToPrior();
        ExecutorService executor = Executors.newFixedThreadPool(gaStationProperties.getGaStationProperties().size());
        List<Callable<GaStationReading>> tasks = gaStationProperties.getGaStationProperties()
                .stream().map(p ->
                        (Callable<GaStationReading>) () -> readGaStationReading(p.getSiteKey())).collect(Collectors.toList());
        try {
            gaStationReadings.setGaStationReadings(executor.invokeAll(tasks).stream().map(f -> {
                try {
                    return Optional.of(f.get());
                } catch (Exception e) {
                    logger.error(e.getMessage());
                }
                return Optional.<GaStationReading>empty();
            }).filter(Optional::isPresent).map(Optional::get).collect(Collectors.toList()));
System.out.println(objectMapper.writeValueAsString(gaStationReadings.getGaStationReadings()));
        } catch (InterruptedException | JsonProcessingException e) {
            logger.error(e.getMessage());
            gaStationReadings.setGaStationReadings(new ArrayList<>());
        }
        executor.shutdown();
    }

    private GaStationReading readGaStationReading(String siteKey) throws Exception {
        try {
            Map<String, String> values = new HashMap<>();
            values.put("siteKey", siteKey);
            Element body = Jsoup.parse(URI.create("http://weather.uga.edu/index.php?variable=CC&site=" + siteKey).toURL(), 10000).body();
            String observationDate = body.select("tr.TableTitleRow").select("td").get(0).text();
            String statusCheck = body.select("tr.TableTitleRow").select("td").get(1).text();
            if ( statusCheck == null) {
                throw new Exception("No status check");
            }
            if ( !statusCheck.equalsIgnoreCase("DATA")) {
                throw new Exception(statusCheck.replace("&nbsp", ""));
            }
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
            throw new Exception("Site exception for " + siteKey + ": " + e.getMessage());
        }
    }

}
