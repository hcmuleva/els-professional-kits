import com.intuit.karate.junit5.Karate;

class Runner {

    @Karate.Test
    Karate testAuth() {
        // Runs all features in the "features" package
        return Karate.run("classpath:features/auth.feature");
    }
}
