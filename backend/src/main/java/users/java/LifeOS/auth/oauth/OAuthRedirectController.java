package users.java.LifeOS.auth.oauth;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class OAuthRedirectController {

    @GetMapping("/login/{provider}")
    @Operation(summary = "Redirect to OAuth2 login", description = "provider = google")
    public String getOAuthLoginUrl(@PathVariable String provider) {
        return "https://localhost:8080/docs" + provider;
    }
}