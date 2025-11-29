// Script to configure mobile app with current network IP
import * as fs from 'fs';
import * as path from 'path';
import { getLocalNetworkIP } from '../utils/network';


const PORT = process.env.PORT || 5000;
const networkIP = getLocalNetworkIP();
const API_URL = `http://${networkIP}:${PORT}/api`;

const configPath = path.join(__dirname, '../../../Mobile/Mobile/src/config/api.config.ts');


const configContent = `// Mobile/config.ts - Auto-generated configuration file
// DO NOT EDIT MANUALLY - Run: npm run setup:mobile to regenerate
// Last updated: ${new Date().toLocaleString()}

export const API_CONFIG = {
  BASE_URL: '${API_URL}',
};
`;

// Create directory if it doesn't exist
const configDir = path.dirname(configPath);
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// Write config file
fs.writeFileSync(configPath, configContent, 'utf-8');

console.log('✅ Mobile app configuration updated!');
console.log('=================================');
console.log(`📱 API URL: ${API_URL}`);
console.log(`📍 Network IP: ${networkIP}`);
console.log(`📁 Config file: ${configPath}`);
console.log('=================================');
console.log('');
console.log('Next steps:');
console.log('1. Make sure your mobile device is on the same network');
console.log('2. Start the backend server: npm run dev');
console.log('3. Start the mobile app: cd Mobile/Mobile && npm start');
