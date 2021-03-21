const { readFileSync, existsSync } = require('fs');
const configPath = process.argv.slice(2)[0];

if (existsSync(configPath)) {
  const config = JSON.parse(readFileSync(configPath));

  const VoicenterWebSDK = require('./index');
  const app = new VoicenterWebSDK(config);

  app.start();
} else {
  throw new Error(`Failed to find config file ${configPath}`);
}
