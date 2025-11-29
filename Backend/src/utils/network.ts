import os from 'os';

/**
 * Get the local network IP address of the machine
 * Prioritizes WiFi/LAN IPs (192.168.x.x, 10.x.x.x) over VPN/Hamachi IPs
 */
export function getLocalNetworkIP(): string {
    const interfaces = os.networkInterfaces();
    const addresses: string[] = [];

    for (const name of Object.keys(interfaces)) {
        const networkInterface = interfaces[name];
        if (!networkInterface) continue;

        for (const iface of networkInterface) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }

    // Prioritize common local network ranges
    // 1. 192.168.x.x (most common home/office WiFi)
    const localIP = addresses.find(ip => ip.startsWith('192.168.'));
    if (localIP) return localIP;

    // 2. 10.x.x.x (corporate networks)
    const corporateIP = addresses.find(ip => ip.startsWith('10.'));
    if (corporateIP) return corporateIP;

    // 3. 172.16.x.x - 172.31.x.x (private networks)
    const privateIP = addresses.find(ip => {
        const parts = ip.split('.');
        return parts[0] === '172' && parseInt(parts[1]) >= 16 && parseInt(parts[1]) <= 31;
    });
    if (privateIP) return privateIP;

    // 4. Fallback to first available IP (might be VPN/Hamachi)
    if (addresses.length > 0) return addresses[0];

    // 5. Last resort
    return 'localhost';
}

/**
 * Get all available network IP addresses
 */
export function getAllNetworkIPs(): string[] {
    const interfaces = os.networkInterfaces();
    const addresses: string[] = [];

    for (const name of Object.keys(interfaces)) {
        const networkInterface = interfaces[name];
        if (!networkInterface) continue;

        for (const iface of networkInterface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }

    return addresses;
}
