import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginTest {
    public static void main(String[] args) {
        // System.setProperty("webdriver.chrome.driver", "/path/to/chromedriver");
        WebDriver driver = new ChromeDriver();
        
        try {
            driver.get("http://localhost");
            
            driver.findElement(By.linkText("Login")).click();
            driver.findElement(By.id("login-email")).sendKeys("applicant@example.com");
            driver.findElement(By.id("login-password")).sendKeys("password");
            driver.findElement(By.id("login-button")).click();
            
            Thread.sleep(2000);
            if (driver.getCurrentUrl().contains("/applicant")) {
                System.out.println("Login test passed!");
            } else {
                System.out.println("Login test failed!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }
}
