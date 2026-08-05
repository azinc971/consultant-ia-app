"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId().replace(/[:]/g, "-");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erreur de rendu du diagramme");
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto rounded-md bg-red-50 p-3 text-xs text-red-600">
        Erreur de rendu du diagramme mermaid : {error}
      </pre>
    );
  }

  return <div ref={ref} className="my-4 flex justify-center overflow-x-auto" />;
}
