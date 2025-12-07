#!/usr/bin/env python3
"""
SEE-EE-OH Network Monitor
A simple network monitoring tool for detecting threats and scanning networks
Copyright 2025 SEE-EE-OH (Pty) Ltd
Founder: Benjamen Elungu
"""

import socket
import subprocess
import sys
from datetime import datetime
import json

class NetworkMonitor:
    def __init__(self):
        self.scan_results = []
        
    def banner(self):
        """Display SEE-EE-OH banner"""
        print("="*60)
        print("         SEE-EE-OH Network Monitor v1.0")
        print("    Securing Southern Africa's Digital Future")
        print("       Founded by: Benjamen Elungu")
        print("="*60)
        print()
    
    def port_scanner(self, target, start_port=1, end_port=1000):
        """
        Scan ports on target system
        """
        print(f"\n[*] Starting port scan on {target}")
        print(f"[*] Scanning ports {start_port}-{end_port}")
        print(f"[*] Scan started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-"*60)
        
        open_ports = []
        
        try:
            target_ip = socket.gethostbyname(target)
            print(f"[+] Target IP: {target_ip}\n")
        except socket.gaierror:
            print(f"[-] Error: Could not resolve hostname {target}")
            return
        
        for port in range(start_port, end_port + 1):
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            socket.setdefaulttimeout(1)
            
            result = sock.connect_ex((target_ip, port))
            
            if result == 0:
                try:
                    service = socket.getservbyport(port)
                except:
                    service = "Unknown"
                
                print(f"[+] Port {port}/tcp OPEN - Service: {service}")
                open_ports.append({"port": port, "service": service})
            
            sock.close()
        
        print("-"*60)
        print(f"\n[*] Scan completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"[+] Total open ports found: {len(open_ports)}")
        
        self.scan_results.append({
            "target": target,
            "ip": target_ip,
            "scan_time": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            "open_ports": open_ports
        })
        
        return open_ports
    
    def ping_sweep(self, network_prefix, start=1, end=254):
        """
        Perform ping sweep on network range
        Example: network_prefix = "192.168.1"
        """
        print(f"\n[*] Starting ping sweep on {network_prefix}.{start}-{end}")
        print("-"*60)
        
        active_hosts = []
        
        for host_num in range(start, end + 1):
            ip = f"{network_prefix}.{host_num}"
            
            # Ping command (works on both Windows and Linux)
            param = '-n' if sys.platform.lower() == 'win32' else '-c'
            command = ['ping', param, '1', '-w', '1000', ip]
            
            try:
                output = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                
                if output.returncode == 0:
                    print(f"[+] Host UP: {ip}")
                    active_hosts.append(ip)
            except:
                pass
        
        print("-"*60)
        print(f"\n[+] Active hosts found: {len(active_hosts)}")
        return active_hosts
    
    def service_banner_grab(self, target, port):
        """
        Attempt to grab service banner from specified port
        """
        print(f"\n[*] Attempting banner grab from {target}:{port}")
        
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            socket.setdefaulttimeout(3)
            sock.connect((target, port))
            
            # Send generic request
            sock.send(b'HEAD / HTTP/1.0\r\n\r\n')
            
            # Receive banner
            banner = sock.recv(1024).decode('utf-8', errors='ignore')
            sock.close()
            
            if banner:
                print(f"[+] Banner received:")
                print(banner)
                return banner
            else:
                print("[-] No banner received")
                return None
                
        except Exception as e:
            print(f"[-] Error: {str(e)}")
            return None
    
    def save_results(self, filename="scan_results.json"):
        """Save scan results to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.scan_results, f, indent=4)
        print(f"\n[+] Results saved to {filename}")
    
    def generate_report(self):
        """Generate HTML report"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>SEE-EE-OH Network Scan Report</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
                .header {{ background: linear-gradient(135deg, #0A2463, #1D3557); 
                          color: white; padding: 20px; border-radius: 10px; }}
                .scan {{ background: white; padding: 20px; margin: 20px 0; 
                        border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .open-port {{ color: #E63946; font-weight: bold; }}
                .stat {{ display: inline-block; margin: 10px 20px 10px 0; }}
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SEE-EE-OH Network Scan Report</h1>
                <p>Securing Southern Africa's Digital Future</p>
                <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
            </div>
        """
        
        for scan in self.scan_results:
            html += f"""
            <div class="scan">
                <h2>Target: {scan['target']} ({scan['ip']})</h2>
                <p>Scan Time: {scan['scan_time']}</p>
                <div class="stat">Total Ports Scanned: 1000</div>
                <div class="stat">Open Ports: <span class="open-port">{len(scan['open_ports'])}</span></div>
                <h3>Open Ports:</h3>
                <ul>
            """
            
            for port_info in scan['open_ports']:
                html += f"<li>Port {port_info['port']} - {port_info['service']}</li>"
            
            html += """
                </ul>
            </div>
            """
        
        html += """
            <div class="header" style="margin-top: 40px;">
                <p>Contact: benjamen@see-ee-oh.com | +264 85 749 9175</p>
                <p>SEE-EE-OH (Pty) Ltd - Windhoek, Namibia</p>
            </div>
        </body>
        </html>
        """
        
        with open("scan_report.html", 'w') as f:
            f.write(html)
        
        print("[+] HTML report generated: scan_report.html")

def main():
    monitor = NetworkMonitor()
    monitor.banner()
    
    print("\nSEE-EE-OH Network Monitor")
    print("1. Port Scanner")
    print("2. Ping Sweep")
    print("3. Banner Grabber")
    print("4. Exit")
    
    choice = input("\nSelect option: ")
    
    if choice == "1":
        target = input("Enter target IP or hostname: ")
        start_port = int(input("Enter start port (default 1): ") or 1)
        end_port = int(input("Enter end port (default 1000): ") or 1000)
        monitor.port_scanner(target, start_port, end_port)
        monitor.save_results()
        monitor.generate_report()
        
    elif choice == "2":
        network = input("Enter network prefix (e.g., 192.168.1): ")
        active_hosts = monitor.ping_sweep(network)
        
        if active_hosts:
            scan_all = input("\nScan all active hosts? (y/n): ")
            if scan_all.lower() == 'y':
                for host in active_hosts:
                    monitor.port_scanner(host, 1, 100)
                monitor.save_results()
                monitor.generate_report()
    
    elif choice == "3":
        target = input("Enter target IP or hostname: ")
        port = int(input("Enter port number: "))
        monitor.service_banner_grab(target, port)
    
    elif choice == "4":
        print("\n[*] Thank you for using SEE-EE-OH Network Monitor")
        print("[*] Securing Southern Africa's Digital Future")
        sys.exit(0)
    
    else:
        print("[-] Invalid option")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n[*] Scan interrupted by user")
        print("[*] Thank you for using SEE-EE-OH Network Monitor")
        sys.exit(0)
