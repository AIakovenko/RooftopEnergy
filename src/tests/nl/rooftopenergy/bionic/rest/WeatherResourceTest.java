package nl.rooftopenergy.bionic.rest;

import nl.rooftopenergy.bionic.transfer.WeatherActualDataTransfer;
import nl.rooftopenergy.bionic.transfer.WeatherCloudsTransfer;
import nl.rooftopenergy.bionic.transfer.WeatherDailyDataTransfer;
import nl.rooftopenergy.bionic.transfer.WeatherFiveDaysDataTransfer;
import org.junit.BeforeClass;
import org.junit.runner.RunWith;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.inject.Inject;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/applicationContextForUnitTests.xml"})
public class WeatherResourceTest {

    @Inject
    private WeatherResource weatherResource;

    @BeforeClass
    public static void setup() {
        Authentication auth = new UsernamePasswordAuthenticationToken("rooftop", "energy");
        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(auth);
    }

    @org.junit.Test
    public void testShowDailyWeather() throws Exception {
        int forecastsNumber = 16;

        List<WeatherDailyDataTransfer> data = weatherResource.showDailyWeather(String.valueOf(forecastsNumber));
        assertTrue(data.size() == forecastsNumber);

    }

    @org.junit.Test
    public void testShowFiveDayWeather() throws Exception {
        List<WeatherFiveDaysDataTransfer> data = weatherResource.showFiveDayWeather();
        assertNotNull(data);

    }

    @org.junit.Test
    public void testShowActualDayWeather() throws Exception{
        WeatherActualDataTransfer data = weatherResource.showActualDayWeather();
        assertNotNull(data);
    }

    @org.junit.Test
    public void testShowCloudsForFiveDays() throws Exception{
        List<WeatherCloudsTransfer> data = weatherResource.showCloudsForFiveDays();
        assertNotNull(data);
    }
}