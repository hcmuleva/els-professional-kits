package runners;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class TestRunner {
    
    @Test
    void testLevel3Auth() {
        Results results = Runner.path("classpath:features/level3/authentication.feature")
                .outputCucumberJson(true)
                .parallel(3);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
    
    @Test
    void testLevel3UserCrud() {
        Results results = Runner.path("classpath:features/level3/user-crud.feature")
                .outputCucumberJson(true)
                .parallel(3);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
    
    @Test
    void testAllLevel3() {
        Results results = Runner.path("classpath:features/level3")
                .outputCucumberJson(true)
                .parallel(5);
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }
}
