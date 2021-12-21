package gaweather;

import gaweather.model.*;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.*;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableScheduling
public class GaWeatherApp implements ApplicationRunner {
    private final Logger logger = Logger.getLogger(GaWeatherApp.class.getName());

    public static void main(String[] args) throws IOException {
        SpringApplication.run(GaWeatherApp.class);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
//        GaStationProperties gaStationProperties = loadStationProperties();
//        GaStationReadings gaStationReadings = getGaStationReadings(gaStationProperties);
//        System.out.println(objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(gaStationReadings));
//        GaStationReadings gaStationReadings = objectMapper.readValue(GaWeatherApp.class.getResourceAsStream("/SampleRead.json"), GaStationReadings.class);
//        for (GaStationReading gaStationReading : gaStationReadings.getGaStationReadings()) {
//            System.out.println(gaStationReading);
//        }
//        GaStGraph gaStGraph = loadStGraph();
//        printStationClasses(gaStationProperties, gaStationReadings);
    }

    @Bean
    public GaStationProperties loadStationProperties() {
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

}
