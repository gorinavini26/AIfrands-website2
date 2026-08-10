import { UserProfile, RoadmapModule, AITool, Assignment, Notebook, CommitDay, TechLanguage } from '../types';

export const initialProfile: UserProfile = {
  id: 'usr_01',
  name: 'Next-Gen AI',
  studentId: 'CS_STUDENT_01',
  year: 'Year 3',
  email: 'alex@cs-portal.edu',
  githubUrl: 'github.com/alex-dev',
  bio: 'CS student exploring the intersection of AI and Systems Programming. Currently building distributed systems in Rust and experimenting with LLM agents.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  streakDays: 12,
  primaryLanguages: ['Python', 'C++', 'Rust'],
  toolsAndIdes: ['Cursor', 'Neovim', 'Docker'],
  editorFontSize: 14,
  notifications: {
    assignmentDeadlines: true,
    portalUpdates: false,
    communityMessages: true,
  },
};

export const initialRoadmapModules: RoadmapModule[] = [
  // Year 1
  {
    id: 'y1_1',
    title: 'C/C++ Programming',
    category: 'Core Module',
    progress: 100,
    year: 1,
    semesters: 'Semester 1 & 2',
    description: 'Master procedural memory management, pointers, and OOP basics in C++.',
    status: 'completed',
    topics: [
      { name: 'Pointers & Memory Allocation', completed: true },
      { name: 'Structures & Unions', completed: true },
      { name: 'Classes & Inheritance', completed: true },
      { name: 'File I/O Streams', completed: true },
    ],
    resources: [
      {
        id: 'r_y1_1_1',
        title: 'C++ Programming Full Course for Beginners',
        type: 'youtube',
        channelOrProvider: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
        durationOrBadge: '4h 01m',
      },
      {
        id: 'r_y1_1_2',
        title: 'Pointers & Dynamic Memory Allocation in C/C++',
        type: 'youtube',
        channelOrProvider: 'mycodeschool',
        url: 'https://www.youtube.com/watch?v=_8-ht2AKyH4',
        durationOrBadge: '38m Video',
      },
      {
        id: 'r_y1_1_3',
        title: 'C++ Language Reference & Standard Library Docs',
        type: 'doc',
        channelOrProvider: 'cppreference.com',
        url: 'https://en.cppreference.com',
        durationOrBadge: 'Official Docs',
      },
    ],
  },
  {
    id: 'y1_2',
    title: 'Engineering Mathematics',
    category: 'Core Module',
    progress: 100,
    year: 1,
    semesters: 'Semester 1 & 2',
    description: 'Linear algebra, calculus, and differential equations for computing.',
    status: 'completed',
    topics: [
      { name: 'Matrices & Eigenvalues', completed: true },
      { name: 'Vector Calculus', completed: true },
      { name: 'Fourier Series', completed: true },
    ],
    resources: [
      {
        id: 'r_y1_2_1',
        title: 'Essence of Linear Algebra',
        type: 'youtube',
        channelOrProvider: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=fNk_zzaMoEg',
        durationOrBadge: '16 Videos',
      },
      {
        id: 'r_y1_2_2',
        title: 'Differential Equations & Fourier Series',
        type: 'course',
        channelOrProvider: 'MIT OpenCourseWare',
        url: 'https://ocw.mit.edu/courses/mathematics/',
        durationOrBadge: 'Free Course',
      },
    ],
  },
  {
    id: 'y1_3',
    title: 'Digital Logic Design',
    category: 'Core Module',
    progress: 100,
    year: 1,
    semesters: 'Semester 1 & 2',
    description: 'Boolean algebra, logic gates, combinational and sequential circuit design.',
    status: 'completed',
    topics: [
      { name: 'Karnaugh Maps', completed: true },
      { name: 'Flip-Flops & Registers', completed: true },
      { name: 'Multiplexers & Decoders', completed: true },
    ],
    resources: [
      {
        id: 'r_y1_3_1',
        title: 'Building an 8-bit Computer from Logic Gates',
        type: 'youtube',
        channelOrProvider: 'Ben Eater',
        url: 'https://www.youtube.com/watch?v=l7rce6IQDWs',
        durationOrBadge: 'Popular Series',
      },
      {
        id: 'r_y1_3_2',
        title: 'Digital Electronics & Logic Design Tutorials',
        type: 'youtube',
        channelOrProvider: 'Neso Academy',
        url: 'https://www.youtube.com/watch?v=RO5alU6Lwuc',
        durationOrBadge: 'Full Playlist',
      },
      {
        id: 'r_y1_3_3',
        title: 'Nand2Tetris: From Nand to Tetris Course',
        type: 'course',
        channelOrProvider: 'Nand2Tetris',
        url: 'https://www.nand2tetris.org',
        durationOrBadge: 'Interactive',
      },
    ],
  },
  {
    id: 'y1_4',
    title: 'Python Basics',
    category: 'Core Module',
    progress: 100,
    year: 1,
    semesters: 'Semester 1 & 2',
    description: 'High-level script language fundamentals, data types, and functions.',
    status: 'completed',
    topics: [
      { name: 'Control Structures', completed: true },
      { name: 'Lists & Dictionaries', completed: true },
      { name: 'OOP in Python', completed: true },
    ],
    resources: [
      {
        id: 'r_y1_4_1',
        title: 'Python Tutorial - Python for Beginners',
        type: 'youtube',
        channelOrProvider: 'Programming with Mosh',
        url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
        durationOrBadge: '1h 00m',
      },
      {
        id: 'r_y1_4_2',
        title: 'Python OOP Tutorials - Classes & Instances',
        type: 'youtube',
        channelOrProvider: 'Corey Schafer',
        url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM',
        durationOrBadge: '15m Video',
      },
      {
        id: 'r_y1_4_3',
        title: 'Official Python 3 Documentation & Tutorial',
        type: 'doc',
        channelOrProvider: 'Python Software Foundation',
        url: 'https://docs.python.org/3/',
        durationOrBadge: 'Official Docs',
      },
    ],
  },

  // Year 2
  {
    id: 'y2_1',
    title: 'Data Structures & Algorithms',
    category: 'Core Module',
    progress: 75,
    year: 2,
    semesters: 'Semester 3 & 4',
    description: 'Arrays, linked lists, binary trees, graphs, sorting, and dynamic programming.',
    status: 'in_progress',
    topics: [
      { name: 'Arrays & Linked Lists', completed: true },
      { name: 'Binary Search Trees & AVL', completed: true },
      { name: 'Graph Algorithms (BFS/DFS/Dijkstra)', completed: true },
      { name: 'Dynamic Programming', completed: false },
    ],
    resources: [
      {
        id: 'r_y2_1_1',
        title: 'Data Structures & Algorithms in Python / C++',
        type: 'youtube',
        channelOrProvider: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=8hly31xKLI0',
        durationOrBadge: '8h 00m Course',
      },
      {
        id: 'r_y2_1_2',
        title: 'Graph Theory & Dijkstra Algorithm Explained',
        type: 'youtube',
        channelOrProvider: 'WilliamFiset',
        url: 'https://www.youtube.com/watch?v=pSqmAO-m7Lk',
        durationOrBadge: '25m Tutorial',
      },
      {
        id: 'r_y2_1_3',
        title: 'GeeksforGeeks Data Structures Library',
        type: 'doc',
        channelOrProvider: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org/data-structures/',
        durationOrBadge: 'Self-Paced Guide',
      },
    ],
  },
  {
    id: 'y2_2',
    title: 'Operating Systems',
    category: 'Core Module',
    progress: 40,
    year: 2,
    semesters: 'Semester 3 & 4',
    description: 'Processes, threads, CPU scheduling, synchronization, and virtual memory.',
    status: 'in_progress',
    topics: [
      { name: 'Process Control Blocks & Threads', completed: true },
      { name: 'Mutexes & Semaphores', completed: true },
      { name: 'Page Replacement Algorithms', completed: false },
      { name: 'File Systems & Storage', completed: false },
    ],
    resources: [
      {
        id: 'r_y2_2_1',
        title: 'Operating System Full Course',
        type: 'youtube',
        channelOrProvider: 'Neso Academy',
        url: 'https://www.youtube.com/watch?v=vBURTt97EkA',
        durationOrBadge: 'Full Playlist',
      },
      {
        id: 'r_y2_2_2',
        title: 'Virtual Memory, Paging & Page Replacement',
        type: 'youtube',
        channelOrProvider: 'Geekific',
        url: 'https://www.youtube.com/watch?v=2UAnI-3HhhU',
        durationOrBadge: '18m Video',
      },
      {
        id: 'r_y2_2_3',
        title: 'OSTEP: Operating Systems Three Easy Pieces',
        type: 'course',
        channelOrProvider: 'Univ of Wisconsin',
        url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
        durationOrBadge: 'Free Book',
      },
    ],
  },
  {
    id: 'y2_3',
    title: 'Web Dev Bootcamp',
    category: 'Elective',
    progress: 90,
    year: 2,
    semesters: 'Semester 3 & 4',
    description: 'Full-stack development using React, Express, Node.js, and modern CSS.',
    status: 'in_progress',
    topics: [
      { name: 'HTML5 & Modern CSS Grid/Flexbox', completed: true },
      { name: 'React State & Hooks', completed: true },
      { name: 'RESTful API Server with Express', completed: true },
      { name: 'Full-stack Authentication', completed: false },
    ],
    resources: [
      {
        id: 'r_y2_3_1',
        title: 'React JS Crash Course for Beginners',
        type: 'youtube',
        channelOrProvider: 'Traversy Media',
        url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        durationOrBadge: '1h 48m',
      },
      {
        id: 'r_y2_3_2',
        title: 'Express.js & Node.js in 100 Seconds',
        type: 'youtube',
        channelOrProvider: 'Fireship',
        url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        durationOrBadge: 'Quick Overview',
      },
      {
        id: 'r_y2_3_3',
        title: 'MDN Web Docs - HTML, CSS & JavaScript',
        type: 'doc',
        channelOrProvider: 'Mozilla Developer Network',
        url: 'https://developer.mozilla.org',
        durationOrBadge: 'Official Docs',
      },
    ],
  },
  {
    id: 'y2_4',
    title: 'Java & DBMS',
    category: 'Core Module',
    progress: 60,
    year: 2,
    semesters: 'Semester 3 & 4',
    description: 'Object-Oriented Programming in Java combined with SQL & relational database design.',
    status: 'in_progress',
    topics: [
      { name: 'Java Collections Framework', completed: true },
      { name: 'Relational Schema & Normalization', completed: true },
      { name: 'Complex SQL Queries & Joins', completed: false },
    ],
    resources: [
      {
        id: 'r_y2_4_1',
        title: 'Java Full Course for Free',
        type: 'youtube',
        channelOrProvider: 'Bro Code',
        url: 'https://www.youtube.com/watch?v=xk4_1vDrnnU',
        durationOrBadge: '12h Course',
      },
      {
        id: 'r_y2_4_2',
        title: 'SQL & Database Normalization Masterclass',
        type: 'youtube',
        channelOrProvider: 'freeCodeCamp.org',
        url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        durationOrBadge: '4h Video',
      },
    ],
  },

  // Year 3
  {
    id: 'y3_1',
    title: 'AI/ML Fundamentals',
    category: 'Core Module',
    progress: 20,
    year: 3,
    semesters: 'Semester 5 & 6',
    description: 'Neural networks, supervised learning, transformers, and model evaluation.',
    status: 'in_progress',
    topics: [
      { name: 'Linear & Logistic Regression', completed: true },
      { name: 'Deep Learning & Backpropagation', completed: false },
      { name: 'Transformer Architectures', completed: false },
    ],
    resources: [
      {
        id: 'r_y3_1_1',
        title: 'Neural Networks & Deep Learning Essentials',
        type: 'youtube',
        channelOrProvider: '3Blue1Brown',
        url: 'https://www.youtube.com/watch?v=aircAruvnKk',
        durationOrBadge: 'Chapter Series',
      },
      {
        id: 'r_y3_1_2',
        title: 'Machine Learning Specialization',
        type: 'course',
        channelOrProvider: 'Andrew Ng (DeepLearning.AI)',
        url: 'https://www.youtube.com/watch?v=jGwO_E43088',
        durationOrBadge: 'Stanford / DeepLearning.AI',
      },
      {
        id: 'r_y3_1_3',
        title: 'PyTorch Tutorials & Deep Learning Documentation',
        type: 'doc',
        channelOrProvider: 'PyTorch Foundation',
        url: 'https://pytorch.org/tutorials/',
        durationOrBadge: 'Official Docs',
      },
    ],
  },
  {
    id: 'y3_2',
    title: 'Theory of Computation',
    category: 'Core Module',
    progress: 0,
    year: 3,
    semesters: 'Semester 5 & 6',
    description: 'Automata theory, regular expressions, context-free grammars, and Turing machines.',
    status: 'locked',
    topics: [
      { name: 'DFA & NFA Automata', completed: false },
      { name: 'Context-Free Grammars', completed: false },
      { name: 'Decidability & P vs NP', completed: false },
    ],
    resources: [
      {
        id: 'r_y3_2_1',
        title: 'Theory of Computation & Automata Lectures',
        type: 'youtube',
        channelOrProvider: 'Neso Academy',
        url: 'https://www.youtube.com/watch?v=58N2N7zJGrQ',
        durationOrBadge: 'Playlist',
      },
      {
        id: 'r_y3_2_2',
        title: 'Turing Machines & Decidability Explained',
        type: 'youtube',
        channelOrProvider: 'Easy Theory',
        url: 'https://www.youtube.com/watch?v=E3keLeM33gU',
        durationOrBadge: '22m Video',
      },
    ],
  },

  // Year 4
  {
    id: 'y4_1',
    title: 'Major Project & Industry Capstone',
    category: 'Project',
    progress: 0,
    year: 4,
    semesters: 'Semester 7 & 8',
    description: 'Real-world software engineering capstone with deployment & code reviews.',
    status: 'locked',
    topics: [
      { name: 'Architecture Design Document', completed: false },
      { name: 'Sprint Execution & CI/CD', completed: false },
      { name: 'Final Defense & Demo', completed: false },
    ],
    resources: [
      {
        id: 'r_y4_1_1',
        title: 'System Design Primer & Architecture Patterns',
        type: 'course',
        channelOrProvider: 'Gaurav Sen',
        url: 'https://www.youtube.com/watch?v=xpDnVSmNFX0',
        durationOrBadge: 'System Design',
      },
      {
        id: 'r_y4_1_2',
        title: 'GitHub System Design Primer Repository',
        type: 'doc',
        channelOrProvider: 'Donne Martin',
        url: 'https://github.com/donnemartin/system-design-primer',
        durationOrBadge: 'Open Source',
      },
    ],
  },
  {
    id: 'y4_2',
    title: 'Placement Prep & Mock Interviews',
    category: 'Elective',
    progress: 0,
    year: 4,
    semesters: 'Semester 7 & 8',
    description: 'LeetCode pattern practice, system design interviews, and resume refinement.',
    status: 'locked',
    topics: [
      { name: 'Data Structure Problem Sets', completed: false },
      { name: 'High-Level System Design', completed: false },
    ],
    resources: [
      {
        id: 'r_y4_2_1',
        title: 'NeetCode 150 LeetCode Patterns Overview',
        type: 'youtube',
        channelOrProvider: 'NeetCode',
        url: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
        durationOrBadge: 'Coding Prep',
      },
      {
        id: 'r_y4_2_2',
        title: 'Tech Interview Handbook & Resume Guide',
        type: 'doc',
        channelOrProvider: 'Yangshun Tay',
        url: 'https://www.techinterviewhandbook.org',
        durationOrBadge: 'Handbook',
      },
    ],
  },
];

