const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Execute Python code safely with a 5‑second timeout.
 * Returns a Promise that resolves with stdout or rejects with an error string.
 */
function executePython(code, input = '') {
  return new Promise((resolve, reject) => {
    try {
      // ---------------- SECURITY CHECKS ----------------
      const blockedPatterns = [
        /import\s+os/,          // prevent OS calls
        /import\s+sys/,         // prevent sys manipulation
        /subprocess/,            // block subprocess usage
        /open\(/,                // block file access
        /eval\(/,                // block eval
        /exec\(/,                // block exec
        /pickle/,                // block serialization attacks
      ];
      for (const pattern of blockedPatterns) {
        if (pattern.test(code)) {
          return reject('⚠️ Unsafe Python code detected');
        }
      }

      // ---------------- CREATE TEMP DIRECTORY ----------------
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      // ---------------- UNIQUE FILE NAMES ----------------
      const jobId = crypto.randomUUID();
      const pyFile = path.join(tempDir, `${jobId}.py`);
      const inputFile = path.join(tempDir, `${jobId}.txt`);

      // ---------------- WRITE FILES ----------------
      fs.writeFileSync(pyFile, code);
      fs.writeFileSync(inputFile, input);

      // ---------------- EXECUTE ----------------
      const command = `python3 "${pyFile}" < "${inputFile}"`;
      exec(
        command,
        { timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 },
        (error, stdout, stderr) => {
          // Cleanup
          [pyFile, inputFile].forEach((f) => {
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

module.exports = executePython;
