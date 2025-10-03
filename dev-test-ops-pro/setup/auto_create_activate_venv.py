# create_venv.py (Level 2 - Enhanced)
import os
import sys
import subprocess
import platform
import webbrowser
from pathlib import Path

class VenvCreator:
    def __init__(self):
        self.system = platform.system().lower()
        self.venv_name = None
        
    def create_virtual_environment(self, venv_name):
        """
        Level 2: Enhanced virtual environment creation with auto-detection
        """
        self.venv_name = venv_name
        print(f"🚀 Creating virtual environment: {venv_name}")
        
        # Check if venv already exists
        if Path(venv_name).exists():
            response = input(f"⚠️  '{venv_name}' already exists. Overwrite? (y/n): ").lower()
            if response != 'y':
                print("❌ Operation cancelled.")
                return False
        
        # Create virtual environment
        try:
            subprocess.run([sys.executable, "-m", "venv", venv_name], check=True)
            print(f"✅ Virtual environment '{venv_name}' created successfully!")
            
            # Enhanced features
            self.create_requirements_file()
            self.show_system_info()
            self.show_activation_commands()
            
            # Ask for auto-activation
            self.ask_for_auto_activation()
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error creating virtual environment: {e}")
            return False
        
        return True
    
    def create_requirements_file(self):
        """Create a basic requirements.txt file"""
        requirements_content = "# Add your project dependencies here\n# Example:\n# flask==2.3.3\n# requests==2.31.0\n"
        
        with open("requirements.txt", "w") as f:
            f.write(requirements_content)
        print("✅ Created requirements.txt template")
    
    def show_system_info(self):
        """Display system information"""
        print(f"\n💻 **System Info:**")
        print(f"Platform: {platform.system()} {platform.release()}")
        print(f"Python: {sys.version.split()[0]}")
        print(f"Virtual Environment Path: {Path(self.venv_name).absolute()}")
    
    def show_activation_commands(self):
        """Show platform-specific activation commands"""
        print(f"\n🔧 **Activation Commands:**")
        
        if self.system == "windows":
            print(f"CMD:          {self.venv_name}\\Scripts\\activate")
            print(f"PowerShell:   .\\{self.venv_name}\\Scripts\\Activate.ps1")
        else:  # Linux, macOS
            print(f"Bash/Zsh:     source {self.venv_name}/bin/activate")
            print(f"Fish:         source {self.venv_name}/bin/activate.fish")
        
        print(f"\n📦 **After activation, install packages:**")
        print(f"pip install -r requirements.txt")
        print(f"\n🔚 To deactivate: 'deactivate'")
    
    def ask_for_auto_activation(self):
        """Ask user if they want to auto-activate"""
        if self.system == "windows":
            # On Windows, we can try to auto-activate in a new terminal
            response = input("\n🤖 Open new terminal with activated environment? (y/n): ").lower()
            if response == 'y':
                self.auto_activate_windows()
        else:
            # On Unix systems, we can provide activation script
            response = input("\n🤖 Generate activation script? (y/n): ").lower()
            if response == 'y':
                self.create_activation_script()
    
    def auto_activate_windows(self):
        """Auto-activate for Windows"""
        try:
            if self.system == "windows":
                # Create a batch file to activate in new cmd
                bat_content = f"""@echo off
call {self.venv_name}\\Scripts\\activate.bat
echo ✅ Virtual environment {self.venv_name} activated!
cd /d %~dp0
cmd /k
"""
                with open("activate_env.bat", "w") as f:
                    f.write(bat_content)
                print("✅ Created activate_env.bat - run this file to activate!")
        except Exception as e:
            print(f"⚠️  Could not create auto-activation script: {e}")
    
    def create_activation_script(self):
        """Create activation script for Unix systems"""
        try:
            script_content = f"""#!/bin/bash
source {self.venv_name}/bin/activate
echo "✅ Virtual environment {self.venv_name} activated!"
exec $SHELL
"""
            with open("activate_env.sh", "w") as f:
                f.write(script_content)
            
            # Make executable
            os.chmod("activate_env.sh", 0o755)
            print("✅ Created activate_env.sh - run: ./activate_env.sh")
        except Exception as e:
            print(f"⚠️  Could not create activation script: {e}")

def main():
    print("🐍 Python Virtual Environment Creator - Level 2")
    print("=" * 50)
    
    creator = VenvCreator()
    
    # Get virtual environment name from user
    venv_name = input("Enter the name for your virtual environment: ").strip()
    
    if not venv_name:
        print("❌ Virtual environment name cannot be empty!")
        return
    
    # Create the virtual environment
    creator.create_virtual_environment(venv_name)

if __name__ == "__main__":
    main()