export const initialAITools: AITool[] = [
  {
    id: 'tool_1',
    name: 'ChatGPT',
    provider: 'OpenAI',
    description: 'Conversational AI for coding assistance, brainstorming, and debugging.',
    category: 'LLM',
    icon: 'chat',
    bookmarked: true,
    url: 'https://chatgpt.com',
  },
  {
    id: 'tool_2',
    name: 'GitHub Copilot',
    provider: 'GitHub',
    description: 'AI-powered pair programmer for real-time code completions and suggestions.',
    category: 'Developer Tool',
    icon: 'code_blocks',
    bookmarked: true,
    url: 'https://github.com/features/copilot',
  },
  {
    id: 'tool_3',
    name: 'Claude',
    provider: 'Anthropic',
    description: 'Next-generation AI assistant for complex reasoning and long-context analysis.',
    category: 'Research',
    icon: 'psychology',
    bookmarked: false,
    url: 'https://claude.ai',
  },
  {
    id: 'tool_4',
    name: 'Midjourney',
    provider: 'Midjourney',
    description: 'Generative AI for creating high-fidelity visual assets and design inspiration.',
    category: 'Creative',
    icon: 'palette',
    bookmarked: false,
    url: 'https://midjourney.com',
  },
  {
    id: 'tool_5',
    name: 'Cursor',
    provider: 'Anysphere',
    description: 'AI-native code editor built for pair programming and repository indexing.',
    category: 'Developer Tool',
    icon: 'terminal',
    bookmarked: true,
    url: 'https://cursor.com',
  },
  {
    id: 'tool_6',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    description: 'AI-powered search engine that provides cited answers to complex queries.',
    category: 'Research',
    icon: 'travel_explore',
    bookmarked: true,
    url: 'https://perplexity.ai',
  },
  {
    id: 'tool_7',
    name: 'Blackbox AI',
    provider: 'Blackbox',
    description: 'Real-time code generation and knowledge base for developers.',
    category: 'LLM',
    icon: 'data_object',
    bookmarked: false,
    url: 'https://blackbox.ai',
  },
  {
    id: 'tool_8',
    name: 'Grammarly',
    provider: 'Grammarly',
    description: 'AI writing assistant for polishing technical documentation and reports.',
    category: 'Writing',
    icon: 'edit_note',
    bookmarked: false,
    url: 'https://grammarly.com',
  },
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg_1',
    title: 'Binary Search Tree Implementation',
    filename: 'cs201_hw4_bst.cpp',
    course: 'Data Structures & Algorithms',
    dueDate: 'Due Tomorrow, 11:59 PM',
    status: 'Pending',
    isDueSoon: true,
    description: 'Implement a self-balancing AVL binary search tree in C++ with insert, delete, rotateLeft, and rotateRight methods.',
    submissionCode: `// Binary Search Tree (AVL) Implementation
#include <iostream>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    int height;
};

int height(Node *N) {
    if (N == NULL) return 0;
    return N->height;
}
`,
  },
  {
    id: 'asg_2',
    title: 'Multi-Threaded Process Scheduler',
    filename: 'os_lab3_scheduler.c',
    course: 'Operating Systems',
    dueDate: 'Oct 15, 2026',
    status: 'Pending',
    isDueSoon: false,
    description: 'Simulate Round Robin and Shortest Job First CPU scheduling algorithms using pthread in C.',
  },
  {
    id: 'asg_3',
    title: 'Full-Stack Express API',
    filename: 'web_bootcamp_project.zip',
    course: 'Web Dev Bootcamp',
    dueDate: 'Submitted yesterday',
    status: 'Submitted',
    isDueSoon: false,
    grade: 'A (95/100)',
    description: 'Build a secure RESTful API with user authentication and JSON data persistence.',
  },
];

