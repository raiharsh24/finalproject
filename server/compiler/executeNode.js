const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Execute JavaScript (Node) code safely with a 5‑second timeout.
 * Uses a separate Node process to run the user code.
 */
function executeNode(code, input = '') {
  return new Promise((resolve, reject) => {
    try {
      // ---------------- SECURITY CHECKS ----------------
      const blockedPatterns = [
        /require\s*\(/,       // prevent requiring modules
        /process\.exit/,      // prevent exiting the process
        /process\.env/,       // prevent env access
        /child_process/,       // prevent spawning processes
        /fs\./,               // prevent file system access
        /eval\(/,              // block eval
        /new\s+Function\(/,   // block Function constructor
      ];
      for (const pattern of blockedPatterns) {
        if (pattern.test(code)) {
          return reject('⚠️ Unsafe JavaScript code detected');
        }
      }

      // ---------------- CREATE TEMP DIRECTORY ----------------
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      // ---------------- UNIQUE FILE NAMES ----------------
      const jobId = crypto.randomUUID();
      const jsFile = path.join(tempDir, `${jobId}.js`);
      const inputFile = path.join(tempDir, `${jobId}.txt`);

      // Write the code and input to files
      fs.writeFileSync(jsFile, code);
      fs.writeFileSync(inputFile, input);

      // ---------------- EXECUTE ----------------
      // Use node to execute, redirect input from file
      const command = `node "${jsFile}" < "${inputFile}"`;
      exec(
        command,
        { timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 },
        (error, stdout, stderr) => {
          // Cleanup files
          [jsFile, inputFile].forEach((f) => {
            if (fs.existsSync(f)) fs.unlinkSync(f);
          });

          if (error) {
            if (error.killed) return reject('⏱️ Execution timed out');
            return reject(stderr || 'Execution error');
          }
          if (stderr) return reject(stderr);
          return resolve(stdout || 'No output');
        }
      );
    } catch (err) {
      reject('Execution failed');
    }
  });
}

module.exports = executeNode;
