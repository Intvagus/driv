"use client";

import { useCallback, useRef, useState } from "react";
import { ParsedTable } from "@/types/epi/dataset";
import { parseUploadedFile } from "@/lib/epi/parsers/parse-file";
import { DEMO_DATASETS } from "@/lib/epi/demo-data";
import { Button, Card } from "@/components/epi/ui/primitives";

interface Props {
  onParsed: (tables: ParsedTable[]) => void;
  onDemo: (table: ParsedTable, datasetHint: string) => void;
}

export function UploadStep({ onParsed, onDemo }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setLoading(true);
      try {
        const tables = await parseUploadedFile(file);
        onParsed(tables);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read this file.");
      } finally {
        setLoading(false);
      }
    },
    [onParsed],
  );

  return (
    <div className="mx-auto max-w-2xl">
      <Card
        className={`flex flex-col items-center gap-3 border-2 border-dashed p-10 text-center transition-colors ${dragActive ? "border-epi-primary bg-blue-50" : "border-epi-border"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-epi-primary" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 16V4M12 4l-4 4M12 4l4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-base font-semibold text-epi-ink">Upload an EPI dataset</h1>
        <p className="max-w-sm text-sm text-slate-500">CSV, XLS, XLSX or HTML. Your file is processed in your browser and is not uploaded to a server or permanently stored.</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xls,.xlsx,.htm,.html"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={loading}>
          {loading ? "Reading file…" : "Choose file"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </Card>

      <div className="mt-8">
        <p className="mb-3 text-center text-sm font-medium text-slate-600">or try a demo dataset</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEMO_DATASETS.map((d) => (
            <Card key={d.datasetId} className="p-4 text-left">
              <p className="text-sm font-semibold text-epi-ink">{d.label}</p>
              <p className="mt-1 text-xs text-slate-500">{d.description}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => onDemo(d.generate(), d.datasetId)}
              >
                Try Demo Dataset
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Designed with reference to publicly available WHO guidance and data-visualization principles. Not an official WHO product and not WHO-certified.
      </p>
    </div>
  );
}
