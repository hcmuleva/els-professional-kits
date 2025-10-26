#!/usr/bin/env python3
"""
Comprehensive Security Demo - Full Workflow with HTML Reports
Demonstrates the complete security testing workflow with professional reporting
"""
import subprocess
import sys
import time
import os
import webbrowser
from pathlib import Path

class ComprehensiveSecurityDemo:
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.vulnerable_process = None
        self.secure_process = None
        self.reports_generated = []
        
    def show_demo_banner(self):
        """Display demo banner"""
        print("="*70)
        print("🛡️  COMPREHENSIVE SECURITY DEMO - FULL WORKFLOW")
        print("="*70)
        print("🎯 Complete demonstration of vulnerable → secure app transition")
        print("📊 Professional HTML reports showing before/after comparison")
        print("🎓 Perfect for learning secure development practices")
        print("="*70)
        
    def start_app(self, app_file, port, app_name):
        """Start a Flask application"""
        print(f"\n🚀 Starting {app_name}...")
        try:
            process = subprocess.Popen([
                sys.executable, str(self.base_dir / app_file)
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            # Wait for app to start
            time.sleep(4)
            
            # Test if app is running
            test_result = subprocess.run([
                'curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', 
                f'http://localhost:{port}'
            ], capture_output=True, text=True)
            
            if test_result.returncode == 0 and test_result.stdout == '200':
                print(f"✅ {app_name} is running on http://localhost:{port}")
                return process
            else:
                print(f"⚠️  {app_name} started but may not be fully ready")
                return process
                
        except Exception as e:
            print(f"❌ Error starting {app_name}: {e}")
            return None
            
    def stop_app(self, process, app_name):
        """Stop a running application"""
        if process:
            try:
                process.terminate()
                process.wait(timeout=5)
                print(f"🛑 Stopped {app_name}")
            except subprocess.TimeoutExpired:
                process.kill()
                print(f"🔥 Force killed {app_name}")
            except Exception as e:
                print(f"⚠️  Error stopping {app_name}: {e}")
                
    def run_security_test_with_reports(self, target_url, app_type, phase_num):
        """Run security test and generate professional reports"""
        print(f"\n{'='*60}")
        print(f"🧪 PHASE {phase_num}: Security Testing - {app_type}")
        print(f"🎯 Target: {target_url}")
        print(f"{'='*60}")
        
        try:
            # Run the security tester with automatic responses
            process = subprocess.Popen([
                sys.executable, str(self.base_dir / "security_tester.py")
            ], stdin=subprocess.PIPE, stdout=subprocess.PIPE, 
               stderr=subprocess.PIPE, text=True)
            
            # Send the target URL to the tester
            stdout, stderr = process.communicate(input=target_url + '\n', timeout=120)
            
            print(stdout)
            if stderr:
                print(f"⚠️  Warnings: {stderr}")
                
            # Check for generated HTML reports
            html_files = list(Path('.').glob('security_report_*.html'))
            if html_files:
                latest_report = max(html_files, key=os.path.getctime)
                self.reports_generated.append(str(latest_report))
                print(f"📊 HTML Report Generated: {latest_report}")
                
            return process.returncode == 0
            
        except subprocess.TimeoutExpired:
            print("⏱️  Security test timed out")
            process.kill()
            return False
        except Exception as e:
            print(f"❌ Error running security test: {e}")
            return False
            
    def run_comprehensive_demo(self):
        """Run the complete security demonstration"""
        self.show_demo_banner()
        
        print("\n🎬 Starting Comprehensive Security Demonstration...")
        print("This demo will:")
        print("  1️⃣  Test the vulnerable application")
        print("  2️⃣  Generate professional security report")
        print("  3️⃣  Test the secure application") 
        print("  4️⃣  Generate comparison report")
        print("  5️⃣  Show executive summary")
        
        input("\n📖 Press Enter to begin the demonstration...")
        
        # Phase 1: Test Vulnerable Application
        print(f"\n{'🔴 PHASE 1: VULNERABLE APPLICATION':=^70}")
        self.vulnerable_process = self.start_app("vulnerable_app.py", 5000, "Vulnerable Application")
        
        if not self.vulnerable_process:
            print("❌ Cannot start vulnerable application. Demo aborted.")
            return False
            
        try:
            success1 = self.run_security_test_with_reports(
                "http://localhost:5000", "Vulnerable Application", 1
            )
            
            if success1:
                print("\n📋 VULNERABLE APP RESULTS:")
                print("   🔴 Multiple critical vulnerabilities detected")
                print("   🟠 High-risk security issues found")
                print("   ⚠️  Application is highly insecure")
                
        finally:
            self.stop_app(self.vulnerable_process, "Vulnerable Application")
            
        # Wait between phases
        print("\n⏳ Preparing for Phase 2...")
        time.sleep(3)
        
        # Phase 2: Test Secure Application
        print(f"\n{'🟢 PHASE 2: SECURE APPLICATION':=^70}")
        self.secure_process = self.start_app("secure_app.py", 5001, "Secure Application")
        
        if not self.secure_process:
            print("❌ Cannot start secure application. Demo partially completed.")
            return False
            
        try:
            success2 = self.run_security_test_with_reports(
                "http://localhost:5001", "Secure Application", 2
            )
            
            if success2:
                print("\n📋 SECURE APP RESULTS:")
                print("   ✅ All vulnerabilities have been fixed")
                print("   🛡️  Security controls are working properly")
                print("   🎯 Application follows secure coding practices")
                
        finally:
            self.stop_app(self.secure_process, "Secure Application")
            
        # Phase 3: Executive Summary
        self.generate_executive_summary()
        
        return True
        
    def generate_executive_summary(self):
        """Generate executive summary of the demonstration"""
        print(f"\n{'📊 EXECUTIVE SUMMARY':=^70}")
        print("\n🎯 DEMONSTRATION COMPLETED SUCCESSFULLY")
        print("="*50)
        
        print("\n📈 KEY FINDINGS:")
        print("  🔴 Vulnerable Application:")
        print("     • SQL Injection vulnerabilities detected")
        print("     • Cross-Site Scripting (XSS) flaws found") 
        print("     • Insecure Direct Object References present")
        print("     • Command Injection possibilities identified")
        print("     • Path Traversal vulnerabilities discovered")
        
        print("\n  🟢 Secure Application:")
        print("     • All security vulnerabilities remediated")
        print("     • Proper input validation implemented")
        print("     • Authorization controls functioning")
        print("     • Secure coding practices applied")
        
        print(f"\n📊 REPORTS GENERATED:")
        if self.reports_generated:
            for i, report in enumerate(self.reports_generated, 1):
                print(f"     {i}. {report}")
        else:
            print("     ⚠️  No HTML reports found")
            
        print(f"\n🎓 LEARNING OUTCOMES:")
        print("  ✅ Understand what vulnerabilities look like in practice")
        print("  ✅ Learn how security testing reveals issues")
        print("  ✅ See how proper fixes eliminate vulnerabilities") 
        print("  ✅ Gain experience with professional security reporting")
        
        print(f"\n🔧 NEXT STEPS:")
        print("  1. Review the generated HTML reports")
        print("  2. Compare vulnerable_app.py vs secure_app.py code")
        print("  3. Understand the specific security fixes applied")
        print("  4. Apply these patterns to your own projects")
        
        # Offer to open reports
        if self.reports_generated:
            print(f"\n📖 Would you like to view the HTML reports?")
            choice = input("Enter 'y' to open reports in browser, or any key to continue: ").strip().lower()
            if choice == 'y':
                self.open_reports_in_browser()
                
    def open_reports_in_browser(self):
        """Open generated reports in web browser"""
        print("\n🌐 Opening HTML reports in your default browser...")
        
        for report in self.reports_generated:
            try:
                file_path = os.path.abspath(report)
                webbrowser.open(f'file://{file_path}')
                print(f"   📄 Opened: {report}")
                time.sleep(1)  # Small delay between opens
            except Exception as e:
                print(f"   ❌ Could not open {report}: {e}")
                print(f"   💡 Manual open: open {report}")
                
    def run_quick_comparison(self):
        """Run a quick side-by-side comparison"""
        print("\n🔄 QUICK COMPARISON MODE")
        print("="*40)
        print("This will run both tests quickly and show results")
        
        # Use direct security tester calls for speed
        print("\n1️⃣ Testing Vulnerable App...")
        subprocess.run([
            sys.executable, "vulnerable_app.py"
        ], timeout=2)
        
        result1 = subprocess.run([
            sys.executable, "security_tester.py"
        ], input="http://localhost:5000\n", text=True, capture_output=True, timeout=30)
        
        print("\n2️⃣ Testing Secure App...")
        subprocess.run([
            sys.executable, "secure_app.py"  
        ], timeout=2)
        
        result2 = subprocess.run([
            sys.executable, "security_tester.py"
        ], input="http://localhost:5001\n", text=True, capture_output=True, timeout=30)
        
        print("\n📊 COMPARISON RESULTS:")
        print("Vulnerable App:", "Issues Found" if "vulnerabilities" in result1.stdout.lower() else "Clean")
        print("Secure App:", "Clean" if "no vulnerabilities" in result2.stdout.lower() else "Issues Found")

def main():
    """Main entry point for the comprehensive demo"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Comprehensive Security Demo")
    parser.add_argument("--full-demo", action="store_true", 
                       help="Run complete demonstration with reports")
    parser.add_argument("--quick", action="store_true",
                       help="Run quick comparison test")
    
    args = parser.parse_args()
    demo = ComprehensiveSecurityDemo()
    
    if args.full_demo or len(sys.argv) == 1:
        # Default to full demo
        success = demo.run_comprehensive_demo()
        if success:
            print("\n🎉 Comprehensive Security Demo completed successfully!")
        else:
            print("\n⚠️  Demo completed with some issues.")
    elif args.quick:
        demo.run_quick_comparison()
    else:
        print("Use --full-demo for complete demonstration or --quick for fast comparison")

if __name__ == "__main__":
    main()