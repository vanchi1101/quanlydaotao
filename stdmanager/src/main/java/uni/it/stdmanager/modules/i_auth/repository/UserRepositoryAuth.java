package uni.it.stdmanager.modules.i_auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uni.it.stdmanager.modules.i_auth.entity.UserAuth;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepositoryAuth extends JpaRepository<UserAuth, UUID> {
    Optional<UserAuth> findByUsername(String username);
}