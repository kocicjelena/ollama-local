This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



Synthesized MCP server integration strategy for Next.js application
Here's how to integrate an MCP server into your Next.js App Router project using the official @modelcontextprotocol/sdk and mcp-handler.

1. Install dependencies
bash
npm install @modelcontextprotocol/sdk mcp-handler zod
npm install -D @types/node tsx
Minimum versions: @modelcontextprotocol/sdk >= 1.10, mcp-handler >= 0.5

2. File structure to create
app/
  api/
    [transport]/
      route.ts          ← single entry point (HTTP + SSE)
lib/
  mcp/
    tools/
      myTool.ts         ← one file per tool
    registry.ts         ← wires all tools together
    store.ts            ← data loader (optional)
types/
  doc-entry.ts          ← shared types (optional)
3. Create the App Router route
This is the core file — it handles all MCP traffic:

typescript
// app/api/[transport]/route.ts
import { createMcpHandler } from "mcp-handler";
import { registerAllTools } from "@/lib/mcp/registry";

const handler = createMcpHandler(
  async (server) => {
    registerAllTools(server);
  },
  {
    capabilities: { tools: {} },
  },
  {
    basePath: "/api",
    verboseLogs: process.env.NODE_ENV === "development",
    maxDuration: 60,
    disableSse: false,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
4. Create a tool
typescript
// lib/mcp/tools/hello.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerHelloTool(server: McpServer) {
  server.registerTool(
    "hello",
    {
      description: "Returns a greeting for the given name.",
      inputSchema: {
        name: z.string().describe("Name to greet"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ name }) => ({
      content: [{ type: "text", text: `Hello, ${name}!` }],
    })
  );
}
5. Registry
typescript
// lib/mcp/registry.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerHelloTool } from "./tools/hello";

export function registerAllTools(server: McpServer) {
  registerHelloTool(server);
  // add more tools here
}
6. Test it
bash
npm run dev

# Open MCP Inspector in browser:
npx @modelcontextprotocol/inspector
# Connect to: http://localhost:3000/api/mcp
Key rules to remember
❌ Wrong	✅ Correct
server.tool(...)	server.registerTool(name, descriptor, handler)
inputSchema: z.object({...})	inputSchema: { field: z.string() } (raw Zod shape)
Missing DELETE export	Export GET, POST, and DELETE
Route at app/api/mcp/route.ts	Must be app/api/[transport]/route.ts
Once running, your MCP server endpoint will be at http://localhost:3000/api/mcp. You can then register it in Claude Desktop or any MCP-compatible client.

Want me to scaffold these files directly into your project, or add a specific tool for something your app does?

Great idea. The concept is: each skill becomes an MCP tool — when called from VS Code chat, it returns the skill's instructions, and Claude follows them automatically.
Here's the full scaffold:Read the doc-to-json SKILL.md to embed as tool contentRead the doc-to-json SKILL.md to embed as tool contentNow I'll generate all the files:Created 6 files, read a fileCreated 6 files, read a fileHere's the full architecture — each skill is an MCP tool callable from VS Code chat.

How it works
VS Code chat → "use_skill doc-to-json" 
    → MCP tool called on your Next.js server
    → returns full skill instructions as text
    → Claude reads them and executes the skill
File structure
lib/mcp/
  skills/
    doc-to-json.ts        ← skill content (copy SKILL.md here as a string)
  tools/
    skill-doc-to-json.ts  ← dedicated tool for this skill
    skill-dispatcher.ts   ← generic "use_skill <name>" tool for ALL skills
  registry.ts             ← wires everything together
app/api/[transport]/
  route.ts                ← MCP HTTP entry point
.mcp.json                 ← VS Code connection config (put in project root)
Two ways to call from chat
// Call a specific skill tool directly:
use skill_doc_to_json

// Or call any skill by name via the dispatcher:
use use_skill with skill=doc-to-json
Adding a new skill

Copy your SKILL.md content into lib/mcp/skills/your-skill.ts as a string
Add an entry to the SKILLS map in skill-dispatcher.ts — that's it

npm install @modelcontextprotocol/sdk mcp-handler zod
npm install -D @types/node tsx