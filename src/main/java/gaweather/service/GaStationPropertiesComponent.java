package gaweather.service;

import gaweather.GaWeatherApp;
import gaweather.model.GaStationProperties;
import gaweather.model.GaStationProperty;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Component
public class GaStationPropertiesComponent {
    private final Logger logger = Logger.getLogger(GaStationPropertiesComponent.class.getName());
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
