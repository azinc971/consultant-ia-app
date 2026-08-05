import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import MermaidDiagram from "@/components/MermaidDiagram";

function isMermaidClassName(className: unknown): className is string {
  return typeof className === "string" && className.includes("language-mermaid");
}

const components: Components = {
  pre({ children }) {
    if (
      children &&
      typeof children === "object" &&
      "props" in children &&
      isMermaidClassName((children.props as { className?: unknown }).className)
    ) {
      return <>{children}</>;
    }
    return <pre>{children}</pre>;
  },
  code({ className, children }) {
    if (isMermaidClassName(className)) {
      return <MermaidDiagram chart={String(children).replace(/\n$/, "")} />;
    }
    return <code className={className}>{children}</code>;
  },
};

export default function ModuleContent({ markdown }: { markdown: string }): ReactNode {
  return (
    <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-table:block prose-table:overflow-x-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
