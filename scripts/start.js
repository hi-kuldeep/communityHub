const { spawn } = require('child_process');

console.log('[Start] Launching React Native Metro Bundler in current terminal...');
// Spawn react-native start in the current console
const metro = spawn('npx', ['react-native', 'start'], { stdio: 'inherit', shell: true });

metro.on('close', (code) => {
  process.exit(code || 0);
});
