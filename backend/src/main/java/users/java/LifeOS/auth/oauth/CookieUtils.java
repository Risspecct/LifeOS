package users.java.LifeOS.auth.oauth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.util.SerializationUtils;
import org.springframework.web.util.WebUtils;

import java.util.Base64;
import java.util.Optional;

public final class CookieUtils {

    private CookieUtils() {
    }

    public static Optional<Cookie> getCookie(
            HttpServletRequest request,
            String name
    ) {
        return Optional.ofNullable(
                WebUtils.getCookie(request, name)
        );
    }

    public static void addCookie(
            HttpServletResponse response,
            String name,
            String value,
            int maxAge
    ) {

        Cookie cookie = new Cookie(name, value);

        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(maxAge);

        response.addCookie(cookie);
    }

    public static void deleteCookie(
            HttpServletRequest request,
            HttpServletResponse response,
            String name
    ) {

        Cookie cookie = WebUtils.getCookie(request, name);

        if (cookie != null) {
            cookie.setValue("");
            cookie.setPath("/");
            cookie.setMaxAge(0);

            response.addCookie(cookie);
        }
    }

    public static String serialize(Object object) {

        return Base64.getUrlEncoder()
                .encodeToString(
                        SerializationUtils.serialize(object)
                );
    }

    @SuppressWarnings("unchecked")
    public static <T> T deserialize(
            Cookie cookie,
            Class<T> cls
    ) {

        return cls.cast(
                SerializationUtils.deserialize(
                        Base64.getUrlDecoder()
                                .decode(cookie.getValue())
                )
        );
    }
}