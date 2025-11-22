import http from 'http';

const PORT = 5000;
const MAX_RETRIES = 10;
const RETRY_DELAY = 1000;

async function testAPI(retries = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/api/restaurants`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n📡 Response from API:');
        console.log('Status:', res.statusCode);
        console.log('Content:', data);
        
        try {
          const json = JSON.parse(data);
          console.log('\n✅ Parsed JSON:');
          console.log(JSON.stringify(json, null, 2));
          resolve();
        } catch (e) {
          console.log('\n⚠️ Could not parse as JSON');
          resolve();
        }
      });
    });

    req.on('error', async (err) => {
      if (retries < MAX_RETRIES) {
        console.log(`⏳ Server not ready, retrying... (${retries + 1}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, RETRY_DELAY));
        await testAPI(retries + 1);
        resolve();
      } else {
        console.error('❌ Failed to connect after', MAX_RETRIES, 'retries');
        reject(err);
      }
    });

    req.end();
  });
}

console.log('🚀 Starting API test...');
testAPI().catch(console.error);
