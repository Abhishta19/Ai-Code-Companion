"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


export default function CodeLabPage() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  // ⭐ Predefined boilerplate code
  const templates: Record<string, string> = {
    javascript: `function greet() {
  console.log("Hello World");
}`,
    python: `def greet():
    print("Hello World")`,
    java: `public class Main {
  public static void main(String[] args) {
      System.out.println("Hello World");
  }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World";
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}`,
  };

  // ⭐ Load default code on page load
  useEffect(() => {
    setCode(templates["javascript"]);
  }, []);

  return (
    
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-end mb-4">
  <ThemeToggle />
</div>

      <h1 className="text-3xl font-bold text-center">AI Code Lab Companion</h1>

      {/* Language Select */}
      <div className="max-w-xs">
        <Select
          value={language}
          onValueChange={(lang) => {
            setLanguage(lang);
            setCode(templates[lang]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
            <SelectItem value="c">C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Monaco Editor */}
      <Card>
        <CardContent className="p-0">
          <Editor
  height="350px"
  theme={theme === "dark" ? "vs-dark" : "light"}
  language={language}
  value={code}
  onChange={(value) => setCode(value || "")}
/>

        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
  className="bg-blue-600 text-white"
  onClick={async () => {
    setLoading(true);
    setResult("");

    const res = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    const data = await res.json();
    setResult(data.explanation);
    setLoading(false);
  }}
>
  {loading ? "Analyzing..." : "Explain Code"}
</Button>

        <Button variant="secondary" onClick={() => setCode("")}>
          Clear
        </Button>
        {result && (
  <Card className="mt-4">
    <CardContent className="p-4 whitespace-pre-wrap">
      {result}
    </CardContent>
  </Card>
)}

      </div>
    </div>
  );
}
