#!/usr/bin/env python3
import socket
import sys

def check_port(port, service_name):
    """Check if a port is available"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(1)
            result = sock.connect_ex(('localhost', port))
            if result == 0:
                print(f"❌ WARNING: Port {port} ({service_name}) is already in use!")
                return False
            else:
                print(f"✅ Port {port} ({service_name}) is available")
                return True
    except Exception as e:
        print(f"⚠️  Could not check port {port}: {e}")
        return True

def main():
    print("🔍 Checking required ports...")
    print("=" * 50)
    
    # Define ports to check
    ports_to_check = [
        (5454, "PostgreSQL Database"),
        (5050, "Flask API Server"), 
        (3030, "React Development Server")
    ]
    
    all_available = True
    
    for port, service in ports_to_check:
        if not check_port(port, service):
            all_available = False
    
    print("=" * 50)
    
    if not all_available:
        print("\n🚨 PORT CONFLICTS DETECTED!")
        print("Please update the following ports in 'devops/docker-compose.yml':")
        print("\nCurrent configuration:")
        print("  - PostgreSQL: 5454")
        print("  - Flask API: 5050") 
        print("  - React: 3030")
        print("\n💡 How to fix:")
        print("1. Stop the services using these ports, OR")
        print("2. Modify the port mappings in devops/docker-compose.yml")
        print("   Example: change '5454:5432' to '5455:5432'")
        sys.exit(1)
    else:
        print("🎉 All ports are available! You can start the system.")
        return True

if __name__ == "__main__":
    main()