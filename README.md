# ✦ AUTO-CODER (PROJECT GENESIS): AUTONOMOUS CODE SYNTHESIZER ✦
*Full-Stack Architectural Scaffolding, TypeScript AST Generation & Agentic IDE Interface*

---

## The Bottleneck in AI-Assisted Development

Modern developer tooling is trapped in the "chat snippet" trap. Developers ask an LLM for assistance, receive disconnected blocks of code, and spend 80% of their time manually wiring imports, debugging missing dependencies, and fixing architectural drift.

**Project Genesis treats code generation as full-stack system compilation.**

**Auto-coder** is an autonomous development environment built with Angular and TypeScript that translates high-level functional specifications into cohesive, multi-file codebases. Instead of spitting out raw text, it models application dependencies, manages proxy APIs, and emits production-ready project structures with deterministic integrity.

---

## Architectural Topography

```
Auto-coder (Project Genesis)
├── proxy/                        # Local API gateway & LLM provider abstraction layer
├── src/
│   ├── app/
│   │   ├── components/           # Reactive UI workbench, terminal emulators & tree viewers
│   │   ├── services/             # Code synthesis engine, AST parsers & project managers
│   │   └── models/               # Typed schemas for file trees, dependencies & mutations
│   └── environments/             # Endpoint configs for local & cloud inference runtimes
└── angular.json                  # Enterprise build configuration & asset pipelines
```

---

## System Capabilities

| Capability | Module | Technical Delivery |
|---|---|---|
| **Multi-File Scaffolding** | `src/app/services/project-generator.service.ts` | Generates complete project skeletons with matched dependencies, configs, and entrypoints. |
| **Provider Proxy Gateway** | `proxy/server.js` | Zero-CORS intermediary routing generation requests to local Ollama/vLLM or remote providers. |
| **Reactive Visual Workbench** | `src/app/components/workspace/` | Real-time file tree explorer with syntax highlighting, diff inspection, and one-click export. |
| **Dependency Graph Resolver** | `src/app/services/dependency.service.ts` | Validates package versions, missing imports, and conflicting peer dependencies before write. |

---

## Quick Start

### Prerequisites
- Node.js $\ge 20.0.0$
- Angular CLI $\ge 17.0.0$

### Running the Application
```bash
# Clone the repository
git clone https://github.com/LERMF/Auto-coder.git
cd Auto-coder

# Install dependencies
npm install

# Start local proxy gateway
npm run proxy &

# Start Angular development server
ng serve

# Navigate to workbench
# -> http://localhost:4200
```

---

## The Integrity Invariant

Auto-coder enforces an **AST-First Validation Gate**:
- Generated TypeScript code must parse through the internal TypeScript compiler API before rendering to the user.
- Syntax errors or unclosed blocks trigger an immediate automated repair loop before presenting output.
- The human developer inspects complete, compilable applications rather than fragmented ideas.
