export interface LanguageConfig {
  id: string;
  label: string;
  monacoLanguage: string;
  extension: string;
  defaultCode: string;
}

export const LANGUAGES: LanguageConfig[] = [
  {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
    extension: "cpp",
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  },
  {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
    extension: "java",
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    extension: "py",
    defaultCode: `print("Hello, World!")`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    extension: "js",
    defaultCode: `console.log("Hello, World!");`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    monacoLanguage: "typescript",
    extension: "ts",
    defaultCode: `const message: string = "Hello, World!";
console.log(message);`,
  },
];

export const DEFAULT_LANGUAGE = "cpp";
