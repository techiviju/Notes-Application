package notesapp.util;

import java.security.SecureRandom;
import java.util.Base64;

public class ShareTokenGenerator {
    
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();
    
    public static String generateShareToken() {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
    
    public static boolean isValidTokenFormat(String token) {
        return token != null && token.length() >= 20 && token.length() <= 64;
    }
}
