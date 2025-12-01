"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CodeRunner() {
  const templates: Record<string, string> = {
    javascript: `console.log("Hello JavaScript!");`,
    python: `print("Hello Python!")`,
    java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello Java!");
  }
}`,
    c: `#include <stdio.h>

int main() {
  printf("Hello C!");
  return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello C++!" << endl;
  return 0;
}`,
  };

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(templates["javascript"]);
  const [output, setOutput] = useState<any>("");

  const outputRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const getOutputColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  const runCode = async () => {
    setOutput("Running...");

    const res = await fetch("/api/run", {
      method: "POST",
      body: JSON.stringify({ code, language }),
    });

    const data = await res.json();
    const now = new Date().toLocaleTimeString();

    let type = "success";
    const lower = data.output.toLowerCase();

    if (lower.includes("error")) type = "error";
    else if (lower.includes("warning")) type = "warning";

    setOutput({
      text: data.output,
      type,
      time: now,
    });
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold text-center">AI Code Lab Companion</h1>

      <Select
        value={language}
        onValueChange={(lang) => {
          setLanguage(lang);
          setCode(templates[lang]);
        }}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="python">Python</SelectItem>
          <SelectItem value="java">Java</SelectItem>
          <SelectItem value="c">C</SelectItem>
          <SelectItem value="cpp">C++</SelectItem>
        </SelectContent>
      </Select>

      <div className="mx-auto max-w-2xl w-full">
     <Editor
    height="300px"
    language={language}
    theme="vs-dark"
    value={code}
    onChange={(v) => setCode(v || "")}
  />
</div>


      <Button onClick={runCode} className="px-4 py-2 ">
        Run Code
      </Button>

      {/* Output */}
      <div className="flex justify-center">
  <div className="w-full max-w-4xl">
    <div
      ref={outputRef}
      className="bg-black p-4 rounded h-48 overflow-auto font-mono"
    >
      {output && typeof output === "object" ? (
        <div>
          <div className="text-gray-400 text-sm">[{output.time}]</div>
          <pre
            className={`${getOutputColor(output.type)} whitespace-pre-wrap`}
          >
            {output.text}
          </pre>
        </div>
      ) : (
        <pre className="text-green-400">{output}</pre>
      )}
    </div>
  </div>
</div>

    </div>
  );
}
