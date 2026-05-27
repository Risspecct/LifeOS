package users.java.LifeOS.auth.services;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import users.java.LifeOS.exceptions.NotFoundException;
import users.java.LifeOS.user.UserRepository;
import users.java.LifeOS.auth.UserPrincipal;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    MyUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (this.userRepository.existsByEmail(username))
            return new UserPrincipal(this.userRepository.findByEmail(username)
                    .orElseThrow(() -> new NotFoundException("No user exists with this email")));
        else return null;
    }
}