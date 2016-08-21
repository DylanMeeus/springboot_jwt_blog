package demo.security.jwt;

/**
 * Created by dylan on 20.08.16.
 */
public class AccountCredentials {

    private String username;
    private String password;

    String getUsername() { return username; }
    String getPassword() { return password; }

    public void setUsername(String _username) { this.username = _username; }
    public void setPassword(String _password) { this.password = _password; }
}
