import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

# -------------------------
# Load Config
# -------------------------
with open("test_config.json", "r") as f:
    config = json.load(f)

# -------------------------
# Setup WebDriver
# -------------------------
service = Service()  # assumes chromedriver in PATH
driver = webdriver.Chrome(service=service)
driver.maximize_window()

try:
    # Step 1: Open URL
    driver.get(config["url"])
    print("Opened URL:", config["url"])

    # Step 2: Enter Email
    email_field = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, config["email_locator"]))
    )
    email_field.clear()
    email_field.send_keys(config["email"])
    print("Entered email")

    # Step 3: Enter Password
    password_field = driver.find_element(By.XPATH, config["password_locator"])
    password_field.clear()
    password_field.send_keys(config["password"])
    print("Entered password")

    # Step 4: Click Login Button
    login_button = driver.find_element(By.XPATH, config["submit_button_locator"])
    login_button.click()
    print("Clicked login button")

    # Step 5: Verify Login Success → Check text in h2
    try:
        home_element = WebDriverWait(driver, 15).until(
            EC.text_to_be_present_in_element((By.XPATH, '//*[@id="root"]/div/h2'), "Home")
        )
        if home_element:
            print("✅ Login Successful → Home Page is visible")
        else:
            print("❌ Login Failed → Home text mismatch")
    except TimeoutException:
        print("❌ Login Failed → Home element not found within timeout")

finally:
    time.sleep(3)
    driver.quit()
