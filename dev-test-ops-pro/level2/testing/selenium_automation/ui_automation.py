import json
import pytest
import allure
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException


@pytest.fixture(scope="function")
def driver_setup():
    """Setup and teardown WebDriver"""
    service = Service()  # assumes chromedriver in PATH
    driver = webdriver.Chrome(service=service)
    driver.maximize_window()
    yield driver
    driver.quit()


@pytest.fixture(scope="session")
def config():
    """Load test configuration"""
    with open("test_config.json", "r") as f:
        return json.load(f)


@allure.feature('Authentication')
@allure.story('User Login')
@allure.title("Test successful user login with valid credentials")
@allure.description("This test verifies that a user can successfully login and navigate to the home page")
@allure.severity(allure.severity_level.CRITICAL)
class TestLogin:
    
    def test_login_success(self, driver_setup, config):
        """Test complete login flow"""
        driver = driver_setup
        
        # Step 1: Open URL
        with allure.step(f"Navigate to login page: {config['url']}"):
            driver.get(config["url"])
            allure.attach(
                driver.get_screenshot_as_png(),
                name="Login Page",
                attachment_type=allure.attachment_type.PNG
            )
            print("Opened URL:", config["url"])
        
        # Step 2: Enter Email
        with allure.step(f"Enter email: {config['email']}"):
            email_field = WebDriverWait(driver, 10).until(
                EC.visibility_of_element_located((By.XPATH, config["email_locator"]))
            )
            email_field.clear()
            email_field.send_keys(config["email"])
            allure.attach(
                config["email"],
                name="Email Entered",
                attachment_type=allure.attachment_type.TEXT
            )
            print("Entered email")
        
        # Step 3: Enter Password
        with allure.step("Enter password"):
            password_field = driver.find_element(By.XPATH, config["password_locator"])
            password_field.clear()
            password_field.send_keys(config["password"])
            allure.attach(
                driver.get_screenshot_as_png(),
                name="Credentials Filled",
                attachment_type=allure.attachment_type.PNG
            )
            print("Entered password")
        
        # Step 4: Click Login Button
        with allure.step("Click login button"):
            login_button = driver.find_element(By.XPATH, config["submit_button_locator"])
            login_button.click()
            print("Clicked login button")
        
        # Step 5: Verify Login Success
        with allure.step("Verify successful login and home page display"):
            try:
                home_element = WebDriverWait(driver, 15).until(
                    EC.text_to_be_present_in_element(
                        (By.XPATH, '//*[@id="root"]/div/h2'), 
                        "Home"
                    )
                )
                if home_element:
                    allure.attach(
                        driver.get_screenshot_as_png(),
                        name="Home Page Loaded Successfully",
                        attachment_type=allure.attachment_type.PNG
                    )
                    print("✅ Login Successful → Home Page is visible")
                    assert True, "Login successful"
                else:
                    allure.attach(
                        driver.get_screenshot_as_png(),
                        name="Login Failed - Text Mismatch",
                        attachment_type=allure.attachment_type.PNG
                    )
                    print("❌ Login Failed → Home text mismatch")
                    pytest.fail("Home text mismatch")
                    
            except TimeoutException as e:
                allure.attach(
                    driver.get_screenshot_as_png(),
                    name="Login Failed - Timeout",
                    attachment_type=allure.attachment_type.PNG
                )
                allure.attach(
                    str(e),
                    name="Error Details",
                    attachment_type=allure.attachment_type.TEXT
                )
                print("❌ Login Failed → Home element not found within timeout")
                pytest.fail(f"Home element not found within timeout: {str(e)}")


# Optional: Add a hook to capture screenshots on test failure
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Attach screenshot to Allure report on test failure"""
    outcome = yield
    rep = outcome.get_result()
    
    if rep.when == "call" and rep.failed:
        try:
            # Get the driver from the test fixtures
            driver = item.funcargs.get('driver_setup')
            if driver:
                allure.attach(
                    driver.get_screenshot_as_png(),
                    name="Failure Screenshot",
                    attachment_type=allure.attachment_type.PNG
                )
        except Exception as e:
            print(f"Failed to capture screenshot: {e}")


if __name__ == "__main__":
    # Run with pytest when executed directly
    pytest.main([__file__, "-v", "--alluredir=./allure-results"])