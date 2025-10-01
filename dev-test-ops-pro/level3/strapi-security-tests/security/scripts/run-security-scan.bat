@echo off
REM Strapi Security Scan - Windows Version

echo ========================================
echo Strapi Security Scan
echo ========================================
echo.

REM Configuration
set TARGET_URL=http://host.docker.internal:1337
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set REPORT_NAME=security_scan_%TIMESTAMP%

echo Target URL: %TARGET_URL%
echo Report: %REPORT_NAME%
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop
    pause
    exit /b 1
)

REM Check if ZAP container is running
docker ps | findstr strapi-zap-security >nul
if errorlevel 1 (
    echo ERROR: ZAP container is not running!
    echo Starting ZAP container...
    docker-compose up -d
    echo Waiting for ZAP to start...
    timeout /t 10
)

echo Running baseline scan...
echo.

REM Run baseline scan
docker exec strapi-zap-security zap-baseline.py -t %TARGET_URL% -r /zap/reports/html/%REPORT_NAME%.html -J /zap/reports/json/%REPORT_NAME%.json -x /zap/reports/xml/%REPORT_NAME%.xml -a -j -l INFO

echo.
echo ========================================
echo Scan Complete!
echo ========================================
echo.
echo Reports generated in: .\security\reports\
echo   HTML: .\security\reports\html\%REPORT_NAME%.html
echo   JSON: .\security\reports\json\%REPORT_NAME%.json
echo   XML:  .\security\reports\xml\%REPORT_NAME%.xml
echo.
echo Opening HTML report...
start security\reports\html\%REPORT_NAME%.html
echo.
pause
