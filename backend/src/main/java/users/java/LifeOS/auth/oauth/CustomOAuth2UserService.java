package users.java.LifeOS.auth.oauth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import users.java.LifeOS.stats.StatsService;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final StatsService statsService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String providerId = oauth2User.getAttribute("sub");

        if (email == null) {throw new OAuth2AuthenticationException("Email not found from Google.");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
                    User newUser = new User();

                    newUser.setEmail(email);
                    newUser.setUsername(name);
                    newUser.setRole("USER");

                    return newUser;
                });


        user.setProvider(AuthProvider.GOOGLE);
        user.setProviderId(providerId);

        userRepository.save(user);
        statsService.ensureStats(user);

        log.info("Authenticated Google user: {}", email);

        return new CustomOAuth2User(oauth2User, user);
    }
}
