package users.java.LifeOS.auth.oauth;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import users.java.LifeOS.auth.services.JwtService;
import users.java.LifeOS.exceptions.InvalidRequestException;
import users.java.LifeOS.user.User;
import users.java.LifeOS.user.UserRepository;

@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthExchangeController {

    private final OAuthCodeService oauthCodeService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/exchange")
    public OAuthExchangeResponse exchange(@RequestBody OAuthExchangeRequest request) {
        Long userId = oauthCodeService.consumeCode(request.code());

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new InvalidRequestException("User not found."));

        String token = jwtService.generateToken(user);

        return new OAuthExchangeResponse(token);
    }
}