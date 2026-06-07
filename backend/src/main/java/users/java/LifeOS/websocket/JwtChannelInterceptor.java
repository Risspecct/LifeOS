package users.java.LifeOS.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import users.java.LifeOS.auth.services.JwtService;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(
                        message,
                        StompHeaderAccessor.class
                );

        System.out.println(accessor.getCommand());

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return null;
            }

            String jwt = authHeader.substring(7);
            if(jwt.isBlank()) {
                return null;
            }

            try {
                String username = jwtService.extractUsername(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if(!jwtService.isTokenValid(jwt, userDetails.getUsername()))
                    return null;

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                  userDetails,
                        null,
                                userDetails.getAuthorities()
                        );
                accessor.setUser(authentication);
            }
            catch (Exception e) {
                log.warn("WebSocket authentication failed", e);
                return null;
            }
        }
        return message;
    }
}
