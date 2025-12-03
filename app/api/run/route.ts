import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";

const execPromise = util.promisify(exec);

// TEMP folder for compiling
const TEMP_DIR = path.join(process.cwd(), "temp_run");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

export async function POST(req: Request) {
  const { code, language } = await req.json();

  try {
    let filePath = "";
    let command = "";

    // -------------------------
    // PYTHON
    // -------------------------
    if (language === "python") {
      filePath = path.join(TEMP_DIR, "script.py");
      fs.writeFileSync(filePath, code);
      command = `python "${filePath}"`;
    }

    // -------------------------
    // C
    // -------------------------
    else if (language === "c") {
      filePath = path.join(TEMP_DIR, "program.c");
      fs.writeFileSync(filePath, code);

      command = `gcc "${filePath}" -o "${TEMP_DIR}/program.exe" && "${TEMP_DIR}/program.exe"`;
    }

    // -------------------------
    // C++
    // -------------------------
    else if (language === "cpp") {
      filePath = path.join(TEMP_DIR, "program.cpp");
      fs.writeFileSync(filePath, code);

      command = `g++ "${filePath}" -o "${TEMP_DIR}/program.exe" && "${TEMP_DIR}/program.exe"`;
    }

    // -------------------------
    // JAVA
    // -------------------------
    else if (language === "java") {
      filePath = path.join(TEMP_DIR, "Main.java");
      fs.writeFileSync(filePath, code);

      command = `javac "${filePath}" && java -cp "${TEMP_DIR}" Main`;
    }

    // -------------------------
    // INVALID
    // -------------------------
    else {
      return NextResponse.json({ output: "INVALID_LANGUAGE" });
    }

    const { stdout, stderr } = await execPromise(command);
    return NextResponse.json({ output: stdout || stderr });
  } catch (err: any) {
    return NextResponse.json({ output: err.message });
  }
}
