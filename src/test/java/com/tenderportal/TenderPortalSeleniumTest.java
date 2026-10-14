package com.tenderportal;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TenderPortalSeleniumTest {

    @LocalServerPort
    private int port;

    private WebDriver driver;
    private WebDriverWait wait;
    private String baseUrl;

    @BeforeAll
    static void setupClass() {
        WebDriverManager.chromedriver().setup();
    }

    @BeforeEach
    void setupTest() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");

        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        baseUrl = "http://localhost:" + port;
    }

    @AfterEach
    void tearDown(TestInfo testInfo) {
        if (driver != null) {
            try {
                captureScreenshot(testInfo.getDisplayName().replace(" ", "_"));
            } finally {
                driver.quit();
            }
        }
    }

    @Test
    @DisplayName("Journey 1: Command Center Landing & Tenders Catalog Verification")
    void testLandingPageAndCatalog() {
        driver.get(baseUrl);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.id("tender-list")));

        WebElement heading = driver.findElement(By.tagName("h2"));
        assertTrue(heading.getText().contains("Tender Workflow Command Center"),
            "Main command center heading should be visible");

        WebElement spend = driver.findElement(By.id("stat-spend"));
        assertNotNull(spend);
    }

    @Test
    @DisplayName("Journey 2: Tender Application Submission Modal and Form Validation")
    void testTenderSubmissionModal() {
        driver.get(baseUrl);
        WebElement newBidBtn = wait.until(ExpectedConditions.elementToBeClickable(By.id("new-bid-btn")));
        newBidBtn.click();

        WebElement modal = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("submission-modal")));
        assertTrue(modal.isDisplayed(), "Submission modal should open upon clicking button");

        WebElement submitBtn = driver.findElement(By.id("submit-button"));
        assertNotNull(submitBtn);
    }

    @Test
    @DisplayName("Journey 3: Reviewer Queue & Audit Ledger Rendering")
    void testAuditLedgerRendering() {
        driver.get(baseUrl);
        WebElement tableBody = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("submissions-table-body")));
        assertNotNull(tableBody);
    }

    private void captureScreenshot(String name) {
        try {
            TakesScreenshot ts = (TakesScreenshot) driver;
            byte[] screenshot = ts.getScreenshotAs(OutputType.BYTES);
            Path screenshotDir = Paths.get("target/screenshots");
            Files.createDirectories(screenshotDir);
            Path filePath = screenshotDir.resolve(name + ".png");
            Files.write(filePath, screenshot);
        } catch (Exception e) {
            System.err.println("Could not capture screenshot: " + e.getMessage());
        }
    }
}
