const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function executeCpp(code, input = "") {
  return new Promise((resolve, reject) => {
    try {
      /* ---------------- SECURITY CHECKS ---------------- */

      const blockedPatterns = [
        /system\s*\(/,
        /fork\s*\(/,
        /exec\s*\(/,
        /#include\s*<unistd.h>/,
        /#include\s*<sys\/.*>/
      ];

      for (let pattern of blockedPatterns) {
        if (pattern.test(code)) {
          return reject("⚠️ Unsafe code detected");
        }
      }

      /* ---------------- CREATE TEMP DIRECTORY ---------------- */

      const tempDir = path.join(__dirname, "../temp");

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      /* ---------------- UNIQUE FILE NAME ---------------- */

      const jobId = crypto.randomUUID();

      const cppFile = path.join(tempDir, `${jobId}.cpp`);
      const exeFile = path.join(tempDir, `${jobId}.out`);
      const inputFile = path.join(tempDir, `${jobId}.txt`);

      /* ---------------- WRITE FILES ---------------- */

      fs.writeFileSync(cppFile, code);
      fs.writeFileSync(inputFile, input);

      /* ---------------- COMPILE + RUN ---------------- */

      const command = `g++ "${cppFile}" -o "${exeFile}" && "${exeFile}" < "${inputFile}"`;

      exec(
        command,
        {
          timeout: 5000,
          killSignal: "SIGKILL",
          maxBuffer: 1024 * 1024
        },
        (error, stdout, stderr) => {

          /* ---------------- CLEANUP FUNCTION ---------------- */

          const cleanup = () => {
            [cppFile, exeFile, inputFile].forEach(file => {
              if (fs.existsSync(file)) {
                fs.unlinkSync(file);
              }
            });
          };

          /* ---------------- HANDLE ERRORS ---------------- */

          if (error) {
            cleanup();

            if (error.killed) {
              return reject("⏱️ Execution timed out");
            }

            return reject(stderr || "Compilation/Runtime error");
          }

          if (stderr) {
            cleanup();
            return reject(stderr);
          }

          cleanup();

          resolve(stdout || "No output");

        }
      );

    } catch (err) {
      reject("Execution failed");
    }
  });
}

module.exports = executeCpp;