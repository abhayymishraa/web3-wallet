import React from "react";
import { cn } from "@/lib/utils";

export interface CodeBlockProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  language?: string;
  darkMode?: boolean;
}

const CodeBlock = React.forwardRef<HTMLTextAreaElement, CodeBlockProps>(
  ({ className, value, ...props }) => {
    const words = (value as string).split(" ");

    return (
      <div
        className={cn(
          `relative flex min-h-[80px] w-full border rounded border-slate-400/60   px-3 py-2 text-sm`,
          className
        )}
        style={{
          backgroundColor: props.darkMode ? "#333333" : "#ffffff",
        }}
      >
        <div className="grid grid-cols-3 gap-2 w-full">
          {words.map((word, index) => (
            <div
              key={index}
              className="p-2 border text-center "
              style={{
                fontFamily: "ui-monospace,Menlo,monospace",
                textDecoration: "none",
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CodeBlock.displayName = "CodeBlock";

export default CodeBlock;
