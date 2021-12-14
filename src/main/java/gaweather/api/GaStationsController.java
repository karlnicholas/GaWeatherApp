package gaweather.api;

import gaweather.dto.GaStationsDto;
import gaweather.service.GaStationsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api")
@CrossOrigin
public class GaStationsController {
    private final GaStationsService gaStationReadingService;

    public GaStationsController(GaStationsService gaStationReadingService) {
        this.gaStationReadingService = gaStationReadingService;
    }

    @GetMapping(value = "gastations")
    public GaStationsDto getGaStationsDto() {
        return gaStationReadingService.getGaStationsDto();
    }
}
