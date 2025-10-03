# create_venv.py (Level 2 - Auto Activate in new shell)
import os
import sys
import subprocess
import platform

def create_virtual_environment(venv_name):
    print(f"🚀 Creating virtual environment: {venv_name}")
    try:
        subprocess.run([sys.executable, "-m", "venv", venv_name], check=True)
        print(f"✅ Virtual environment '{venv_name}' created successfully!")
        activate_virtual_environment(venv_name)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error creating virtual environment: {e}")
        return False
    return True

def activate_virtual_environment(venv_name):
    system = platform.system().lower()
    print("\n🔧 Activating virtual environment...\n")

    if system == "windows":
        activate_script = os.path.join(venv_name, "Scripts", "activate.bat")
        subprocess.run(["cmd.exe", "/k", activate_script])  # opens new cmd
    else:
        activate_script = os.path.join(venv_name, "bin", "activate")
        subprocess.run(["bash", "--rcfile", activate_script])  # opens new bash

def main():
    print("🐍 Python Virtual Environment Creator + Activator")
    print("=" * 50)
    venv_name = input("Enter the name for your virtual environment: ").strip()
    if not venv_name:
        print("❌ Virtual environment name cannot be empty!")
        return
    create_virtual_environment(venv_name)

if __name__ == "__main__":
    main()
