#!/usr/bin/env python3
"""
Security Testing Script - Vulnerability Scanner
==============================================
This script demonstrates how to test for common web application vulnerabilities
using automated security testing techniques.

⚠️  ETHICAL NOTICE: Only use this against applications you own or have permission to test.
"""

import requests
import time
import json
import sys
import urllib.parse
from pathlib import Path
from datetime import datetime
import webbrowser
import os

class WebSecurityTester:
    """Automated web application security tester"""
    
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
        self.session = requests.Session()
        self.vulnerabilities = []
        self.test_results = {}
        
    def log_vulnerability(self, vuln_type, endpoint, payload, description, severity="Medium", fix_recommendation=""):
        """Log discovered vulnerability with fix recommendation"""
        vuln = {
            'type': vuln_type,
            'endpoint': endpoint,
            'payload': payload,
            'description': description,
            'severity': severity,
            'fix_recommendation': fix_recommendation,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        self.vulnerabilities.append(vuln)
        
        severity_emoji = {"Critical": "🔴", "High": "🟠", "Medium": "🟡", "Low": "🟢"}
        print(f"{severity_emoji.get(severity, '🔵')} [{severity}] {vuln_type} found at {endpoint}")
        print(f"   Payload: {payload}")
        print(f"   Description: {description}")
        if fix_recommendation:
            print(f"   💡 Fix: {fix_recommendation}")
        print()
    
    def test_connection(self):
        """Test if the target application is accessible"""
        print("🔍 Testing connection to target application...")
        
        try:
            response = self.session.get(self.base_url, timeout=5)
            if response.status_code == 200:
                print(f"✅ Successfully connected to {self.base_url}")
                return True
            else:
                print(f"❌ Connection failed. Status code: {response.status_code}")
                return False
        except requests.ConnectionError:
            print(f"❌ Cannot connect to {self.base_url}")
            print("   Make sure the vulnerable application is running!")
            return False
        except Exception as e:
            print(f"❌ Connection error: {str(e)}")
            return False
    
    def test_sql_injection_login(self):
        """Test for SQL injection in login form"""
        print("🧪 Testing SQL Injection in Login Form...")
        
        # Common SQL injection payloads
        payloads = [
            "admin' OR '1'='1",
            "admin' OR '1'='1'--",
            "admin' OR 1=1#",
            "' OR 'a'='a",
            "admin'; DROP TABLE users;--",
            "admin' UNION SELECT 1,2,3,4,5--"
        ]
        
        for payload in payloads:
            data = {
                'username': payload,
                'password': 'test'
            }
            
            try:
                response = self.session.post(f"{self.base_url}/login", data=data)
                
                # Check for successful bypass
                if "Login successful" in response.text or "Welcome" in response.text:
                    self.log_vulnerability(
                        "SQL Injection",
                        "/login",
                        payload,
                        "Authentication bypass through SQL injection",
                        "Critical",
                        "Use parameterized queries: cursor.execute('SELECT * FROM users WHERE username = ?', (username,))"
                    )
                    break
                    
                # Check for SQL errors (error-based injection)
                elif any(error in response.text.lower() for error in ['syntax error', 'sqlite_error', 'database', 'sql']):
                    self.log_vulnerability(
                        "SQL Injection (Error-based)",
                        "/login",
                        payload,
                        "SQL errors exposed, potential for error-based injection",
                        "High",
                        "Implement proper error handling and use parameterized queries"
                    )
                
            except Exception as e:
                print(f"   Error testing payload '{payload}': {str(e)}")
    
    def test_sql_injection_search(self):
        """Test for SQL injection in search functionality"""
        print("🧪 Testing SQL Injection in Search...")
        
        payloads = [
            "' UNION SELECT 1,username,password,email FROM users--",
            "' UNION SELECT 1,2,3,4--",
            "test' AND 1=1--",
            "test' AND 1=2--",
            "'; SELECT * FROM users--"
        ]
        
        for payload in payloads:
            try:
                params = {'q': payload}
                response = self.session.get(f"{self.base_url}/search", params=params)
                
                # Check for data extraction
                if any(keyword in response.text.lower() for keyword in ['admin', 'password', 'secret', 'alice', 'john']):
                    self.log_vulnerability(
                        "SQL Injection (UNION-based)",
                        "/search",
                        payload,
                        "Data extraction through UNION-based SQL injection",
                        "Critical",
                        "Use parameterized queries and input validation for all search functionality"
                    )
                    break
                    
                # Check for SQL errors
                elif any(error in response.text.lower() for error in ['syntax error', 'sqlite_error']):
                    self.log_vulnerability(
                        "SQL Injection (Error-based)",
                        "/search",
                        payload,
                        "SQL syntax errors indicate potential injection point",
                        "High",
                        "Implement proper error handling to prevent information disclosure"
                    )
                    
            except Exception as e:
                print(f"   Error testing search payload: {str(e)}")
    
    def test_xss_vulnerabilities(self):
        """Test for Cross-Site Scripting vulnerabilities"""
        print("🧪 Testing Cross-Site Scripting (XSS)...")
        
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src=javascript:alert('XSS')></iframe>",
            "';alert('XSS');//"
        ]
        
        # Test XSS in search
        print("   Testing XSS in search functionality...")
        for payload in xss_payloads:
            try:
                params = {'q': payload}
                response = self.session.get(f"{self.base_url}/search", params=params)
                
                # Check if payload is reflected without encoding
                if payload in response.text:
                    self.log_vulnerability(
                        "Reflected XSS",
                        "/search",
                        payload,
                        "User input reflected without proper encoding/sanitization",
                        "High",
                        "Use html.escape() or similar functions to encode all output"
                    )
                    break
                    
            except Exception as e:
                print(f"   Error testing XSS in search: {str(e)}")
        
        # Test XSS in messages
        print("   Testing XSS in message posting...")
        for payload in xss_payloads[:2]:  # Test first 2 payloads
            try:
                data = {'message': payload}
                response = self.session.post(f"{self.base_url}/messages", data=data)
                
                # Get messages page to see if XSS payload is stored
                response = self.session.get(f"{self.base_url}/messages")
                
                if payload in response.text:
                    self.log_vulnerability(
                        "Stored XSS",
                        "/messages",
                        payload,
                        "XSS payload stored and executed on page load",
                        "Critical"
                    )
                    break
                    
            except Exception as e:
                print(f"   Error testing stored XSS: {str(e)}")
    
    def test_idor_vulnerabilities(self):
        """Test for Insecure Direct Object References"""
        print("🧪 Testing Insecure Direct Object References (IDOR)...")
        
        # Test accessing different user profiles
        user_ids = [1, 2, 3, 999, -1]
        accessible_profiles = []
        
        for user_id in user_ids:
            try:
                response = self.session.get(f"{self.base_url}/profile/{user_id}")
                
                if response.status_code == 200 and "Profile Information" in response.text:
                    accessible_profiles.append(user_id)
                    
                    # Check if sensitive data is exposed
                    if "Password:" in response.text:
                        self.log_vulnerability(
                            "IDOR + Information Disclosure",
                            f"/profile/{user_id}",
                            f"user_id={user_id}",
                            f"Can access user profile {user_id} without authorization, password exposed",
                            "High"
                        )
                        
            except Exception as e:
                print(f"   Error testing IDOR for user {user_id}: {str(e)}")
        
        if len(accessible_profiles) > 1:
            self.log_vulnerability(
                "Insecure Direct Object Reference",
                "/profile/*",
                "Multiple user IDs",
                f"Can access {len(accessible_profiles)} different user profiles without authorization",
                "Medium",
                "Implement proper authorization checks before data access"
            )
    
    def test_command_injection(self):
        """Test for command injection vulnerabilities"""
        print("🧪 Testing Command Injection...")
        
        # Command injection payloads
        payloads = [
            "127.0.0.1; ls -la",
            "8.8.8.8 && whoami",
            "google.com | cat /etc/passwd",
            "localhost; pwd",
            "127.0.0.1 & echo 'COMMAND_INJECTION_TEST'"
        ]
        
        for payload in payloads:
            try:
                data = {'host': payload}
                response = self.session.post(f"{self.base_url}/ping", data=data)
                
                # Check for command injection indicators
                if any(indicator in response.text.lower() for indicator in 
                      ['total ', 'drwx', 'root:', 'uid=', 'command_injection_test']):
                    self.log_vulnerability(
                        "Command Injection",
                        "/ping",
                        payload,
                        "Operating system command injection vulnerability",
                        "Critical",
                        "Use parameterized commands and input validation"
                    )
                    break
                    
            except Exception as e:
                print(f"   Error testing command injection: {str(e)}")
    
    def test_path_traversal(self):
        """Test for path traversal vulnerabilities"""
        print("🧪 Testing Path Traversal...")
        
        # Path traversal payloads
        payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\drivers\\etc\\hosts",
            "....//....//....//etc/passwd",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
            "../../app.py",
            "../vulnerable_app.py"
        ]
        
        for payload in payloads:
            try:
                params = {'file': payload}
                response = self.session.get(f"{self.base_url}/files", params=params)
                
                # Check for successful file access
                if any(indicator in response.text.lower() for indicator in 
                      ['root:', '/bin/bash', 'from flask import', 'def ', 'import ']):
                    self.log_vulnerability(
                        "Path Traversal",
                        "/files",
                        payload,
                        "Can access files outside intended directory",
                        "High",
                        "Validate and sanitize file paths, use whitelisting"
                    )
                    break
                    
            except Exception as e:
                print(f"   Error testing path traversal: {str(e)}")
    
    def test_security_headers(self):
        """Test for missing security headers"""
        print("🧪 Testing Security Headers...")
        
        try:
            response = self.session.get(self.base_url)
            headers = response.headers
            
            # Check for important security headers
            security_headers = {
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'Strict-Transport-Security': 'max-age=',
                'Content-Security-Policy': 'default-src'
            }
            
            missing_headers = []
            for header, expected in security_headers.items():
                if header not in headers:
                    missing_headers.append(header)
            
            if missing_headers:
                self.log_vulnerability(
                    "Missing Security Headers",
                    "/",
                    "N/A",
                    f"Missing security headers: {', '.join(missing_headers)}",
                    "Medium"
                )
        
        except Exception as e:
            print(f"   Error testing security headers: {str(e)}")
    
    def generate_report(self):
        """Generate comprehensive security test report"""
        print("\n" + "="*80)
        print("📊 SECURITY TEST REPORT")
        print("="*80)
        
        if not self.vulnerabilities:
            print("✅ No vulnerabilities detected in this scan.")
            print("   Note: This doesn't guarantee the application is secure.")
            return
        
        # Count vulnerabilities by severity
        severity_counts = {}
        for vuln in self.vulnerabilities:
            severity = vuln['severity']
            severity_counts[severity] = severity_counts.get(severity, 0) + 1
        
        print(f"🚨 Total vulnerabilities found: {len(self.vulnerabilities)}")
        print("\n📈 Vulnerability Breakdown:")
        for severity in ['Critical', 'High', 'Medium', 'Low']:
            count = severity_counts.get(severity, 0)
            if count > 0:
                emoji = {"Critical": "🔴", "High": "🟠", "Medium": "🟡", "Low": "🟢"}[severity]
                print(f"   {emoji} {severity}: {count}")
        
        print("\n📋 Detailed Findings:")
        print("-" * 80)
        
        for i, vuln in enumerate(self.vulnerabilities, 1):
            print(f"\n{i}. {vuln['type']} ({vuln['severity']})")
            print(f"   Endpoint: {vuln['endpoint']}")
            print(f"   Payload: {vuln['payload']}")
            print(f"   Description: {vuln['description']}")
            print(f"   Discovered: {vuln['timestamp']}")
        
        # Risk assessment
        critical_count = severity_counts.get('Critical', 0)
        high_count = severity_counts.get('High', 0)
        
        print("\n⚠️  RISK ASSESSMENT:")
        if critical_count > 0:
            print("   🔴 CRITICAL RISK: Immediate attention required!")
            print("      Application is highly vulnerable to attack.")
        elif high_count > 0:
            print("   🟠 HIGH RISK: Should be addressed urgently.")
            print("      Application has serious security issues.")
        else:
            print("   🟡 MEDIUM RISK: Should be addressed in next release.")
        
        print("\n💡 RECOMMENDED ACTIONS:")
        print("   1. Fix all Critical and High severity vulnerabilities immediately")
        print("   2. Implement input validation and output encoding")
        print("   3. Use parameterized queries to prevent SQL injection")
        print("   4. Add proper authentication and authorization checks")
        print("   5. Implement security headers")
        print("   6. Regular security testing and code reviews")
        
        # Save report to file
        self.save_report_to_file()

    def generate_reports(self, app_type="Unknown"):
        """Generate both console and HTML reports"""
        self.generate_report()
        html_file = self.generate_html_report(app_type)
        return html_file
    
    def generate_html_report(self, app_type="Unknown"):
        """Generate professional HTML report"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Calculate metrics
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        for vuln in self.vulnerabilities:
            severity_counts[vuln['severity']] = severity_counts.get(vuln['severity'], 0) + 1
        
        # Calculate risk score
        risk_score = (severity_counts['Critical'] * 25 + 
                     severity_counts['High'] * 15 + 
                     severity_counts['Medium'] * 8 + 
                     severity_counts['Low'] * 3)
        
        max_possible_score = len(self.vulnerabilities) * 25 if self.vulnerabilities else 1
        risk_percentage = min((risk_score / max_possible_score) * 100, 100)
        
        # Determine risk level
        if risk_percentage >= 70:
            risk_level = "🔴 CRITICAL RISK"
            risk_color = "#d32f2f"
        elif risk_percentage >= 40:
            risk_level = "🟠 HIGH RISK" 
            risk_color = "#f57c00"
        elif risk_percentage >= 20:
            risk_level = "🟡 MEDIUM RISK"
            risk_color = "#fbc02d"
        else:
            risk_level = "🟢 LOW RISK"
            risk_color = "#388e3c"

        html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Security Assessment Report - {app_type} Application</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; padding: 20px;
        }}
        .container {{ 
            max-width: 1200px; margin: 0 auto; background: white;
            border-radius: 15px; box-shadow: 0 20px 60px rgba(0,0,0,0.1); overflow: hidden;
        }}
        .header {{
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white; padding: 40px; text-align: center;
        }}
        .header h1 {{ font-size: 2.5rem; margin-bottom: 10px; }}
        .risk-assessment {{ background: {risk_color}; color: white; padding: 30px; text-align: center; }}
        .metrics-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }}
        .metric-card {{ background: linear-gradient(135deg, #4FC3F7 0%, #2196F3 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; }}
        .metric-card h3 {{ margin: 0 0 10px 0; opacity: 0.9; }}
        .metric-card .value {{ font-size: 2.5em; font-weight: bold; }}
        .severity-breakdown {{ padding: 30px; background: #f8f9fa; }}
        .severity-grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 20px; }}
        .severity-card {{ padding: 20px; border-radius: 8px; text-align: center; color: white; }}
        .critical {{ background: linear-gradient(135deg, #d32f2f, #f44336); }}
        .high {{ background: linear-gradient(135deg, #f57c00, #ff9800); }}
        .medium {{ background: linear-gradient(135deg, #fbc02d, #ffeb3b); color: #333; }}
        .low {{ background: linear-gradient(135deg, #388e3c, #4caf50); }}
        .vulnerability {{ background: white; border-left: 6px solid #f44336; margin: 25px 0; padding: 25px; border-radius: 0 12px 12px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }}
        .vuln-header {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }}
        .vuln-title {{ font-size: 1.3em; font-weight: bold; color: #333; }}
        .severity-badge {{ padding: 8px 16px; border-radius: 25px; color: white; font-weight: bold; }}
        .vuln-details {{ line-height: 1.8; color: #555; }}
        .code {{ background: #2d3748; color: #e2e8f0; padding: 10px; border-radius: 5px; font-family: monospace; }}
        .fix-recommendation {{ background: linear-gradient(135deg, #e8f5e8, #c8e6c9); border-left: 4px solid #4caf50; padding: 20px; margin-top: 20px; border-radius: 0 8px 8px 0; }}
        .no-vulnerabilities {{ text-align: center; padding: 60px; background: linear-gradient(135deg, #e8f5e8, #c8e6c9); border-radius: 12px; color: #2e7d32; margin: 20px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Security Assessment Report</h1>
            <h2>{app_type} Application</h2>
            <p>Generated on: {timestamp}</p>
            <p>Target: {self.base_url}</p>
        </div>
        
        <div class="risk-assessment">
            <h2>Overall Risk Level: {risk_level}</h2>
            <p>Risk Score: {risk_score} | Risk Percentage: {risk_percentage:.1f}%</p>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>Total Vulnerabilities</h3>
                <div class="value">{len(self.vulnerabilities)}</div>
            </div>
            <div class="metric-card">
                <h3>Risk Score</h3>
                <div class="value">{risk_score}</div>
            </div>
            <div class="metric-card">
                <h3>Tests Performed</h3>
                <div class="value">7</div>
            </div>
        </div>
        
        <div class="severity-breakdown">
            <h2>Vulnerability Breakdown by Severity</h2>
            <div class="severity-grid">
                <div class="severity-card critical">
                    <h3>🔴 Critical</h3>
                    <h2>{severity_counts['Critical']}</h2>
                </div>
                <div class="severity-card high">
                    <h3>🟠 High</h3>
                    <h2>{severity_counts['High']}</h2>
                </div>
                <div class="severity-card medium">
                    <h3>🟡 Medium</h3>
                    <h2>{severity_counts['Medium']}</h2>
                </div>
                <div class="severity-card low">
                    <h3>🟢 Low</h3>
                    <h2>{severity_counts['Low']}</h2>
                </div>
            </div>
        </div>'''
        
        if not self.vulnerabilities:
            html_content += '''
        <div class="no-vulnerabilities">
            <h2>✅ Excellent! No Vulnerabilities Detected</h2>
            <p>This security scan did not detect any vulnerabilities in the tested application.</p>
        </div>'''
        else:
            html_content += '<div style="padding: 30px;"><h2>🔍 Detailed Vulnerability Findings</h2>'
            
            for i, vuln in enumerate(self.vulnerabilities, 1):
                severity_colors = {
                    "Critical": "#d32f2f", "High": "#f57c00", "Medium": "#fbc02d", "Low": "#388e3c"
                }
                
                html_content += f'''
        <div class="vulnerability">
            <div class="vuln-header">
                <div class="vuln-title">{i}. {vuln['type']}</div>
                <div class="severity-badge" style="background-color: {severity_colors.get(vuln['severity'], '#666')}">
                    {vuln['severity']}
                </div>
            </div>
            <div class="vuln-details">
                <p><strong>📍 Endpoint:</strong> <code>{vuln['endpoint']}</code></p>
                <p><strong>🎯 Payload:</strong> <div class="code">{vuln['payload']}</div></p>
                <p><strong>📝 Description:</strong> {vuln['description']}</p>
                <p><strong>⏰ Discovered:</strong> {vuln['timestamp']}</p>
                {f'<div class="fix-recommendation"><strong>🔧 Fix Recommendation:</strong><br>{vuln.get("fix_recommendation", "Implement proper security measures.")}</div>' if vuln.get('fix_recommendation') else ''}
            </div>
        </div>'''
            
            html_content += '</div>'
        
        html_content += '''
        <div style="background: #2c3e50; color: white; text-align: center; padding: 30px;">
            <p>Security Assessment Report | Educational Security Testing Lab</p>
            <p><em>This report was generated for educational purposes only</em></p>
        </div>
    </div>
</body>
</html>'''
        
        # Save HTML report
        filename = f"security_report_{app_type.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html_content)
            
            print(f"📄 Professional HTML report saved to: {filename}")
            
            # Try to open in browser
            try:
                file_path = os.path.abspath(filename)
                webbrowser.open(f'file://{file_path}')
                print(f"🌐 Opening report in your default browser...")
            except:
                print(f"💡 Open the report manually: open {filename}")
                
            return filename
            
        except Exception as e:
            print(f"❌ Error saving HTML report: {str(e)}")
            return None

    def save_report_to_file(self):
        """Save detailed report to JSON file"""
        report_data = {
            'scan_timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'target_url': self.base_url,
            'total_vulnerabilities': len(self.vulnerabilities),
            'vulnerabilities': self.vulnerabilities
        }
        
        report_file = 'security_test_report.json'
        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\n📄 Detailed report saved to: {report_file}")
        return report_file
    
    def run_full_security_scan(self):
        """Run comprehensive security test suite"""
        print("🔐 Starting Comprehensive Security Scan")
        print("="*50)
        
        # Test connection first
        if not self.test_connection():
            print("\n❌ Cannot proceed with security testing. Application not accessible.")
            return False
        
        print("\n🚀 Beginning vulnerability assessment...\n")
        
        # Run all security tests
        try:
            self.test_sql_injection_login()
            self.test_sql_injection_search()
            self.test_xss_vulnerabilities()
            self.test_idor_vulnerabilities()
            self.test_command_injection()
            self.test_path_traversal()
            self.test_security_headers()
            
        except KeyboardInterrupt:
            print("\n⏹️  Scan interrupted by user")
            return False
        except Exception as e:
            print(f"\n❌ Unexpected error during scan: {str(e)}")
            return False
        
        # Generate comprehensive report
        self.generate_report()
        return True

def main():
    """Main function to run security tests"""
    print("🛡️  Web Application Security Tester")
    print("=====================================")
    print("This tool tests for common web application vulnerabilities.")
    print("\n⚠️  ETHICAL NOTICE:")
    print("   • Only test applications you own or have permission to test")
    print("   • This tool is for educational and defensive purposes only")
    print("   • Follow responsible disclosure for any real vulnerabilities found")
    
    # Get target URL
    target_url = input("\nEnter target URL (default: http://localhost:5000): ").strip()
    if not target_url:
        target_url = "http://localhost:5000"
    
    print(f"\n🎯 Target: {target_url}")
    print("⏱️  Starting security assessment...")
    
    # Initialize tester
    tester = WebSecurityTester(target_url)
    
    # Run security scan
    success = tester.run_full_security_scan()
    
    if success:
        # Determine app type based on URL
        app_type = "Vulnerable" if "5000" in target_url else "Secure" if "5001" in target_url else "Unknown"
        
        # Generate comprehensive reports
        tester.generate_report()
        html_file = tester.generate_html_report(app_type)
        
        print("\n✅ Security scan completed successfully!")
        print("📋 Review the findings above and take appropriate action.")
        if html_file:
            print(f"🌐 Professional HTML report generated: {html_file}")
    else:
        print("\n❌ Security scan failed or was interrupted.")
    
    print("\n🔧 Next Steps:")
    print("   1. Review and understand each vulnerability")
    print("   2. Prioritize fixes based on severity")
    print("   3. Test the secure version of the application")
    print("   4. Implement security best practices")

if __name__ == "__main__":
    main()