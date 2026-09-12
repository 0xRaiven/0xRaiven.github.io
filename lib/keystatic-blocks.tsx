import React from "react";
import { component, fields, NotEditable } from "@keystatic/core";

export const warningBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border-l-4 border-amber-500 bg-amber-950/20 text-amber-200 text-xs font-mono rounded-r">
      <div className="font-bold uppercase tracking-wider text-[10px] mb-1">
        Warning
      </div>
      <NotEditable>{props.fields.text.value || "Warning text..."}</NotEditable>
    </div>
  ),
  label: "Warning",
  schema: {
    text: fields.text({ label: "Warning Text", multiline: true }),
  },
});

export const noteBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border-l-4 border-sky-500 bg-sky-950/20 text-sky-200 text-xs font-mono rounded-r">
      <div className="font-bold uppercase tracking-wider text-[10px] mb-1">
        Note
      </div>
      <NotEditable>{props.fields.text.value || "Note text..."}</NotEditable>
    </div>
  ),
  label: "Note",
  schema: {
    text: fields.text({ label: "Note Text", multiline: true }),
  },
});

export const tipBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border-l-4 border-emerald-500 bg-emerald-950/20 text-emerald-200 text-xs font-mono rounded-r">
      <div className="font-bold uppercase tracking-wider text-[10px] mb-1">
        Tip
      </div>
      <NotEditable>{props.fields.text.value || "Tip text..."}</NotEditable>
    </div>
  ),
  label: "Tip",
  schema: {
    text: fields.text({ label: "Tip Text", multiline: true }),
  },
});

export const labBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border border-accent/40 bg-accent/10 text-accent text-xs font-mono rounded">
      <div className="flex items-center justify-between border-b border-accent/20 pb-1 mb-2">
        <span className="font-bold uppercase tracking-wider text-[10px]">
          Lab :: {props.fields.target.value || "Target"}
        </span>
        <span className="text-[10px] uppercase px-1 rounded bg-accent/20 text-text-primary">
          {props.fields.difficulty.value}
        </span>
      </div>
      <NotEditable>
        {props.fields.objective.value || "Lab objective..."}
      </NotEditable>
    </div>
  ),
  label: "Lab Environment",
  schema: {
    target: fields.text({ label: "Target / Host", defaultValue: "Target Machine" }),
    difficulty: fields.select({
      label: "Difficulty",
      options: [
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" },
      ],
      defaultValue: "medium",
    }),
    objective: fields.text({ label: "Objective", multiline: true }),
  },
});

export const findingBlock = component({
  preview: (props) => {
    const sev = props.fields.severity?.value || "none";
    const sevColors: Record<string, string> = {
      critical: "border-rose-500 bg-rose-950/20 text-rose-200",
      high: "border-orange-500 bg-orange-950/20 text-orange-200",
      medium: "border-amber-500 bg-amber-950/20 text-amber-200",
      low: "border-blue-500 bg-blue-950/20 text-blue-200",
      informational: "border-slate-500 bg-slate-950/20 text-slate-200",
      none: "border-orange-500 bg-orange-950/20 text-orange-200",
    };
    const color = sevColors[sev] || sevColors.none;
    return (
      <div className={`p-3 my-2 border-l-4 ${color} text-xs font-mono rounded-r`}>
        <div className="flex items-center justify-between font-bold uppercase tracking-wider text-[10px] mb-1">
          <span>Findings</span>
          {sev && sev !== "none" && (
            <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold border border-current">
              {sev}
            </span>
          )}
        </div>
        <NotEditable>{props.fields.text.value || "Finding details..."}</NotEditable>
      </div>
    );
  },
  label: "Findings",
  schema: {
    severity: fields.select({
      label: "Severity",
      options: [
        { label: "None (General)", value: "none" },
        { label: "Critical", value: "critical" },
        { label: "High", value: "high" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
        { label: "Informational", value: "informational" },
      ],
      defaultValue: "none",
    }),
    text: fields.text({ label: "Finding Details", multiline: true }),
  },
});

export const mitigationBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border-l-4 border-teal-500 bg-teal-950/20 text-teal-200 text-xs font-mono rounded-r">
      <div className="font-bold uppercase tracking-wider text-[10px] mb-1">
        Mitigation
      </div>
      <NotEditable>{props.fields.text.value || "Mitigation steps..."}</NotEditable>
    </div>
  ),
  label: "Mitigation",
  schema: {
    text: fields.text({ label: "Mitigation Steps", multiline: true }),
  },
});

export const terminalBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs font-mono rounded">
      <div className="text-[10px] text-zinc-500 border-b border-zinc-800 pb-1 mb-2">
        $ {props.fields.title.value || "terminal"}
      </div>
      <NotEditable>
        {props.fields.commands.elements.map((cmd, i) => (
          <div key={i} className="mb-1">
            <span className="text-accent">$ </span>
            <span>{cmd.fields.cmd.value || "..."}</span>
          </div>
        ))}
      </NotEditable>
    </div>
  ),
  label: "Terminal",
  schema: {
    title: fields.text({ label: "Terminal Title", defaultValue: "bash" }),
    commands: fields.array(
      fields.object({
        cmd: fields.text({ label: "Command" }),
        output: fields.text({ label: "Output (Optional)", multiline: true }),
      }),
      {
        label: "Commands",
        itemLabel: (p) => p.fields.cmd.value || "Command",
      }
    ),
  },
});

export const fileTreeBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border border-zinc-800 bg-zinc-950 text-zinc-300 text-xs font-mono rounded">
      <div className="text-[10px] text-zinc-500 mb-1">File Tree</div>
      <pre className="text-[11px] whitespace-pre">
        <NotEditable>{props.fields.tree.value || "dir/\n  file.ext"}</NotEditable>
      </pre>
    </div>
  ),
  label: "File Tree",
  schema: {
    tree: fields.text({ label: "File Tree Structure", multiline: true }),
  },
});

export const calloutBlock = component({
  preview: (props) => (
    <div className="p-3 my-2 border border-zinc-700 bg-zinc-900/50 text-zinc-200 text-xs font-mono rounded">
      <NotEditable>{props.fields.text.value || "Callout content..."}</NotEditable>
    </div>
  ),
  label: "Callout",
  schema: {
    text: fields.text({ label: "Callout Text", multiline: true }),
  },
});

export const twoColumnBlock = component({
  preview: (props) => (
    <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
      <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded">
        <div className="text-[10px] text-zinc-500 mb-1">Left Column</div>
        <NotEditable>{props.fields.left.value}</NotEditable>
      </div>
      <div className="p-2 border border-zinc-800 bg-zinc-900/30 rounded">
        <div className="text-[10px] text-zinc-500 mb-1">Right Column</div>
        <NotEditable>{props.fields.right.value}</NotEditable>
      </div>
    </div>
  ),
  label: "Two Column",
  schema: {
    left: fields.text({ label: "Left Column", multiline: true }),
    right: fields.text({ label: "Right Column", multiline: true }),
  },
});
