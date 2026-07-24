package users.java.LifeOS.demo.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "lifeos.demo")
@Getter
@Setter
public class DemoConfiguration {

    private boolean enabled = false;

    private int users = 40;

    private int tasksPerUser = 25;

    private int taskMin = 15;

    private int taskMax = 30;

    private int maxFriends = 8;

    private int friendMin = 4;

    private int friendMax = 8;

    private int labelMin = 6;

    private int labelMax = 10;

    private int sameBranchProbability = 70;

    private int sameYearProbability = 20;

    private int randomProbability = 10;

    private long randomSeed = 42L;
}