export const initialNotebooks: Notebook[] = [
  {
    id: 'nb_1',
    title: 'OS Deep Dive',
    category: 'Operating Systems',
    summary: 'Detailed synthesis of virtual memory paging, page replacement algorithms, and kernel deadlock avoidance.',
    updatedAt: '2 hours ago',
    fileCount: 4,
    content: `# Operating Systems Deep Dive & Kernel Architecture

## 1. Virtual Memory & Memory Management
- **Virtual Memory** abstracts physical RAM, giving processes the illusion of contiguous memory.
- **Page Tables** map virtual addresses to physical RAM frames.
- **TLB** (Translation Lookaside Buffer) acts as a high-speed hardware cache for page table entries.
- **Page Fault** occurs when a requested page is not in physical RAM, forcing disk I/O.

### Hardware Memory Translation
- CPU generates virtual address containing **Page Number** and **Offset**.
- **MMU** (Memory Management Unit) checks the **TLB** cache first.
- If TLB Miss occurs, page table walk resolves the physical frame address.

## 2. Page Replacement Algorithms
- **FIFO** (First-In, First-Out): Replaces oldest page in memory. Simple, but suffers from **Belady's Anomaly**.
- **LRU** (Least Recently Used): Replaces page unused for the longest time. Requires stack or counter hardware.
- **Clock Algorithm**: Second-chance approximation of **LRU** using reference bits in page entries.
- **Optimal (OPT)**: Replaces page that won't be used for the longest future time. Theoretical benchmark.

## 3. Concurrency & Deadlock Avoidance
- **Deadlock** happens when 4 Coffman conditions hold: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
- **Banker's Algorithm** dynamically checks resource allocation state to ensure system remains in a safe state.
- **Semaphores** and **Mutexes** synchronize thread access to critical code regions.`,
  },
  {
    id: 'nb_2',
    title: 'Algorithms Research',
    category: 'Data Structures',
    summary: 'Graph algorithms, Dijkstra vs A* search, and dynamic programming memoization patterns.',
    updatedAt: '1 day ago',
    fileCount: 6,
    content: `# Algorithms Research & Optimization Notes

## 1. Shortest Path Graph Algorithms
- **Dijkstra** algorithm finds single-source shortest paths on graphs with non-negative edge weights.
- Time Complexity: O((V + E) log V) when implemented using a **Min-Priority Queue**.
- **Bellman-Ford** algorithm handles negative edge weights and detects negative cycles in O(V * E).

### Heuristic Search: A* Search Algorithm
- **A* Search** extends Dijkstra by combining actual path cost g(n) with heuristic estimate h(n).
- **Admissible Heuristic** never overestimates true cost to goal.
- Widely utilized in robotics, spatial pathfinding, and game development.

## 2. Dynamic Programming Paradigms
- Used for optimization problems featuring **Overlapping Subproblems** and **Optimal Substructure**.
- **Top-Down Memoization**: Recursive strategy storing solved subproblem results in a hash table or array.
- **Bottom-Up Tabulation**: Iterative table-building approach eliminating recursion overhead.
- Classical instances include **0/1 Knapsack**, **Longest Common Subsequence** (LCS), and **Fibonacci**.`,
  },
  {
    id: 'nb_3',
    title: 'Compiler Design',
    category: 'Specialization',
    summary: 'Lexical analysis, LL(1) parsing tables, and intermediate representation code generation.',
    updatedAt: '3 days ago',
    fileCount: 3,
    content: `# Compiler Design Lecture & Implementation Notes

## 1. Lexical Analysis (Lexer)
- Reads source character stream and produces **Tokens** (Keywords, Identifiers, Operators).
- **Regular Expressions** define token patterns converted into **DFA** (Deterministic Finite Automata).

## 2. Syntax Analysis (Parser)
- Verifies grammatical structure using **Context-Free Grammars** (CFG).
- Builds an **AST** (Abstract Syntax Tree) representing language syntax.
- **LL(1)**: Top-down predictive parser using 1 token lookahead with First and Follow sets.
- **LR(1)** & **LALR**: Bottom-up shift-reduce parsers handling complex programming languages.

## 3. Intermediate Representation & Code Generation
- **3-Address Code** (TAC) breaks complex expressions into quadruples with temporary registers.
- **SSA** (Static Single Assignment) form simplifies compiler optimization passes like dead code elimination.`,
  },
];

