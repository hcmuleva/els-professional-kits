#!/usr/bin/env python3
"""
Interactive Security Testing Demo Launcher
Provides easy access to all security testing features
"""
import os
import sys
import time
import subprocess
import argparse
from pathlib import Path

class SecurityDemoLauncher:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.vulnerable_process = None
        self.secure_process = None
        
    def show_banner(self):
        """Display the application banner"""
        print("=" * 60)
        print("🛡️  SECURITY TESTING LAB - INTERACTIVE LAUNCHER")
        print("=" * 60)
        print("📚 Learn Security by Testing Vulnerable vs Secure Apps")
        print("🎯 Develop Security Thinking for Developers")
        print("=" * 60)
        
    def show_menu(self):
        """Display the main menu"""
        print("\n🚀 Choose Your Learning Path:")
        print()
        print("1. 🔴 Test Vulnerable App Only")
        print("2. 🟢 Test Secure App Only") 
        print("3. 🔄 Compare Both Apps (Recommended)")
        print("4. 📊 Full Demo with HTML Reports")
        print("5. 🧪 Advanced Security Testing")
        print("6. 📖 View Learning Guide")
        print("0. ❌ Exit")
        print()
        
    def get_user_choice(self):
        """Get user menu selection"""
        while True:
            try:
                choice = input("👉 Enter your choice (0-6): ").strip()
                if choice in ['0', '1', '2', '3', '4', '5', '6']:
                    return choice
                print("❌ Invalid choice. Please enter 0-6.")
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                sys.exit(0)
                
    def start_app(self, app_file, port):
        """Start a Flask application"""
        try:
            print(f"🚀 Starting {app_file}...")
            process = subprocess.Popen([
                sys.executable, str(self.base_dir / app_file)
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            # Wait for app to start
            time.sleep(3)
            print(f"✅ Application running on http://localhost:{port}")
            return process
        except Exception as e:
            print(f"❌ Error starting {app_file}: {e}")
            return None
            
    def stop_app(self, process, name):
        """Stop a running application"""
        if process:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"🛑 Stopped {name}")
            except:
                process.kill()
                print(f"🔥 Force killed {name}")
                
    def run_security_test(self, target_url, app_type=""):
        """Run security tests against target"""
        print(f"\n🧪 Running Security Tests on {app_type}...")
        print(f"🎯 Target: {target_url}")
        print("-" * 50)
        
        try:
            result = subprocess.run([
                sys.executable, str(self.base_dir / "security_tester.py"), target_url
            ], capture_output=True, text=True, timeout=60)
            
            print(result.stdout)
            if result.stderr:
                print("Errors:", result.stderr)
                
            return result.returncode == 0
        except subprocess.TimeoutExpired:
            print("⏱️  Test timed out")
            return False
        except Exception as e:
            print(f"❌ Error running security test: {e}")
            return False
            
    def test_vulnerable_app(self):
        """Test only the vulnerable application"""
        print("\n🔴 TESTING VULNERABLE APPLICATION")
        print("=" * 40)
        
        self.vulnerable_process = self.start_app("vulnerable_app.py", 5000)
        if not self.vulnerable_process:
            return
            
        try:
            success = self.run_security_test("http://localhost:5000", "Vulnerable App")
            if success:
                print("\n📊 Expected Result: Multiple vulnerabilities detected")
                print("🎓 Learning: This shows what security issues look like")
            else:
                print("\n❌ Test failed or no vulnerabilities found")
        finally:
            self.stop_app(self.vulnerable_process, "Vulnerable App")
            
    def test_secure_app(self):
        """Test only the secure application"""
        print("\n🟢 TESTING SECURE APPLICATION")
        print("=" * 40)
        
        self.secure_process = self.start_app("secure_app.py", 5001)
        if not self.secure_process:
            return
            
        try:
            success = self.run_security_test("http://localhost:5001", "Secure App")
            if success:
                print("\n📊 Expected Result: No vulnerabilities detected")
                print("🎓 Learning: This shows how security fixes work")
            else:
                print("\n❌ Test failed")
        finally:
            self.stop_app(self.secure_process, "Secure App")
            
    def compare_both_apps(self):
        """Compare vulnerable vs secure applications"""
        print("\n🔄 COMPARING VULNERABLE VS SECURE APPLICATIONS")
        print("=" * 50)
        print("🎯 This is the recommended learning path!")
        print()
        
        # Start both apps
        print("1️⃣ Starting Vulnerable App...")
        self.vulnerable_process = self.start_app("vulnerable_app.py", 5000)
        if not self.vulnerable_process:
            return
            
        print("2️⃣ Starting Secure App...")
        self.secure_process = self.start_app("secure_app.py", 5001)
        if not self.secure_process:
            self.stop_app(self.vulnerable_process, "Vulnerable App")
            return
            
        try:
            # Test vulnerable app
            print("\n" + "="*50)
            print("🔴 PHASE 1: Testing Vulnerable Application")
            print("="*50)
            self.run_security_test("http://localhost:5000", "Vulnerable App")
            
            print("\n" + "="*50)
            print("🟢 PHASE 2: Testing Secure Application")
            print("="*50)
            self.run_security_test("http://localhost:5001", "Secure App")
            
            print("\n" + "="*50)
            print("🎓 LEARNING SUMMARY")
            print("="*50)
            print("✅ Compare the two test results above")
            print("✅ Examine code differences in vulnerable_app.py vs secure_app.py")  
            print("✅ Understand WHY each fix prevents the vulnerability")
            print("✅ Apply these patterns to your own projects")
            
        finally:
            self.stop_app(self.vulnerable_process, "Vulnerable App")
            self.stop_app(self.secure_process, "Secure App")
            
    def full_demo_with_reports(self):
        """Run full demo with HTML report generation"""
        print("\n📊 FULL DEMO WITH HTML REPORTS")
        print("=" * 40)
        print("🎯 Complete security assessment with professional reports")
        print()
        
        # Create comprehensive demo
        demo_script = """
import subprocess
import sys
import time
import os
from pathlib import Path

class ComprehensiveSecurityDemo:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        
    def run_full_demo(self):
        print("🚀 Starting Comprehensive Security Demo...")
        
        # Start vulnerable app
        print("\\n1️⃣ Testing Vulnerable Application...")
        vuln_process = subprocess.Popen([sys.executable, "vulnerable_app.py"], 
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(3)
        
        try:
            # Test vulnerable app
            result1 = subprocess.run([sys.executable, "security_tester.py", "http://localhost:5000"], 
                                   capture_output=True, text=True)
            print(result1.stdout)
            
        finally:
            vuln_process.terminate()
            vuln_process.wait()
            
        time.sleep(2)
        
        # Start secure app  
        print("\\n2️⃣ Testing Secure Application...")
        secure_process = subprocess.Popen([sys.executable, "secure_app.py"],
                                        stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(3)
        
        try:
            # Test secure app
            result2 = subprocess.run([sys.executable, "security_tester.py", "http://localhost:5001"],
                                   capture_output=True, text=True)
            print(result2.stdout)
            
        finally:
            secure_process.terminate()
            secure_process.wait()
            
        print("\\n✅ Demo Complete! Check for HTML reports in current directory.")

if __name__ == "__main__":
    demo = ComprehensiveSecurityDemo()
    demo.run_full_demo()
"""
        
        # Write and run demo script
        demo_file = self.base_dir / "temp_demo.py"
        with open(demo_file, 'w') as f:
            f.write(demo_script)
            
        try:
            subprocess.run([sys.executable, str(demo_file)])
        finally:
            demo_file.unlink(missing_ok=True)
            
    def advanced_security_testing(self):
        """Advanced security testing options"""
        print("\n🧪 ADVANCED SECURITY TESTING")
        print("=" * 40)
        print("1. Custom target URL testing")
        print("2. Payload customization")
        print("3. Report format options")
        print()
        
        choice = input("Choose advanced option (1-3) or Enter to skip: ").strip()
        
        if choice == "1":
            target = input("Enter target URL (e.g., http://localhost:5000): ").strip()
            if target:
                self.run_security_test(target, "Custom Target")
        elif choice == "2":
            print("💡 Edit security_tester.py to customize payloads")
            print("📁 Check the payloads in each test function")
        elif choice == "3":
            print("📊 Current formats: Console output, HTML reports, JSON data")
            print("💡 HTML reports are automatically generated during testing")
            
    def show_learning_guide(self):
        """Display the learning guide"""
        print("\n📖 SECURITY TESTING LEARNING GUIDE")
        print("=" * 45)
        print()
        print("🎯 OBJECTIVE:")
        print("   Develop security thinking by seeing vulnerabilities → fixes")
        print()
        print("📚 LEARNING PROCESS:")
        print("   1. Run vulnerable app → See what breaks")
        print("   2. Run security tests → Understand the issues") 
        print("   3. Run secure app → See how fixes work")
        print("   4. Compare code → Learn the patterns")
        print()
        print("🔍 KEY VULNERABILITIES:")
        print("   • SQL Injection (🔴 Critical)")
        print("   • XSS - Cross-Site Scripting (🟠 High)")
        print("   • IDOR - Insecure Direct Object Reference (🟡 Medium)")
        print("   • Command Injection (🔴 Critical)")
        print("   • Path Traversal (🟠 High)")
        print()
        print("💡 DEVELOPER SKILLS GAINED:")
        print("   ✅ Recognize security vulnerabilities in code")
        print("   ✅ Understand impact and exploitation methods")
        print("   ✅ Learn proper secure coding patterns")
        print("   ✅ Validate security fixes work correctly")
        print()
        input("📖 Press Enter to continue...")
        
    def run(self):
        """Main application loop"""
        self.show_banner()
        
        while True:
            self.show_menu()
            choice = self.get_user_choice()
            
            if choice == "0":
                print("\n👋 Thanks for using Security Testing Lab!")
                print("🎓 Keep building secure applications!")
                break
            elif choice == "1":
                self.test_vulnerable_app()
            elif choice == "2":
                self.test_secure_app()
            elif choice == "3":
                self.compare_both_apps()
            elif choice == "4":
                self.full_demo_with_reports()
            elif choice == "5":
                self.advanced_security_testing()
            elif choice == "6":
                self.show_learning_guide()
                
            print("\n" + "="*60)
            input("🔄 Press Enter to return to main menu...")

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Security Testing Lab Launcher")
    parser.add_argument("--full-demo", action="store_true", 
                       help="Run full automated demo with reports")
    parser.add_argument("--compare", action="store_true",
                       help="Compare vulnerable vs secure apps")
    parser.add_argument("--vulnerable-only", action="store_true",
                       help="Test only vulnerable app")
    parser.add_argument("--secure-only", action="store_true", 
                       help="Test only secure app")
    
    args = parser.parse_args()
    launcher = SecurityDemoLauncher()
    
    if args.full_demo:
        launcher.show_banner()
        launcher.full_demo_with_reports()
    elif args.compare:
        launcher.show_banner()
        launcher.compare_both_apps()
    elif args.vulnerable_only:
        launcher.show_banner()
        launcher.test_vulnerable_app()
    elif args.secure_only:
        launcher.show_banner()
        launcher.test_secure_app()
    else:
        # Interactive mode
        launcher.run()

if __name__ == "__main__":
    main()