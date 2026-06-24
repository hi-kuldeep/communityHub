const { exec, spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Open a new terminal window on macOS and run the mock server via yarn
const osascriptCommand = `osascript -e 'tell application "Terminal" to do script "cd \\"${rootDir}\\" && yarn mock-server"'`;

exec(osascriptCommand, (err) => {
  if (err) {
    console.error('[Start] Failed to launch mock server in a new terminal window:', err);
    console.log('[Start] Attempting fallback to run mock-server in background...');
    
    // Fallback if Terminal scripting is blocked or fails
    const fallback = spawn('yarn', ['mock-server'], { stdio: 'inherit', shell: true });
    fallback.on('error', (e) => console.error('[Start] Fallback failed:', e));
  } else {
    console.log('[Start] Mock server launched in a separate terminal window.');
  }

  console.log('[Start] Launching React Native Metro Bundler in current terminal...');
  // Spawn react-native start in the current console
  const metro = spawn('npx', ['react-native', 'start'], { stdio: 'inherit', shell: true });

  metro.on('close', (code) => {
    process.exit(code || 0);
  });
});
