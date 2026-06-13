// Mock Database Service using LocalStorage for Guest Mode / Fallback Demo

const DEFAULT_REPOS = [
  {
    id: 'repo-codeforge',
    name: 'Ali-Alaaeddin/codeforge',
    active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'repo-react',
    name: 'facebook/react',
    active: true,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const DEFAULT_PRS = {
  'repo-codeforge': [
    {
      id: 'pr-1',
      repo_id: 'repo-codeforge',
      number: 42,
      title: 'feat: Add AI code checklist generation for pull requests',
      state: 'open',
      source_branch: 'feat/ai-checklists',
      target_branch: 'main',
      author: {
        github_username: 'Ali-Alaaeddin',
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4'
      },
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Introduces a background worker that scans incoming PR diffs, calls our LLM parser, and creates custom developer checklists in the database. Also includes realtime toast notifications on the dashboard.',
      status: 'pending', // pending, approved, changes_requested
      checklists: [
        {
          id: 'chk-sec',
          rule_name: 'Security Checks',
          completed: false,
          items: [
            { text: 'Verify GitHub webhook signatures using HMAC-SHA256', checked: true },
            { text: 'Sanitize diff inputs to prevent SQL injection in checklist creation', checked: true },
            { text: 'Implement rate limiting for AI parsing endpoint', checked: false }
          ]
        },
        {
          id: 'chk-perf',
          rule_name: 'Performance & Architecture',
          completed: false,
          items: [
            { text: 'Use bulk inserts for checklist items instead of sequential inserts', checked: true },
            { text: 'Optimize supabase realtime channel count', checked: false }
          ]
        },
        {
          id: 'chk-docs',
          rule_name: 'Documentation & Styling',
          completed: true,
          items: [
            { text: 'Document edge function endpoint parameters in /docs', checked: true }
          ]
        }
      ],
      files: [
        {
          path: 'supabase/functions/webhook/index.ts',
          additions: 45,
          deletions: 0,
          diff: `@@ -0,0 +1,45 @@
+import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
+import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
+import { verifySignature } from './utils.ts'
+
+serve(async (req) => {
+  const signature = req.headers.get('x-hub-signature-256')
+  const body = await req.text()
+  
+  if (!verifySignature(body, signature)) {
+    return new Response('Unauthorized signature', { status: 401 })
+  }
+  
+  const payload = JSON.parse(body)
+  const supabase = createClient(
+    Deno.env.get('SUPABASE_URL') ?? '',
+    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
+  )
+  
+  if (payload.action === 'opened') {
+    const { data: pr } = await supabase
+      .from('pull_requests')
+      .insert({
+        repo_id: payload.repository.id,
+        number: payload.pull_request.number,
+        title: payload.pull_request.title,
+        state: 'open'
+      })
+      .select()
+      .single()
+      
+    // Trigger AI checklist generation background job
+    await fetch(Deno.env.get('AI_SERVICE_URL') + '/generate', {
+      method: 'POST',
+      body: JSON.stringify({ prId: pr.id, diff: payload.pull_request.diff_url })
+    })
+  }
+
+  return new Response(JSON.stringify({ success: true }), {
+    headers: { 'Content-Type': 'application/json' }
+  })
+})`
        },
        {
          path: 'src/lib/diff.js',
          additions: 15,
          deletions: 2,
          diff: `@@ -4,8 +4,15 @@
 export function parseDiff(rawDiff) {
-  return rawDiff.split('\\n');
+  if (!rawDiff || typeof rawDiff !== 'string') {
+    return [];
+  }
+  const lines = rawDiff.split('\\n');
+  const added = lines.filter(l => l.startsWith('+') && !l.startsWith('+++'));
+  const deleted = lines.filter(l => l.startsWith('-') && !l.startsWith('---'));
+  return {
+    rawLines: lines,
+    additionsCount: added.length,
+    deletionsCount: deleted.length
+  };
 }`
        }
      ],
      comments: [
        {
          id: 'cmt-1',
          author: {
            github_username: 'codeforge-bot',
            avatar_url: 'https://avatars.githubusercontent.com/u/129759247?s=200&v=4'
          },
          body: '🤖 **CodeForge AI Review**\n\nI scanned the changes in `supabase/functions/webhook/index.ts`. Please ensure that `verifySignature` handles null values and doesn\'t leak execution timing (use a constant-time comparison).',
          created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'cmt-2',
          author: {
            github_username: 'reviewer_bob',
            avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80'
          },
          body: 'Looks solid! I verified the HMAC validation works as expected on my staging branch. Once the AI checklist is completely checked off, I will approve.',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      inlineComments: [
        {
          id: 'icmt-1',
          filePath: 'src/lib/diff.js',
          lineNumber: 12,
          author: {
            github_username: 'codeforge-bot',
            avatar_url: 'https://avatars.githubusercontent.com/u/129759247?s=200&v=4'
          },
          body: 'Consider handling cases where lines start with special characters or binary chunks.',
          created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'pr-2',
      repo_id: 'repo-codeforge',
      number: 41,
      title: 'fix: Resolve token expiration in OAuth redirect flows',
      state: 'open',
      source_branch: 'fix/oauth-refresh',
      target_branch: 'main',
      author: {
        github_username: 'auth_wizard',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
      },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Fixes a loop condition where users would get repeated redirects on Vercel preview environments when their session tokens expired.',
      status: 'approved',
      checklists: [
        {
          id: 'chk-oauth-1',
          rule_name: 'Auth Checks',
          completed: true,
          items: [
            { text: 'Add token expiration interceptor', checked: true },
            { text: 'Verify cookie propagation across wildcard domains', checked: true }
          ]
        }
      ],
      files: [
        {
          path: 'src/lib/supabase.js',
          additions: 5,
          deletions: 1,
          diff: `@@ -12,4 +12,8 @@
 export const supabase = createClient(supabaseUrl, supabaseAnonKey)
+supabase.auth.onAuthStateChange((event, session) => {
+  if (event === 'TOKEN_REFRESHED') {
+    console.log('Token successfully refreshed automatically')
+  }
+})`
        }
      ],
      comments: [],
      inlineComments: []
    }
  ],
  'repo-react': [
    {
      id: 'pr-3',
      repo_id: 'repo-react',
      number: 28945,
      title: 'compiler: Optimise reactive boundary calculations',
      state: 'open',
      source_branch: 'compiler/opt-boundaries',
      target_branch: 'main',
      author: {
        github_username: 'react_core_dev',
        avatar_url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&auto=format&fit=crop&q=80'
      },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Speeds up compiling reactive scopes when dealing with massive nested object literals inside component definitions.',
      status: 'changes_requested',
      checklists: [
        {
          id: 'chk-react-1',
          rule_name: 'Compiler Optimisations',
          completed: false,
          items: [
            { text: 'Ensure zero-cost abstractions for standard memo boundaries', checked: true },
            { text: 'Add regression tests with 1000+ fields', checked: false }
          ]
        }
      ],
      files: [
        {
          path: 'packages/react-compiler/src/Optimization.ts',
          additions: 18,
          deletions: 4,
          diff: `@@ -22,4 +22,18 @@
 export function optimizeBoundaries(program) {
-  return program.map(node => node);
+  const cache = new Map();
+  return program.map(node => {
+    if (node.type === 'ObjectExpression' && node.properties.length > 50) {
+      if (cache.has(node)) return cache.get(node);
+      const optimized = performHeavyAnalysis(node);
+      cache.set(node, optimized);
+      return optimized;
+    }
+    return node;
+  });
 }`
        }
      ],
      comments: [
        {
          id: 'cmt-react-1',
          author: {
            github_username: 'dan_abramov',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
          },
          body: 'We need to make sure this cache doesn\'t cause memory leaks across multiple compilation runs in dev mode.',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ],
      inlineComments: []
    }
  ]
};

// Initialize DB in localStorage if empty
function initDB() {
  if (!localStorage.getItem('cf_repos')) {
    localStorage.setItem('cf_repos', JSON.stringify(DEFAULT_REPOS));
  }
  if (!localStorage.getItem('cf_prs')) {
    localStorage.setItem('cf_prs', JSON.stringify(DEFAULT_PRS));
  }
}

export function getMockRepos() {
  initDB();
  return JSON.parse(localStorage.getItem('cf_repos'));
}

export function connectMockRepo(name) {
  initDB();
  const repos = getMockRepos();
  
  // Clean names
  const cleanName = name.trim();
  if (!cleanName) return null;

  // Check if already connected
  const existing = repos.find(r => r.name.toLowerCase() === cleanName.toLowerCase());
  if (existing) return existing;

  const newId = `repo-${Date.now()}`;
  const newRepo = {
    id: newId,
    name: cleanName,
    active: true,
    created_at: new Date().toISOString()
  };

  repos.unshift(newRepo);
  localStorage.setItem('cf_repos', JSON.stringify(repos));

  // Generate 2 mock PRs for this new repository
  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  const newPrs = [
    {
      id: `pr-${Date.now()}-1`,
      repo_id: newId,
      number: 101,
      title: 'feat: Configure responsive grid components',
      state: 'open',
      source_branch: 'feat/responsive-grid',
      target_branch: 'main',
      author: {
        github_username: 'guest_dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4'
      },
      created_at: new Date().toISOString(),
      description: 'Adds utility responsive grid classes and updates layout viewports for mobile phones and tablet ratios.',
      status: 'pending',
      checklists: [
        {
          id: `chk-${Date.now()}-1`,
          rule_name: 'Responsive Design Checklist',
          completed: false,
          items: [
            { text: 'Check mobile viewport scaling', checked: true },
            { text: 'Check Safari compatibility with CSS grids', checked: false }
          ]
        }
      ],
      files: [
        {
          path: 'src/styles/Layout.css',
          additions: 12,
          deletions: 2,
          diff: `@@ -1,5 +1,15 @@
 .grid {
   display: grid;
-  grid-template-columns: repeat(12, 1fr);
+  grid-template-columns: 1fr;
   gap: var(--space-4);
 }
+@media (min-width: 768px) {
+  .grid {
+    grid-template-columns: repeat(12, 1fr);
+  }
+}`
        }
      ],
      comments: [],
      inlineComments: []
    },
    {
      id: `pr-${Date.now()}-2`,
      repo_id: newId,
      number: 102,
      title: 'refactor: Move hardcoded colors to CSS variables',
      state: 'open',
      source_branch: 'refactor/color-vars',
      target_branch: 'main',
      author: {
        github_username: 'codeforge-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/129759247?s=200&v=4'
      },
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      description: 'Cleans up design tokens in navbar and headers by swapping raw hex codes with system CSS custom properties.',
      status: 'approved',
      checklists: [
        {
          id: `chk-${Date.now()}-2`,
          rule_name: 'Clean Code Checklist',
          completed: true,
          items: [
            { text: 'Replace hex codes in Navbar.css', checked: true },
            { text: 'Verify contrast ratios for accessibility', checked: true }
          ]
        }
      ],
      files: [
        {
          path: 'src/styles/Navbar.css',
          additions: 4,
          deletions: 4,
          diff: `@@ -12,4 +12,4 @@
   height: var(--header-height);
-  background: #0a0a0b;
+  background: rgba(10, 10, 11, 0.85);
   border-bottom: 1px solid var(--border-subtle);`
        }
      ],
      comments: [],
      inlineComments: []
    }
  ];

  prs[newId] = newPrs;
  localStorage.setItem('cf_prs', JSON.stringify(prs));

  return newRepo;
}

export function disconnectMockRepo(repoId) {
  initDB();
  const repos = getMockRepos().filter(r => r.id !== repoId);
  localStorage.setItem('cf_repos', JSON.stringify(repos));

  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  delete prs[repoId];
  localStorage.setItem('cf_prs', JSON.stringify(prs));
}

export function getMockPRs(repoId) {
  initDB();
  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  return prs[repoId] || [];
}

export function getMockPRDetails(prId) {
  initDB();
  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  for (const repoId in prs) {
    const pr = prs[repoId].find(p => p.id === prId);
    if (pr) return pr;
  }
  return null;
}

export function toggleMockChecklistItem(prId, checklistId, itemIndex) {
  initDB();
  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  for (const repoId in prs) {
    const pr = prs[repoId].find(p => p.id === prId);
    if (pr) {
      const chk = pr.checklists.find(c => c.id === checklistId);
      if (chk) {
        chk.items[itemIndex].checked = !chk.items[itemIndex].checked;
        chk.completed = chk.items.every(i => i.checked);
        localStorage.setItem('cf_prs', JSON.stringify(prs));
        return pr;
      }
    }
  }
  return null;
}

export function addMockComment(prId, filePath, lineNumber, body, authorUsername = 'guest_dev') {
  initDB();
  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  const cachedUser = localStorage.getItem('codeforge_guest_user');
  const userMetadata = cachedUser ? JSON.parse(cachedUser).user_metadata : {};
  
  const author = {
    github_username: authorUsername,
    avatar_url: authorUsername === 'guest_dev' 
      ? (userMetadata.avatar_url || 'https://avatars.githubusercontent.com/u/583231?v=4')
      : 'https://avatars.githubusercontent.com/u/129759247?s=200&v=4'
  };

  const newComment = {
    id: `cmt-${Date.now()}`,
    author,
    body,
    created_at: new Date().toISOString()
  };

  for (const repoId in prs) {
    const pr = prs[repoId].find(p => p.id === prId);
    if (pr) {
      if (filePath && lineNumber) {
        // Inline comment
        const inlineCmt = {
          ...newComment,
          filePath,
          lineNumber: parseInt(lineNumber)
        };
        pr.inlineComments = pr.inlineComments || [];
        pr.inlineComments.push(inlineCmt);
      } else {
        // General comment
        pr.comments.push(newComment);
      }
      localStorage.setItem('cf_prs', JSON.stringify(prs));
      return pr;
    }
  }
  return null;
}

export function updateMockPRStatus(prId, status) {
  initDB();
  const prs = JSON.parse(localStorage.getItem('cf_prs'));
  for (const repoId in prs) {
    const pr = prs[repoId].find(p => p.id === prId);
    if (pr) {
      pr.status = status;
      localStorage.setItem('cf_prs', JSON.stringify(prs));
      return pr;
    }
  }
  return null;
}

export function triggerMockAISimulation(prId, onStepComplete) {
  // Simulate AI reviewer bot working
  // 1. Adds a comment
  // 2. Toggles a checklist item or adds a new checklist rule
  
  setTimeout(() => {
    addMockComment(prId, null, null, '🤖 **AI Bot Update:** I ran a code validation build on your PR branches. Syntax validation passed, and CSS variable definitions are correctly formatted. No performance regression found.', 'codeforge-bot');
    if (onStepComplete) onStepComplete();
  }, 1500);
}
