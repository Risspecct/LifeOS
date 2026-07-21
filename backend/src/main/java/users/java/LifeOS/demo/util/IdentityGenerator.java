package users.java.LifeOS.demo.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class IdentityGenerator {

    private final RandomData randomData;

    private final Set<String> usernames = new HashSet<>();

    public Identity random() {

        String fullName = randomData.oneOf(DemoConstants.FULL_NAMES);

        String username = uniqueUsername(
                fullName.toLowerCase().replace(" ", ".")
        );

        String email = username + "@" + DemoConstants.DEMO_EMAIL_DOMAIN;

        return new Identity(
                fullName,
                username,
                email,
                randomAge(),
                randomYear(),
                randomCollege(),
                randomBio()
        );
    }

    public Identity admin() {
        return fixed(
                "Admin User",
                "admin"
        );
    }

    public Identity alice() {
        return fixed(
                "Alice Johnson",
                "alice"
        );
    }

    public Identity bob() {
        return fixed(
                "Bob Williams",
                "bob"
        );
    }

    public Identity charlie() {
        return fixed(
                "Charlie Brown",
                "charlie"
        );
    }

    private Identity fixed(
            String fullName,
            String username
    ) {

        usernames.add(username);

        return new Identity(

                fullName,

                username,

                username + "@lifeos.demo",

                21,

                3,

                randomCollege(),

                randomBio()

        );
    }

    private Integer randomAge() {
        return randomData.between(18, 24);
    }

    private Integer randomYear() {
        return randomData.between(1, 4);
    }

    private String randomCollege() {
        return randomData.weighted(DemoConstants.COLLEGES);
    }

    private String randomBio() {
        return randomData.oneOf(DemoConstants.BIOS);
    }

    private String uniqueUsername(String username) {

        if (usernames.add(username)) {
            return username;
        }

        int suffix = 2;

        while (!usernames.add(username + suffix)) {
            suffix++;
        }

        return username + suffix;
    }
}