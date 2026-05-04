const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Execute Java code safely with a 5‑second timeout.
 * The code must contain a public class named Main.
 */
function executeJava(code, input = '') {
  return new Promise((resolve, reject) => {
    try {
      // ---------------- SECURITY CHECKS ----------------
      const blockedPatterns = [
        /Runtime\.getRuntime\(/, // prevent process spawning
        /System\.exit\(/,         // prevent exiting JVM
        /java\.io/,                // block file IO
        /java\.net/,               // block networking
        /ProcessBuilder/,           // block process creation
      ];
      for (const p of blockedPatterns) {
        if (p.test(code)) {
          return reject('⚠️ Unsafe Java code detected');
        }
      }

      // ---------------- CREATE TEMP DIRECTORY ----------------
      const tempDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      // ---------------- UNIQUE FILE NAMES ----------------
      const jobId = crypto.randomUUID();
      const javaFile = path.join(tempDir, `${jobId}.java`);
      const inputFile = path.join(tempDir, `${jobId}.txt`);

      // Write code and input
      fs.writeFileSync(javaFile, code);
      fs.writeFileSync(inputFile, input);

      // Compile
      const compileCmd = `javac "${javaFile}"`;
      exec(compileCmd, { timeout: 5000, killSignal: 'SIGKILL' }, (compErr, compStdout, compStderr) => {
        if (compErr) {
          // Cleanup source file
          if (fs.existsSync(javaFile)) fs.unlinkSync(javaFile);
          if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
          return reject(compStderr || 'Compilation error');
        }

        // Run
        const className = path.basename(javaFile, '.java');
        const runCmd = `java -cp "${tempDir}" ${className} < "${inputFile}"`;
        exec(runCmd, { timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 }, (runErr, stdout, stderr) => {
          // Cleanup all files
          [javaFile, `${tempDir}/${className}.class`, inputFile].forEach((f) => {
            if (fs.existsSync(f)) fs.unlinkSync(f);
          });

          if (runErr) {
            if (runErr.killed) return reject('⏱️ Execution timed out');
            return reject(stderr || 'Runtime error');
          }
          if (stderr) return reject(stderr);
          return resolve(stdout || 'No output');
        });
      });
    } catch (e) {
      reject('Execution failed');
    }
  });
}

module.exports = executeJava;