export const techLanguages: TechLanguage[] = [
  {
    id: 'lang_python',
    name: 'Python',
    code: 'Py',
    level: 'Advanced',
    color: '#3776AB',
    bgOpacityColor: 'bg-inverse-primary/20 text-inverse-primary',
    description: 'Primary language for AI/ML, data processing, and rapid prototyping.',
    sampleCode: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
  },
  {
    id: 'lang_cpp',
    name: 'C++',
    code: 'C++',
    level: 'Intermediate',
    color: '#00599C',
    bgOpacityColor: 'bg-primary/20 text-primary',
    description: 'High performance systems programming, embedded logic, and DSA implementation.',
    sampleCode: `#include <iostream>
#include <vector>

void quicksort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        int pi = i + 1;
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}`,
  },
  {
    id: 'lang_java',
    name: 'Java',
    code: 'Ja',
    level: 'Beginner',
    color: '#E76F51',
    bgOpacityColor: 'bg-error/20 text-error',
    description: 'Enterprise object-oriented design, backend web services, and Android app dev.',
    sampleCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello AI Frands Students!");
    }
}`,
  },
  {
    id: 'lang_rust',
    name: 'Rust',
    code: 'Rs',
    level: 'Intermediate',
    color: '#DEA584',
    bgOpacityColor: 'bg-tertiary/20 text-tertiary',
    description: 'Memory-safe systems language without garbage collection overhead.',
    sampleCode: `fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];
    numbers.push(6);
    println!("Vector count: {}", numbers.len());
}`,
  },
];
