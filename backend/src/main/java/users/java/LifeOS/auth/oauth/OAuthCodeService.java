package users.java.LifeOS.auth.oauth;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.InvalidRequestException;

import java.time.Duration;
import java.util.UUID;

@Service
public class OAuthCodeService {

    private final Cache<String, Long> codeCache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(2))
            .maximumSize(1000)
            .build();

    public String createCode(Long userId) {
        String code = UUID.randomUUID().toString();
        codeCache.put(code, userId);
        return code;
    }

    public Long consumeCode(String code) {
        Long userId = codeCache.asMap().remove(code);

        if (userId == null) {
            throw new InvalidRequestException(
                    "OAuth code is invalid or has expired."
            );
        }
        return userId;
    }
}