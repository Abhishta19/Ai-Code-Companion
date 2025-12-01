import { NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code or language missing" },
        { status: 400 }
      );
    }

    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    let filename = "";
    let command = "";

    switch (language) {
      case "javascript":
        filename = `${tempDir}/temp.js`;
        fs.writeFileSync(filename, code);
        command = `node "${filename}"`;
        break;

      case "python":
        filename = `${tempDir}/temp.py`;
        fs.writeFileSync(filename, code);
        command = `python "${filename}"`;
        break;

      case "java":
        filename = `${tempDir}/Main.java`;
        fs.writeFileSync(filename, code);
        command = `javac "${filename}" && java -cp "${tempDir}" Main`;
        break;

      case "c":
        filename = `${tempDir}/program.c`;
        fs.writeFileSync(filename, code);
        command = `gcc "${filename}" -o "${tempDir}/a.out" && "${tempDir}/a.out"`;
        break;

      case "cpp":
        filename = `${tempDir}/program.cpp`;
        fs.writeFileSync(filename, code);
        command = `g++ "${filename}" -o "${tempDir}/a.out" && "${tempDir}/a.out"`;
        break;

      default:
        return NextResponse.json(
          { error: "Unsupported language" },
          { status: 400 }
        );
    }

    // Run the command safely
    const { stdout, stderr } = await execPromise(command, { timeout: 5000 });

    return NextResponse.json({
      output: stdout || stderr || "No output.",
    });

  } catch (error: any) {
    return NextResponse.json({
      output: error.stderr || error.message || "Execution error",
    });
  }
}
