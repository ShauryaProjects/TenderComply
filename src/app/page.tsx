import { Button } from "@/components/ui/button";
import {
  FileCheck,
  ShieldAlert,
  ListChecks,
  ArrowRight,
  Cpu,
  Database,
  FileSpreadsheet,
  Lock
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-neutral-800 selection:text-white">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-md">
              <FileCheck className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
              TenderComply
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              System Boilerplate Ready
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-20 flex flex-col justify-center relative z-10">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-400 mb-6">
            <span className="text-emerald-500">SIH 2026 Project</span>
            <span className="w-1 h-1 rounded-full bg-neutral-700" />
            <span>Automated Tender/Bid Compliance</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white mb-6">
            Compliance auditing, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              fully automated.
            </span>
          </h1>

          <p className="text-lg text-neutral-400 leading-relaxed max-w-2xl mb-8">
            An automated framework built to ingest, analyze, and verify compliance for complex bid documents and government tender proposals against rules, specifications, and guideline schemas.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-white text-neutral-950 hover:bg-neutral-200 shadow-lg cursor-pointer">
              Explore Tech Stack
              <ArrowRight className="w-4 h-4" />
            </Button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 transition-colors"
            >
              Git Repository
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm hover:border-neutral-700 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:border-neutral-600 transition-colors">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Bid Compliance Verification</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Compares unstructured bid documents and vendor claims against structured tender guidelines to highlight deviation scores.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm hover:border-neutral-700 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:border-neutral-600 transition-colors">
              <ListChecks className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Rule Schema Definition</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Provides standardized guidelines mapping for compliance criteria. Formatted parameters are strictly validated using Zod.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-sm hover:border-neutral-700 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 group-hover:border-neutral-600 transition-colors">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Discrepancy Audits</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Generates clean logs and compliance flags indicating missing vendor information, expired certificates, or specification gaps.
            </p>
          </div>
        </div>

        {/* Tech Stack Component Integration */}
        <div className="border-t border-neutral-900 pt-16">
          <h2 className="text-sm font-semibold tracking-wider text-neutral-500 uppercase mb-8">
            Project Architecture Foundations
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Cpu className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Next.js App Router</h4>
                <p className="text-xs text-neutral-500">React Server Components & Route Handlers</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-teal-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Prisma Next ORM</h4>
                <p className="text-xs text-neutral-500">PostgreSQL type-safe schema and db query client</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Zod Validation</h4>
                <p className="text-xs text-neutral-500">Robust type validation for API Route inputs</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center flex-shrink-0">
                <FileCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Tailwind & shadcn</h4>
                <p className="text-xs text-neutral-500">Modern layout setup using Tailwind CSS v4</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <span>&copy; {new Date().getFullYear()} TenderComply. All rights reserved.</span>
          <span>SIH 2026 Submission Development Phase</span>
        </div>
      </footer>
    </div>
  );
}
