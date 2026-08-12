export interface MindMapNode {
  title: string;
  subnodes: string[];
}

export interface MindMapData {
  centralTopic: string;
  branches: MindMapNode[];
}

export interface SubTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface SubjectChapter {
  id: string;
  title: string;
  category: 'Core Subject' | 'Elective' | 'Lab & Systems' | 'Capstone & Project';
  description: string;
  notes: string;
  mindMap: MindMapData;
  youtubeUrl: string;
  youtubeTitle: string;
  topics: SubTopic[];
  semesterId: number; // 1 to 8
  year: number; // 1 to 4
}

export interface SemesterProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Capstone';
  description: string;
  techStack: string[];
}

export interface SemesterData {
  id: number; // 1 to 8
  year: number; // 1 to 4
  title: string; // e.g. "Semester 1"
  subtitle: string; // e.g. "Fundamentals of Computing & C++"
  description: string;
  subjects: SubjectChapter[];
  suggestedProjects: SemesterProject[];
}

export interface YearData {
  year: number;
  title: string;
  tagline: string;
  semesters: number[]; // e.g. [1, 2]
  description: string;
}

export const YEARS_DATA: YearData[] = [
  {
    year: 1,
    title: 'Year 1: Fundamentals',
    tagline: 'Semesters 1 & 2',
    semesters: [1, 2],
    description: 'Foundations of computer science, C++ memory models, digital circuits, and discrete math.',
  },
  {
    year: 2,
    title: 'Year 2: Core CS Systems',
    tagline: 'Semesters 3 & 4',
    semesters: [3, 4],
    description: 'Data structures, computer architecture, operating systems, databases, and full-stack web.',
  },
  {
    year: 3,
    title: 'Year 3: Specialization & AI',
    tagline: 'Semesters 5 & 6',
    semesters: [5, 6],
    description: 'Machine learning, computer networks, automata theory, deep learning, and compilers.',
  },
  {
    year: 4,
    title: 'Year 4: Capstone & Career',
    tagline: 'Semesters 7 & 8',
    semesters: [7, 8],
    description: 'Distributed systems, system design, capstone defense, AI agents, and interview prep.',
  },
];

export const INITIAL_CURRICULUM_SEMESTERS: SemesterData[] = [
  // ==================== SEMESTER 1 ====================
  {
    id: 1,
    year: 1,
    title: 'Semester 1',
    subtitle: 'Fundamentals of Computing & C++',
    description: 'Master procedural memory management, pointers, and basic digital logic.',
    subjects: [
      {
        id: 'sem1_sub1',
        title: 'C++ Programming & Memory Basics',
        category: 'Core Subject',
        description: 'Fundamentals of procedural programming, pointers, references, and memory layout in C++.',
        semesterId: 1,
        year: 1,
        notes: `
### Key Concepts in C++ Memory Architecture

1. **Memory Segments**: C++ programs manage memory in three distinct regions:
   - **Stack**: Fast, automatic memory used for local variables and function call frames. Managed by the compiler.
   - **Heap**: Dynamic memory explicitly allocated at runtime using \`new\` and freed using \`delete\`. Must be managed carefully to avoid memory leaks.
   - **Global/Static**: Stores global variables and constant strings for the lifetime of the application.

2. **Pointers & Addresses**:
   - A pointer stores the raw memory address of another variable in hex format.
   - Dereferencing (\`*p\`) accesses or modifies the value stored at that address.
   - Passing by reference (\`&\`) passes memory access directly to functions without copying data.

3. **Best Practices**:
   - Always initialize pointers to \`nullptr\`.
   - Match every \`new\` call with a corresponding \`delete\` to keep memory clean.
        `,
        mindMap: {
          centralTopic: 'C++ Memory & Pointers',
          branches: [
            {
              title: 'Stack Memory',
              subnodes: ['Local Variables', 'Function Call Frames', 'Fast Auto Allocation'],
            },
            {
              title: 'Heap Memory',
              subnodes: ['Pointers & Addresses', 'new / delete Operators', 'Memory Leak Prevention'],
            },
            {
              title: 'Function Arguments',
              subnodes: ['Pass-by-Value', 'Pass-by-Reference (&)', 'Const Pointer Pass'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
        youtubeTitle: 'C++ Programming Full Course for Beginners (freeCodeCamp)',
        topics: [
          { id: 'sem1_sub1_t1', name: 'Basic Syntax, Variables & Primitive Data Types', completed: true },
          { id: 'sem1_sub1_t2', name: 'Control Flow (Branching, Loops & Switch Statements)', completed: true },
          { id: 'sem1_sub1_t3', name: 'Functions, Prototypes & Call Stack Frame Execution', completed: true },
          { id: 'sem1_sub1_t4', name: 'Pointers, Memory Addresses & Reference Variables', completed: true },
          { id: 'sem1_sub1_t5', name: 'Dynamic Memory Allocation (new / delete Operators)', completed: true },
          { id: 'sem1_sub1_t6', name: 'Const Qualifiers, Pointer Arithmetic & References', completed: false },
          { id: 'sem1_sub1_t7', name: 'Structs, Enums & Memory Padding / Alignment', completed: false },
          { id: 'sem1_sub1_t8', name: 'File I/O Streams (std::ifstream / std::ofstream)', completed: false },
        ],
      },
      {
        id: 'sem1_sub2',
        title: 'Engineering Mathematics I (Linear Algebra)',
        category: 'Core Subject',
        description: 'Matrix operations, systems of linear equations, vector spaces, and eigenvalues.',
        semesterId: 1,
        year: 1,
        notes: `
### Linear Algebra in Computer Science

Linear Algebra provides the mathematical language for computer graphics, machine learning algorithms, and 3D game physics.

1. **Matrix Multiplication**: Transforms vectors from one coordinate space to another (essential for 3D camera projections).
2. **Gaussian Elimination**: Systematically solves sets of linear equations for engineering simulations.
3. **Eigenvalues & Eigenvectors**: Identify fundamental directional axes that remain unchanged under transformation. Used extensively in Principal Component Analysis (PCA) and PageRank.
        `,
        mindMap: {
          centralTopic: 'Linear Algebra',
          branches: [
            {
              title: 'Matrices',
              subnodes: ['Matrix Multiplication', 'Determinants', 'Gaussian Elimination'],
            },
            {
              title: 'Vector Spaces',
              subnodes: ['Vector Span', 'Linear Independence', 'Basis & Dimension'],
            },
            {
              title: 'Eigenspaces',
              subnodes: ['Eigenvalues (λ)', 'Eigenvectors (v)', 'Dimensionality Reduction'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoEg',
        youtubeTitle: 'Essence of Linear Algebra (3Blue1Brown)',
        topics: [
          { id: 'sem1_sub2_t1', name: 'Matrices, Vector Operations & Dot / Cross Products', completed: true },
          { id: 'sem1_sub2_t2', name: 'Systems of Equations & Gaussian Elimination', completed: true },
          { id: 'sem1_sub2_t3', name: 'Vector Spaces, Span & Subspaces', completed: true },
          { id: 'sem1_sub2_t4', name: 'Linear Independence, Basis & Dimension', completed: false },
          { id: 'sem1_sub2_t5', name: 'Linear Transformations & Projection Matrices', completed: false },
          { id: 'sem1_sub2_t6', name: 'Eigenvalues & Eigenvectors Calculation', completed: false },
          { id: 'sem1_sub2_t7', name: 'Principal Component Analysis (PCA) Fundamentals', completed: false },
        ],
      },
      {
        id: 'sem1_sub3',
        title: 'Digital Logic & Boolean Algebra',
        category: 'Lab & Systems',
        description: 'Fundamental building blocks of computing hardware: gates, truth tables, and Karnaugh maps.',
        semesterId: 1,
        year: 1,
        notes: `
### Digital Hardware Foundations

Computers process all calculations using binary electrical signals (High voltage = 1, Low voltage = 0).

1. **Logic Gates**: Transistors configured as AND, OR, NOT, XOR gates compute elementary Boolean logic.
2. **Karnaugh Maps (K-Maps)**: A visual grid method to simplify complex Boolean algebraic expressions to minimize physical gate count.
3. **Adders**: Combinational circuits like Half Adders and Full Adders add binary digits together to form the Arithmetic Logic Unit (ALU).
        `,
        mindMap: {
          centralTopic: 'Digital Logic',
          branches: [
            {
              title: 'Boolean Algebra',
              subnodes: ['Logic Gates', 'Truth Tables', 'De Morgan Laws'],
            },
            {
              title: 'Simplification',
              subnodes: ['Karnaugh Maps (K-Maps)', 'Sum of Products (SOP)', 'Minimal Gate Count'],
            },
            {
              title: 'Combinational Logic',
              subnodes: ['Half & Full Adders', 'Multiplexers (MUX)', 'ALU Building Blocks'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=l7rce6IQDWs',
        youtubeTitle: 'Building an 8-bit Computer from Logic Gates (Ben Eater)',
        topics: [
          { id: 'sem1_sub3_t1', name: 'Binary, Hexadecimal & Two\'s Complement Systems', completed: true },
          { id: 'sem1_sub3_t2', name: 'Boolean Algebra Laws & Logic Gate Symbolism', completed: true },
          { id: 'sem1_sub3_t3', name: 'Truth Tables & De Morgan\'s Theorems', completed: true },
          { id: 'sem1_sub3_t4', name: 'Karnaugh Maps & Sum of Products (SOP) Minimization', completed: false },
          { id: 'sem1_sub3_t5', name: 'Half Adders & Full Adders (ALU Foundations)', completed: false },
          { id: 'sem1_sub3_t6', name: 'Multiplexers (MUX), Demultiplexers & Encoders', completed: false },
          { id: 'sem1_sub3_t7', name: 'SR Latches, D Flip-Flops & Sequential Circuits', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem1_1',
        title: 'CLI Student Management System',
        difficulty: 'Beginner',
        description: 'Build a command-line student record manager in C++ using pointers, structs, and binary file storage.',
        techStack: ['C++', 'File I/O', 'Structs', 'Pointers'],
      },
      {
        id: 'proj_sem1_2',
        title: 'Logic Gate Truth Table Evaluator',
        difficulty: 'Beginner',
        description: 'Create a console application that parses Boolean expressions and computes complete truth tables for custom gates.',
        techStack: ['C++', 'Boolean Logic', 'CLI'],
      },
    ],
  },

  // ==================== SEMESTER 2 ====================
  {
    id: 2,
    year: 1,
    title: 'Semester 2',
    subtitle: 'Object-Oriented Programming & Discrete Structures',
    description: 'Master classes, inheritance, discrete proof techniques, and Python automation.',
    subjects: [
      {
        id: 'sem2_sub1',
        title: 'Object-Oriented Programming in C++',
        category: 'Core Subject',
        description: 'Encapsulation, inheritance, polymorphism, templates, and Standard Template Library (STL).',
        semesterId: 2,
        year: 1,
        notes: `
### Object-Oriented Principles in C++

OOP structures code around domain objects combining state (member variables) and behavior (member functions).

1. **Encapsulation**: Restricting direct access to data members via \`private\` and \`protected\` access modifiers.
2. **Inheritance**: Creating derived classes that inherit attributes from base classes.
3. **Polymorphism**: Dynamic dispatch using \`virtual\` functions and virtual table (\`vtable\`) pointers.
4. **STL Containers**: Leveraging \`std::vector\`, \`std::map\`, and \`std::set\` for high-performance memory management.
        `,
        mindMap: {
          centralTopic: 'C++ Object-Oriented Programming',
          branches: [
            {
              title: 'Encapsulation',
              subnodes: ['Classes & Objects', 'Access Modifiers', 'Constructors & Destructors'],
            },
            {
              title: 'Inheritance & Polymorphism',
              subnodes: ['Base / Derived Classes', 'Virtual Functions', 'Virtual Table (vtable)'],
            },
            {
              title: 'STL Containers',
              subnodes: ['std::vector', 'std::map & std::set', 'Iterators & Algorithms'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM',
        youtubeTitle: 'C++ OOP Principles & Virtual Functions (Corey Schafer)',
        topics: [
          { id: 'sem2_sub1_t1', name: 'Classes, Objects, Encapsulation & Access Modifiers', completed: true },
          { id: 'sem2_sub1_t2', name: 'Constructors, Destructors & Copy / Move Semantics', completed: true },
          { id: 'sem2_sub1_t3', name: 'Single & Multiple Class Inheritance Hierarchies', completed: true },
          { id: 'sem2_sub1_t4', name: 'Polymorphism, Virtual Functions & vtable Mechanism', completed: true },
          { id: 'sem2_sub1_t5', name: 'Abstract Classes & Pure Virtual Interfaces', completed: false },
          { id: 'sem2_sub1_t6', name: 'Operator Overloading & Friend Functions', completed: false },
          { id: 'sem2_sub1_t7', name: 'C++ STL Vectors, Maps, Sets & Iterators', completed: false },
          { id: 'sem2_sub1_t8', name: 'C++ Smart Pointers (std::unique_ptr & std::shared_ptr)', completed: false },
        ],
      },
      {
        id: 'sem2_sub2',
        title: 'Discrete Mathematics & Proofs',
        category: 'Core Subject',
        description: 'Sets, relations, logic proofs, mathematical induction, and introductory graph theory.',
        semesterId: 2,
        year: 1,
        notes: `
### Discrete Mathematics Foundations

Discrete Math provides the analytical framework for algorithm correctness and formal program verification.

1. **Mathematical Induction**: Proving a property holds for base case \`n=0\` and for \`k+1\` given it holds for \`k\` (directly maps to recursion!).
2. **Relations & Functions**: Injective, surjective, and bijective mappings between discrete sets.
3. **Graph Basics**: Vertices, edges, degree sums, Eulerian circuits, and Hamiltonian paths.
        `,
        mindMap: {
          centralTopic: 'Discrete Mathematics',
          branches: [
            {
              title: 'Proof Techniques',
              subnodes: ['Direct Proof', 'Proof by Contradiction', 'Mathematical Induction'],
            },
            {
              title: 'Sets & Relations',
              subnodes: ['Set Operations', 'Equivalence Relations', 'Partial Orders'],
            },
            {
              title: 'Graph Fundamentals',
              subnodes: ['Vertices & Edges', 'Degree Sequence', 'Handshaking Lemma'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=tyDKR4FG3Yw',
        youtubeTitle: 'Discrete Math for Computer Science (TrevTutor)',
        topics: [
          { id: 'sem2_sub2_t1', name: 'Propositional & Predicate Logic (Quantifiers)', completed: true },
          { id: 'sem2_sub2_t2', name: 'Direct Proofs, Contrapositive & Contradiction', completed: true },
          { id: 'sem2_sub2_t3', name: 'Mathematical Induction & Strong Induction', completed: true },
          { id: 'sem2_sub2_t4', name: 'Set Operations, Cartesian Products & Power Sets', completed: false },
          { id: 'sem2_sub2_t5', name: 'Relations, Equivalence Classes & Partial Orders', completed: false },
          { id: 'sem2_sub2_t6', name: 'Graph Theory (Vertices, Edges & Handshaking Lemma)', completed: false },
          { id: 'sem2_sub2_t7', name: 'Eulerian vs. Hamiltonian Graph Paths', completed: false },
        ],
      },
      {
        id: 'sem2_sub3',
        title: 'Python Scripting & Automation',
        category: 'Lab & Systems',
        description: 'High-level script language fundamentals, data structures, files, and modules.',
        semesterId: 2,
        year: 1,
        notes: `
### Python for Developer Automation

Python is an interpreted, dynamically-typed language optimized for developer speed and rich ecosystem integration.

1. **Dynamic Data Structures**: Lists, tuples, sets, and dictionaries with built-in hash lookups.
2. **Functional Idioms**: List comprehensions, \`lambda\`, \`map\`, \`filter\`, and generator functions for clean data transformations.
3. **Virtual Environments**: Using \`venv\` and \`pip\` to isolate third-party library dependencies cleanly.
        `,
        mindMap: {
          centralTopic: 'Python Ecosystem',
          branches: [
            {
              title: 'Core Language',
              subnodes: ['Dynamic Typing', 'Lists & Dictionaries', 'List Comprehensions'],
            },
            {
              title: 'Control & Modules',
              subnodes: ['Exception Handling', 'File I/O Streams', 'Standard Library'],
            },
            {
              title: 'Environment & Tools',
              subnodes: ['pip Package Manager', 'venv Virtual Environments', 'Automation Scripts'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
        youtubeTitle: 'Python Tutorial - Python for Beginners (Programming with Mosh)',
        topics: [
          { id: 'sem2_sub3_t1', name: 'Python Syntax, Variables & Dynamic Typing', completed: true },
          { id: 'sem2_sub3_t2', name: 'Lists, Tuples, Sets & Hash Dictionaries', completed: true },
          { id: 'sem2_sub3_t3', name: 'List & Dictionary Comprehensions', completed: true },
          { id: 'sem2_sub3_t4', name: 'File I/O, JSON Parsing & Exception Handling', completed: true },
          { id: 'sem2_sub3_t5', name: 'Modules, Packages & Virtual Environments (venv)', completed: false },
          { id: 'sem2_sub3_t6', name: 'Regular Expressions (regex) for Text Extraction', completed: false },
          { id: 'sem2_sub3_t7', name: 'Subprocess & OS System Automation Scripts', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem2_1',
        title: 'Bank Account OOP Hierarchy',
        difficulty: 'Beginner',
        description: 'Develop an OOP banking simulator in C++ with savings/checking accounts, transactions history, and virtual functions.',
        techStack: ['C++', 'OOP', 'Polymorphism', 'STL'],
      },
      {
        id: 'proj_sem2_2',
        title: 'Automated Log File Parser in Python',
        difficulty: 'Beginner',
        description: 'Write a Python script that parses web server access logs, extracts IP statistics, and generates summary JSON reports.',
        techStack: ['Python', 'File I/O', 'Regex', 'JSON'],
      },
    ],
  },

  // ==================== SEMESTER 3 ====================
  {
    id: 3,
    year: 2,
    title: 'Semester 3',
    subtitle: 'Data Structures, Assembly & Java Systems',
    description: 'Implement core data structures, explore assembly execution, and master Java collections.',
    subjects: [
      {
        id: 'sem3_sub1',
        title: 'Data Structures & Algorithms (DSA)',
        category: 'Core Subject',
        description: 'Arrays, linked lists, binary trees, heaps, graphs, sorting, and asymptotic Big-O analysis.',
        semesterId: 3,
        year: 2,
        notes: `
### Data Structures & Algorithmic Efficiency

Data structures dictate how memory is organized in RAM to optimize lookup, insertion, and deletion speeds.

1. **Big-O Notation**: Expresses upper-bound worst-case runtime as input size \`N\` grows:
   - \`O(1)\`: Constant time (array index access, hash map lookup).
   - \`O(log N)\`: Logarithmic time (binary search, AVL tree operations).
   - \`O(N)\`: Linear time (linked list traversal, unindexed search).
   - \`O(N log N)\`: Linearithmic time (Merge Sort, Quick Sort).
2. **Binary Search Trees (BST)**:
   - Left subtree values < Parent < Right subtree values.
   - In-order traversal visits nodes in sorted order.
   - AVL trees auto-balance via rotations to maintain \`O(log N)\` height.
        `,
        mindMap: {
          centralTopic: 'Data Structures & Algorithms',
          branches: [
            {
              title: 'Linear Structures',
              subnodes: ['Dynamic Arrays', 'Singly & Doubly Linked Lists', 'Stacks & Queues'],
            },
            {
              title: 'Trees & Graphs',
              subnodes: ['Binary Search Trees (BST)', 'AVL Tree Rotations', 'Min/Max Heaps'],
            },
            {
              title: 'Complexity',
              subnodes: ['Big-O / Big-Ω / Big-Θ', 'Space Complexity', 'Amortized Analysis'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=8hly31xKLI0',
        youtubeTitle: 'Data Structures & Algorithms Course (freeCodeCamp)',
        topics: [
          { id: 'sem3_sub1_t1', name: 'Big-O Notation & Asymptotic Complexity', completed: true },
          { id: 'sem3_sub1_t2', name: 'Arrays & Singly/Doubly Linked Lists', completed: true },
          { id: 'sem3_sub1_t3', name: 'Binary Search Trees & AVL Rotations', completed: true },
          { id: 'sem3_sub1_t4', name: 'Graph Representation (Adjacency Matrix/List)', completed: true },
        ],
      },
      {
        id: 'sem3_sub2',
        title: 'Computer Organization & Assembly',
        category: 'Lab & Systems',
        description: 'CPU registers, instruction set architecture (ISA), memory hierarchies, and assembly.',
        semesterId: 3,
        year: 2,
        notes: `
### Computer Architecture & Assembly

Understanding CPU hardware execution reveals why cache-friendly contiguous data layouts run significantly faster.

- **CPU Registers**: High-speed, on-chip storage slots (\`EAX/RAX\`, \`ESP/RSP\`, \`EBP/RBP\`) that execute operations directly.
- **Fetch-Decode-Execute Cycle**: Clock-driven CPU loop fetching instructions from RAM, decoding opcodes, and executing in the ALU.
- **Cache Memory**: L1 (fastest, small), L2, L3 caches store recent RAM cache lines to minimize main memory access latency.
        `,
        mindMap: {
          centralTopic: 'Computer Architecture',
          branches: [
            {
              title: 'CPU Execution',
              subnodes: ['Fetch-Decode-Execute', 'ALU & Control Unit', 'Pipeline Hazards'],
            },
            {
              title: 'Registers & Stack',
              subnodes: ['General Purpose Registers', 'Stack Pointer (RSP)', 'Call Stack Frames'],
            },
            {
              title: 'Memory Hierarchy',
              subnodes: ['L1 / L2 / L3 Cache', 'Cache Lines & Hits', 'RAM Access Latency'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=4Tz5jXTO8Xg',
        youtubeTitle: 'Computer Architecture Lectures (Carnegie Mellon)',
        topics: [
          { id: 'sem3_sub2_t1', name: 'CPU Pipeline & Control Unit', completed: true },
          { id: 'sem3_sub2_t2', name: 'Assembly Language Basics (x86/ARM)', completed: true },
          { id: 'sem3_sub2_t3', name: 'Memory Hierarchy & Cache Line Alignment', completed: false },
          { id: 'sem3_sub2_t4', name: 'Stack Frames & Function Call Calls', completed: false },
        ],
      },
      {
        id: 'sem3_sub3',
        title: 'Object-Oriented Design in Java',
        category: 'Core Subject',
        description: 'Java virtual machine (JVM), memory management, collections framework, and multi-threading.',
        semesterId: 3,
        year: 2,
        notes: `
### Java Virtual Machine & Collections

Java source files compile into \`.class\` bytecode that runs everywhere on the Java Virtual Machine (JVM).

- **JVM Subsystems**: Classloader loads bytecode, Execution Engine compiles JIT machine code, Garbage Collector reclaims dead objects.
- **Java Collections Framework**: High-level Interfaces (\`List\`, \`Set\`, \`Map\`) backed by \`ArrayList\`, \`HashSet\`, and \`HashMap\`.
- **HashMap Mechanics**: Uses \`hashCode()\` to bucket entries and equals() to resolve collisions via linked nodes or red-black trees.
        `,
        mindMap: {
          centralTopic: 'Java & JVM Systems',
          branches: [
            {
              title: 'JVM Subsystems',
              subnodes: ['Bytecode Execution', 'JIT Compiler', 'Garbage Collector'],
            },
            {
              title: 'Collections API',
              subnodes: ['ArrayList vs LinkedList', 'HashSet & TreeSet', 'HashMap Mechanics'],
            },
            {
              title: 'Concurrency',
              subnodes: ['Threads & Runnable', 'Synchronized Blocks', 'ConcurrentHashMap'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=xk4_1vDrnnU',
        youtubeTitle: 'Java Full Course for Free (Bro Code)',
        topics: [
          { id: 'sem3_sub3_t1', name: 'JVM Architecture & Bytecode Execution', completed: true },
          { id: 'sem3_sub3_t2', name: 'Java Collections Framework (List/Set/Map)', completed: true },
          { id: 'sem3_sub3_t3', name: 'HashMap Internal Hashing Mechanics', completed: true },
          { id: 'sem3_sub3_t4', name: 'Java Multi-threading & Threads', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem3_1',
        title: 'AVL Tree & Data Structure Library in C++',
        difficulty: 'Intermediate',
        description: 'Build a self-balancing AVL binary search tree template class in C++ with animated tree visualization and rotation logs.',
        techStack: ['C++', 'AVL Tree', 'Data Structures', 'Templates'],
      },
      {
        id: 'proj_sem3_2',
        title: 'Java Multi-Threaded File Downloader & Scheduler',
        difficulty: 'Intermediate',
        description: 'Create a Java console application with thread pools managing concurrent download jobs and thread-safe queues.',
        techStack: ['Java', 'Multi-Threading', 'ThreadPool', 'Sockets'],
      },
    ],
  },

  // ==================== SEMESTER 4 ====================
  {
    id: 4,
    year: 2,
    title: 'Semester 4',
    subtitle: 'Operating Systems, DBMS & Full-Stack Web',
    description: 'Master OS process scheduling, relational databases, and full-stack React + Node web platforms.',
    subjects: [
      {
        id: 'sem4_sub1',
        title: 'Operating Systems',
        category: 'Core Subject',
        description: 'Processes, threads, CPU scheduling, synchronization, virtual memory, and file systems.',
        semesterId: 4,
        year: 2,
        notes: `
### Operating Systems & Kernel Fundamentals

The kernel bridges application software with physical CPU, RAM, and hardware devices.

- **Process vs Thread**: A process is an isolated execution environment with its own address space. Threads share process heap memory but keep private execution stacks.
- **Synchronization**: Mutex locks and Semaphores prevent race conditions when concurrent threads modify shared memory.
- **Virtual Memory & Paging**: Translates virtual memory addresses to physical RAM pages using Page Tables and TLB (Translation Lookaside Buffer) hardware caches.
        `,
        mindMap: {
          centralTopic: 'Operating Systems Kernel',
          branches: [
            {
              title: 'Process Control',
              subnodes: ['PCB States', 'Context Switching', 'FCFS / SJF / Round Robin'],
            },
            {
              title: 'Synchronization',
              subnodes: ['Critical Section', 'Mutexes & Semaphores', 'Deadlock Conditions'],
            },
            {
              title: 'Memory Virtualization',
              subnodes: ['Page Tables & MMU', 'TLB Cache', 'Page Fault Handling'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=vBURTt97EkA',
        youtubeTitle: 'Operating System Full Course (Neso Academy)',
        topics: [
          { id: 'sem4_sub1_t1', name: 'Process Control Blocks (PCB) & Context Switching', completed: true },
          { id: 'sem4_sub1_t2', name: 'CPU Scheduling (Round Robin, SJF, Priority)', completed: true },
          { id: 'sem4_sub1_t3', name: 'Mutexes, Semaphores & Deadlocks', completed: true },
          { id: 'sem4_sub1_t4', name: 'Virtual Memory, Paging & Page Replacement', completed: false },
        ],
      },
      {
        id: 'sem4_sub2',
        title: 'Database Management Systems (DBMS)',
        category: 'Core Subject',
        description: 'Relational data models, SQL queries, normalization (1NF-BCNF), and ACID transactions.',
        semesterId: 4,
        year: 2,
        notes: `
### Database Systems & SQL Optimization

Relational Database Management Systems (RDBMS) guarantee durable, structured data persistence.

- **SQL Joins**: Combine records from multiple tables using \`INNER JOIN\`, \`LEFT JOIN\`, or \`FULL OUTER JOIN\`.
- **Normalization**: Standardizing schema design (1NF, 2NF, 3NF, BCNF) to eliminate redundant storage and update anomalies.
- **ACID Transactions**:
  - **Atomicity**: All operations succeed or all roll back.
  - **Consistency**: Database transitions between valid states.
  - **Isolation**: Concurrent transactions do not interfere.
  - **Durability**: Committed data survives system power failures.
        `,
        mindMap: {
          centralTopic: 'Relational DBMS',
          branches: [
            {
              title: 'SQL & Schema',
              subnodes: ['DDL / DML Queries', 'Joins & Subqueries', 'Indexes & B-Trees'],
            },
            {
              title: 'Normalization',
              subnodes: ['1NF / 2NF / 3NF', 'BCNF Form', 'Redundancy Reduction'],
            },
            {
              title: 'Transactions',
              subnodes: ['ACID Guarantees', 'WAL Logging', 'Locking & Concurrency'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        youtubeTitle: 'SQL & Database Normalization Masterclass (freeCodeCamp)',
        topics: [
          { id: 'sem4_sub2_t1', name: 'Relational Schema & Entity-Relationship Modeling', completed: true },
          { id: 'sem4_sub2_t2', name: 'Complex SQL Queries, Aggregations & Joins', completed: true },
          { id: 'sem4_sub2_t3', name: 'Database Normalization (1NF, 2NF, 3NF, BCNF)', completed: true },
          { id: 'sem4_sub2_t4', name: 'ACID Transactions & B-Tree Indexing', completed: false },
        ],
      },
      {
        id: 'sem4_sub3',
        title: 'Full-Stack Web Development',
        category: 'Lab & Systems',
        description: 'React frontend single-page applications, Express API servers, and RESTful architectures.',
        semesterId: 4,
        year: 2,
        notes: `
### Modern Full-Stack Architecture

Full-stack applications decouple interactive UI clients from server API services.

- **React Single-Page Apps (SPA)**: Render dynamic UIs using virtual DOM reconciliation, component state (\`useState\`), and side effects (\`useEffect\`).
- **Express API Backend**: Handles incoming HTTP requests, executes business logic, and sends JSON responses.
- **REST Conventions**: Uses standard HTTP verbs (\`GET\`, \`POST\`, \`PUT\`, \`DELETE\`) mapped to resource URLs.
        `,
        mindMap: {
          centralTopic: 'Full-Stack Web Stack',
          branches: [
            {
              title: 'Frontend React',
              subnodes: ['JSX Syntax', 'State & Hooks', 'Virtual DOM Diffing'],
            },
            {
              title: 'Backend Express',
              subnodes: ['Routing Pipeline', 'Middleware Stack', 'JSON REST APIs'],
            },
            {
              title: 'HTTP & Auth',
              subnodes: ['REST Verbs', 'JWT Tokens', 'CORS & Security Headers'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        youtubeTitle: 'React JS Crash Course for Beginners (Traversy Media)',
        topics: [
          { id: 'sem4_sub3_t1', name: 'HTML5 Semantic Markup & Modern CSS Grid/Flexbox', completed: true },
          { id: 'sem4_sub3_t2', name: 'React Component State, Props & Hooks', completed: true },
          { id: 'sem4_sub3_t3', name: 'Express.js REST API Server Routes', completed: true },
          { id: 'sem4_sub3_t4', name: 'Full-Stack JWT Authentication & CORS', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem4_1',
        title: 'Virtual Memory Page Replacement Simulator',
        difficulty: 'Intermediate',
        description: 'Build a C++ simulation comparing FIFO, LRU, and Optimal page replacement algorithms with page fault statistics.',
        techStack: ['C++', 'Operating Systems', 'Simulation'],
      },
      {
        id: 'proj_sem4_2',
        title: 'Full-Stack Student Portal & Project Showcase',
        difficulty: 'Intermediate',
        description: 'Construct a complete React + Express + SQLite web app featuring authentication, project submission forms, and REST endpoints.',
        techStack: ['React', 'Express', 'Node.js', 'SQLite', 'Tailwind'],
      },
    ],
  },

  // ==================== SEMESTER 5 ====================
  {
    id: 5,
    year: 3,
    title: 'Semester 5',
    subtitle: 'Machine Learning, Computer Networks & Formal Automata',
    description: 'Explore artificial intelligence, TCP/IP networking, and state automata theory.',
    subjects: [
      {
        id: 'sem5_sub1',
        title: 'AI & Machine Learning Fundamentals',
        category: 'Core Subject',
        description: 'Supervised/unsupervised learning, regression, classification, decision trees, and neural networks.',
        semesterId: 5,
        year: 3,
        notes: `
### Machine Learning & Pattern Recognition

Machine Learning replaces hardcoded logic with mathematical statistical models trained on data.

- **Supervised Learning**: Model learns a mapping function from input features \`X\` to target labels \`Y\` (e.g., Linear Regression, Logistic Regression).
- **Gradient Descent**: Iterative optimization algorithm that minimizes the loss function by computing partial derivatives across network weights.
- **Artificial Neural Networks**: Layers of connected artificial neurons using non-linear activation functions (ReLU, Sigmoid) to model complex data surfaces.
        `,
        mindMap: {
          centralTopic: 'Machine Learning',
          branches: [
            {
              title: 'Supervised Learning',
              subnodes: ['Linear / Logistic Regression', 'Decision Trees', 'Random Forests'],
            },
            {
              title: 'Optimization',
              subnodes: ['Loss Functions', 'Gradient Descent', 'Learning Rate & Regularization'],
            },
            {
              title: 'Neural Networks',
              subnodes: ['Perceptrons & Layers', 'Activation Functions', 'Backpropagation Calculus'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
        youtubeTitle: 'Neural Networks & Deep Learning Essentials (3Blue1Brown)',
        topics: [
          { id: 'sem5_sub1_t1', name: 'Supervised vs Unsupervised Learning Models', completed: true },
          { id: 'sem5_sub1_t2', name: 'Linear & Logistic Regression with Gradient Descent', completed: true },
          { id: 'sem5_sub1_t3', name: 'Decision Trees & Random Forest Classifiers', completed: false },
          { id: 'sem5_sub1_t4', name: 'Artificial Neural Networks & Backpropagation', completed: false },
        ],
      },
      {
        id: 'sem5_sub2',
        title: 'Computer Networks & Security',
        category: 'Core Subject',
        description: 'OSI 7-layer model, TCP/IP stack, routing protocols, DNS, TLS/SSL, and socket APIs.',
        semesterId: 5,
        year: 3,
        notes: `
### Computer Networking Protocols

Global networks transmit packetized payload data across heterogeneous network hardware.

- **TCP/IP Stack**: Application (HTTP/DNS), Transport (TCP/UDP), Network (IP/ICMP), Link (Ethernet/WiFi).
- **TCP Handshake**: 3-step connection setup (\`SYN\` -> \`SYN-ACK\` -> \`ACK\`) ensuring ordered, reliable packet stream delivery.
- **DNS Resolution**: Converts human domains (e.g. \`google.com\`) to numerical IP addresses via recursive DNS lookups.
        `,
        mindMap: {
          centralTopic: 'Computer Networks',
          branches: [
            {
              title: 'Network Layers',
              subnodes: ['OSI 7-Layer Model', 'TCP/IP Protocol Stack', 'Ethernet Framing'],
            },
            {
              title: 'Transport Layer',
              subnodes: ['TCP 3-Way Handshake', 'UDP Datagrams', 'Window Flow Control'],
            },
            {
              title: 'Security & Services',
              subnodes: ['IPv4 / IPv6 Subnetting', 'DNS Resolution', 'TLS Public Key Crypto'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=IPvYjXWnt68',
        youtubeTitle: 'Computer Networks Course (NetworkChuck)',
        topics: [
          { id: 'sem5_sub2_t1', name: 'OSI 7-Layer & TCP/IP Protocol Layers', completed: true },
          { id: 'sem5_sub2_t2', name: 'TCP 3-Way Handshake vs UDP Datagrams', completed: true },
          { id: 'sem5_sub2_t3', name: 'IP Subnetting & CIDR Notation', completed: false },
          { id: 'sem5_sub2_t4', name: 'DNS Resolution & TLS/SSL Encryption', completed: false },
        ],
      },
      {
        id: 'sem5_sub3',
        title: 'Theory of Computation & Automata',
        category: 'Core Subject',
        description: 'Finite state machines, regular expressions, grammars, Turing machines, and decidability.',
        semesterId: 5,
        year: 3,
        notes: `
### Automata & Theoretical Limits

Theory of Computation defines what problems are algorithmically solvable by finite computing devices.

- **Finite State Automata (DFA/NFA)**: Abstract machines with states and input transitions modeling regular languages.
- **Context-Free Grammars (CFG)**: Production rules defining programming language syntax, parsed by Pushdown Automata with stack memory.
- **Turing Machines**: Unconstrained tape machines modeling universal digital computation. The Halting Problem proves undecidable limits exist.
        `,
        mindMap: {
          centralTopic: 'Theoretical Automata',
          branches: [
            {
              title: 'Finite Automata',
              subnodes: ['DFA & NFA Transitions', 'Regular Expressions', 'Pumping Lemma'],
            },
            {
              title: 'Grammars & Parsers',
              subnodes: ['Context-Free Grammars', 'Pushdown Automata (PDA)', 'Syntax Trees'],
            },
            {
              title: 'Turing Machines',
              subnodes: ['Universal Turing Machine', 'Halting Problem', 'P vs NP Completeness'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=58N2N7zJGrQ',
        youtubeTitle: 'Theory of Computation & Automata (Neso Academy)',
        topics: [
          { id: 'sem5_sub3_t1', name: 'Deterministic & Non-Deterministic Automata (DFA/NFA)', completed: false },
          { id: 'sem5_sub3_t2', name: 'Regular Expressions & Pumping Lemma', completed: false },
          { id: 'sem5_sub3_t3', name: 'Context-Free Grammars & Pushdown Automata', completed: false },
          { id: 'sem5_sub3_t4', name: 'Turing Machines & The Halting Problem', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem5_1',
        title: 'Digit Classifier Pipeline in PyTorch',
        difficulty: 'Intermediate',
        description: 'Build and train a neural network classifier using PyTorch on the MNIST dataset with accuracy visualization.',
        techStack: ['Python', 'PyTorch', 'Neural Networks', 'Machine Learning'],
      },
      {
        id: 'proj_sem5_2',
        title: 'Custom HTTP/1.1 Socket Web Server',
        difficulty: 'Intermediate',
        description: 'Build a low-level HTTP server in C++ or Python using raw TCP sockets that parses requests and serves static HTML files.',
        techStack: ['C++', 'Python', 'TCP Sockets', 'HTTP'],
      },
    ],
  },

  // ==================== SEMESTER 6 ====================
  {
    id: 6,
    year: 3,
    title: 'Semester 6',
    subtitle: 'Deep Learning, Compilers & Cloud DevOps',
    description: 'Master transformers, LLM tokenizers, compiler frontends, and Docker container deployment.',
    subjects: [
      {
        id: 'sem6_sub1',
        title: 'Deep Learning & Transformers (LLMs)',
        category: 'Core Subject',
        description: 'Convolutional neural networks, transformers, self-attention, and large language models.',
        semesterId: 6,
        year: 3,
        notes: `
### Modern Deep Learning & Transformer Architecture

Transformers revolutionized AI by replacing sequential RNN processing with parallelized self-attention mechanisms.

- **Self-Attention Mechanism**: Calculates similarity weights between all input tokens simultaneously using Query (\`Q\`), Key (\`K\`), and Value (\`V\`) matrix operations.
- **Multi-Head Attention**: Allows the model to attend to information from different representation subspaces concurrently.
- **LLM Fine-Tuning**: Techniques like LoRA (Low-Rank Adaptation) fine-tune billions of parameters efficiently by injecting trainable rank decomposition matrices.
        `,
        mindMap: {
          centralTopic: 'Transformers & LLMs',
          branches: [
            {
              title: 'Attention Mechanism',
              subnodes: ['Query, Key, Value Matrices', 'Scaled Dot-Product Attention', 'Multi-Head Attention'],
            },
            {
              title: 'Transformer Stack',
              subnodes: ['Positional Encoding', 'Encoder-Decoder Blocks', 'Residual Connections'],
            },
            {
              title: 'LLM Fine-Tuning',
              subnodes: ['Byte-Pair Tokenization', 'LoRA / PEFT Fine-Tuning', 'Retrieval-Augmented Generation'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=zjkBMFhNj_g',
        youtubeTitle: 'Intro to Transformers & LLMs (Andrej Karpathy)',
        topics: [
          { id: 'sem6_sub1_t1', name: 'Convolutional Neural Networks (CNN) for Vision', completed: true },
          { id: 'sem6_sub1_t2', name: 'Self-Attention Mechanism (Query, Key, Value)', completed: false },
          { id: 'sem6_sub1_t3', name: 'Transformer Architecture & Encoder/Decoder', completed: false },
          { id: 'sem6_sub1_t4', name: 'LLM Tokenization & LoRA Fine-Tuning', completed: false },
        ],
      },
      {
        id: 'sem6_sub2',
        title: 'Compiler Design & Code Generation',
        category: 'Core Subject',
        description: 'Lexical analysis, syntax parsing, Abstract Syntax Trees (AST), semantic analysis, and assembly output.',
        semesterId: 6,
        year: 3,
        notes: `
### Compiler Frontend & Backend Pipeline

Compilers translate human-readable source code into optimized machine assembly instructions.

1. **Lexical Analysis**: Breaks raw code character streams into semantic tokens (keywords, identifiers, operators).
2. **Syntax Analysis**: Constructs an Abstract Syntax Tree (AST) validating grammar against context-free rules.
3. **Semantic Analysis**: Performs type checking and verifies identifier declarations in symbol tables.
4. **Code Generation**: Emits intermediate representation (IR) or target machine instructions.
        `,
        mindMap: {
          centralTopic: 'Compiler Architecture',
          branches: [
            {
              title: 'Lexing & Parsing',
              subnodes: ['Token Stream', 'Grammar Rules', 'Abstract Syntax Tree (AST)'],
            },
            {
              title: 'Analysis Phase',
              subnodes: ['Symbol Table Lookup', 'Type Verification', 'Semantic Validation'],
            },
            {
              title: 'CodeGen Phase',
              subnodes: ['Intermediate Representation (IR)', 'Optimization Pass', 'Target Machine Assembly'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=eF9qWbuQLuw',
        youtubeTitle: 'Compiler Design Basics (Stanford Lectures)',
        topics: [
          { id: 'sem6_sub2_t1', name: 'Lexical Analysis & Regular Expression Tokenizers', completed: false },
          { id: 'sem6_sub2_t2', name: 'Syntax Analysis & Abstract Syntax Tree (AST)', completed: false },
          { id: 'sem6_sub2_t3', name: 'Symbol Table Management & Type Checking', completed: false },
          { id: 'sem6_sub2_t4', name: 'Intermediate Code Generation & Optimization', completed: false },
        ],
      },
      {
        id: 'sem6_sub3',
        title: 'Cloud Computing & DevOps Pipelines',
        category: 'Lab & Systems',
        description: 'Containerization, Docker, Kubernetes, CI/CD automated deployment, and cloud infrastructure.',
        semesterId: 6,
        year: 3,
        notes: `
### DevOps & Cloud Infrastructure

DevOps unites development velocity with reliable, automated operations in the cloud.

- **Docker Containers**: Package code alongside isolated filesystem layers, dependencies, and system binaries.
- **CI/CD Pipelines**: Automated GitHub Actions workflows that trigger linter checks, unit tests, and production deployments on git push.
- **Kubernetes Orchestration**: Manages container scheduling, self-healing pod restarts, and load balancing across cluster nodes.
        `,
        mindMap: {
          centralTopic: 'Cloud & DevOps',
          branches: [
            {
              title: 'Containerization',
              subnodes: ['Dockerfiles & Images', 'Container Isolation', 'Docker Compose'],
            },
            {
              title: 'CI/CD Automation',
              subnodes: ['GitHub Actions Workflows', 'Automated Testing', 'Deployment Artifacts'],
            },
            {
              title: 'Orchestration',
              subnodes: ['Kubernetes Pods & Services', 'Auto-Scaling', 'Cloud Run / AWS ECS'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
        youtubeTitle: 'Docker & Kubernetes Course (TechWorld with Nana)',
        topics: [
          { id: 'sem6_sub3_t1', name: 'Docker Containers, Images & Dockerfiles', completed: true },
          { id: 'sem6_sub3_t2', name: 'Multi-Container Setup with Docker Compose', completed: true },
          { id: 'sem6_sub3_t3', name: 'CI/CD Automation with GitHub Actions', completed: false },
          { id: 'sem6_sub3_t4', name: 'Kubernetes Pods, Services & Cloud Deployment', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem6_1',
        title: 'Custom Math Expression Compiler in C++',
        difficulty: 'Advanced',
        description: 'Build a lexer, parser, and AST evaluator in C++ that compiles mathematical expressions into bytecode.',
        techStack: ['C++', 'Compilers', 'AST', 'Lexer'],
      },
      {
        id: 'proj_sem6_2',
        title: 'Dockerized Microservices Platform with Redis',
        difficulty: 'Advanced',
        description: 'Build a multi-service web application with React, Express, Redis cache, and PostgreSQL orchestrated via Docker Compose.',
        techStack: ['Docker', 'Express', 'Redis', 'PostgreSQL', 'React'],
      },
    ],
  },

  // ==================== SEMESTER 7 ====================
  {
    id: 7,
    year: 4,
    title: 'Semester 7',
    subtitle: 'Distributed Systems, System Design & Capstone Phase I',
    description: 'Build fault-tolerant distributed databases, master high-level system architecture, and kick off capstones.',
    subjects: [
      {
        id: 'sem7_sub1',
        title: 'Distributed Systems & Cloud Scale',
        category: 'Core Subject',
        description: 'Consensus protocols (Raft, Paxos), RPC, data replication, partitioning, and CAP theorem.',
        semesterId: 7,
        year: 4,
        notes: `
### Distributed Consensus & Fault Tolerance

Distributed systems connect multiple independent network nodes to operate as a single reliable cluster.

- **CAP Theorem**: A distributed system can guarantee at most two of three properties simultaneously: Consistency, Availability, and Partition Tolerance.
- **Raft Consensus Protocol**: Manages replicated log state across cluster nodes via leader election, log replication, and safety invariants.
- **gRPC & Protocol Buffers**: High-performance RPC framework using binary serialization for low-latency inter-service communication.
        `,
        mindMap: {
          centralTopic: 'Distributed Systems',
          branches: [
            {
              title: 'Fundamental Principles',
              subnodes: ['CAP Theorem', 'PACELC Trade-offs', 'Eventual Consistency'],
            },
            {
              title: 'Consensus Protocols',
              subnodes: ['Raft Protocol', 'Leader Election', 'Replicated Log State'],
            },
            {
              title: 'IPC Infrastructure',
              subnodes: ['gRPC & Protocol Buffers', 'Message Queues (Kafka)', 'Distributed Lock Managers'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=xpDnVSmNFX0',
        youtubeTitle: 'System Design Primer & Distributed Systems (Gaurav Sen)',
        topics: [
          { id: 'sem7_sub1_t1', name: 'CAP Theorem & PACELC Trade-offs', completed: false },
          { id: 'sem7_sub1_t2', name: 'gRPC & Binary Protocol Buffers Serialization', completed: false },
          { id: 'sem7_sub1_t3', name: 'Raft Consensus & Leader Election', completed: false },
          { id: 'sem7_sub1_t4', name: 'Distributed Transactions & 2-Phase Commit', completed: false },
        ],
      },
      {
        id: 'sem7_sub2',
        title: 'High-Level System Design',
        category: 'Core Subject',
        description: 'Scalability patterns, load balancing, caching strategies, database sharding, and API gateways.',
        semesterId: 7,
        year: 4,
        notes: `
### Large-Scale Web Architecture

System design teaches software engineers how to architect platforms serving millions of concurrent requests reliably.

- **Horizontal Scaling**: Adding more stateless web application nodes behind a load balancer (Nginx / HAProxy).
- **Caching Tier**: Using Redis in-memory key-value stores to reduce database load and cut latency from 100ms to 2ms.
- **Database Sharding**: Partitioning large datasets across multiple database servers by hash keys.
        `,
        mindMap: {
          centralTopic: 'System Design',
          branches: [
            {
              title: 'Scalability',
              subnodes: ['Stateless App Servers', 'Load Balancers', 'Auto-Scaling Groups'],
            },
            {
              title: 'Caching & Data',
              subnodes: ['Redis In-Memory Cache', 'CDN Edge Caching', 'Database Sharding & Replicas'],
            },
            {
              title: 'Resilience',
              subnodes: ['Rate Limiting (Token Bucket)', 'Circuit Breakers', 'Asynchronous Queues'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=i7twT3G5yv8',
        youtubeTitle: 'System Design Interview Course (ByteByteGo)',
        topics: [
          { id: 'sem7_sub2_t1', name: 'Horizontal Scaling & Load Balancers (Nginx)', completed: false },
          { id: 'sem7_sub2_t2', name: 'Caching Strategies with Redis & CDNs', completed: false },
          { id: 'sem7_sub2_t3', name: 'Database Sharding, Partitioning & Replicas', completed: false },
          { id: 'sem7_sub2_t4', name: 'Rate Limiting Algorithms (Token Bucket/Leaky Bucket)', completed: false },
        ],
      },
      {
        id: 'sem7_sub3',
        title: 'Capstone Project Phase I',
        category: 'Capstone & Project',
        description: 'Architecture specification document, team sprint planning, and MVP core feature development.',
        semesterId: 7,
        year: 4,
        notes: `
### Capstone Engineering Specification

Capstone Phase I transitions theoretical knowledge into a production-grade software engineering application.

- **Architectural Specification**: Authors write System Architecture Diagrams, Data Schemas, and API Contracts.
- **Sprint Management**: Breaking features down into GitHub issues with 2-week agile sprint iterations.
- **Core MVP Delivery**: Establishing test suites, repository CI/CD pipelines, and functional minimum product features.
        `,
        mindMap: {
          centralTopic: 'Capstone Phase I',
          branches: [
            {
              title: 'Planning',
              subnodes: ['Requirements Document', 'Entity-Relationship Diagram', 'API Blueprint'],
            },
            {
              title: 'Agile Workflow',
              subnodes: ['GitHub Issues & Milestones', 'Sprint Reviews', 'CI/CD Pipeline Setup'],
            },
            {
              title: 'MVP Build',
              subnodes: ['Core Engine', 'Database Integration', 'End-to-End Tests'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=2L110mmsR2w',
        youtubeTitle: 'Software Project Architecture & Agile Planning',
        topics: [
          { id: 'sem7_sub3_t1', name: 'Software Requirements Specification (SRS)', completed: false },
          { id: 'sem7_sub3_t2', name: 'System Architecture & ER Diagram Blueprint', completed: false },
          { id: 'sem7_sub3_t3', name: 'Agile Sprint Planning & GitHub Workflows', completed: false },
          { id: 'sem7_sub3_t4', name: 'Minimum Viable Product (MVP) Core Release', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem7_1',
        title: 'Raft Replicated Key-Value Storage Engine',
        difficulty: 'Capstone',
        description: 'Implement a distributed, fault-tolerant key-value store in Go or C++ using the Raft consensus algorithm with leader election.',
        techStack: ['Go', 'C++', 'Raft Consensus', 'Distributed Systems'],
      },
      {
        id: 'proj_sem7_2',
        title: 'High-Throughput Token Bucket API Gateway',
        difficulty: 'Advanced',
        description: 'Construct a custom reverse-proxy API gateway in Express/Go featuring Redis-backed token bucket rate limiting and circuit breaking.',
        techStack: ['Express', 'Redis', 'Reverse Proxy', 'System Design'],
      },
    ],
  },

  // ==================== SEMESTER 8 ====================
  {
    id: 8,
    year: 4,
    title: 'Semester 8',
    subtitle: 'AI Agents, Capstone Final Defense & Career Placement',
    description: 'Deploy autonomous AI agents, finalize cloud capstones, and master technical coding interviews.',
    subjects: [
      {
        id: 'sem8_sub1',
        title: 'Autonomous AI Agents & RAG Systems',
        category: 'Core Subject',
        description: 'Autonomous agent reasoning loops (ReAct), tool calling, vector databases, and Retrieval-Augmented Generation.',
        semesterId: 8,
        year: 4,
        notes: `
### Autonomous AI Agents & Vector RAG

AI Agents combine Large Language Models with external tool execution loops and long-term memory retrieval.

- **ReAct Loop (Reason/Act)**: The agent generates an internal thought, selects an external tool (e.g. calculator, API, web search), executes it, and observes output.
- **Function / Tool Calling**: LLM outputs structured JSON matching function signatures for automated tool execution.
- **RAG Architecture**: Converts text documents into dense vector embeddings stored in a vector database (Chroma, Pinecone) for semantic cosine search.
        `,
        mindMap: {
          centralTopic: 'Autonomous AI Agents',
          branches: [
            {
              title: 'Agent Loops',
              subnodes: ['ReAct Reasoning Loop', 'Tool Signature Matching', 'Observation Parsing'],
            },
            {
              title: 'Vector RAG',
              subnodes: ['Text Embeddings', 'Vector Databases', 'Cosine Similarity Search'],
            },
            {
              title: 'Multi-Agent Systems',
              subnodes: ['Role Allocation', 'Inter-Agent Communication', 'Grounded Responses'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=sal78ACtGTc',
        youtubeTitle: 'AI Agents & RAG Architecture (DeepLearning.AI)',
        topics: [
          { id: 'sem8_sub1_t1', name: 'ReAct Agent Reasoning & Tool Execution Loops', completed: true },
          { id: 'sem8_sub1_t2', name: 'Function / Tool Calling with Structured JSON', completed: true },
          { id: 'sem8_sub1_t3', name: 'Vector Embeddings & Cosine Similarity Search', completed: false },
          { id: 'sem8_sub1_t4', name: 'Retrieval-Augmented Generation (RAG) Architecture', completed: false },
        ],
      },
      {
        id: 'sem8_sub2',
        title: 'Capstone Defense & Production Deployment',
        category: 'Capstone & Project',
        description: 'Cloud Run / ECS deployment, SSL setup, load testing, security audits, and final defense presentation.',
        semesterId: 8,
        year: 4,
        notes: `
### Capstone Defense & Production Release

The final capstone release demonstrates production engineering readiness to academic evaluation boards.

- **Cloud Infrastructure**: Deploying containerized web applications on Google Cloud Run or AWS ECS with custom domains and SSL encryption.
- **Load Testing**: Simulating concurrent traffic using k6 or Locust to verify response times and memory limits.
- **Technical Defense**: Presenting live system demonstrations, architectural tradeoffs, and answering peer review questions.
        `,
        mindMap: {
          centralTopic: 'Capstone Production',
          branches: [
            {
              title: 'Cloud Deployment',
              subnodes: ['Google Cloud Run / AWS', 'Custom Domains & SSL', 'Environment Secrets'],
            },
            {
              title: 'Hardening & Testing',
              subnodes: ['k6 / Locust Load Testing', 'Security Vulnerability Audit', 'Log Telemetry'],
            },
            {
              title: 'Final Defense',
              subnodes: ['Live Product Demo', 'Code Architecture Defense', 'Comprehensive Documentation'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=y8OnoxKotPQ',
        youtubeTitle: 'Presenting a Software Engineering Capstone Project',
        topics: [
          { id: 'sem8_sub2_t1', name: 'Production Cloud Deployment (Cloud Run / AWS)', completed: false },
          { id: 'sem8_sub2_t2', name: 'Benchmarking & Load Testing with k6', completed: false },
          { id: 'sem8_sub2_t3', name: 'Security Auditing & Vulnerability Patching', completed: false },
          { id: 'sem8_sub2_t4', name: 'Final Capstone Defense & Live Demo', completed: false },
        ],
      },
      {
        id: 'sem8_sub3',
        title: 'Tech Placement & Coding Interview Mastery',
        category: 'Core Subject',
        description: 'LeetCode coding patterns (Two Pointers, Sliding Window, DP), mock technical reviews, and system design interviews.',
        semesterId: 8,
        year: 4,
        notes: `
### Technical Interview Mastery

Securing top engineering roles requires mastering core algorithmic patterns and systematic problem-solving communication.

- **Algorithmic Patterns**: Two Pointers, Sliding Window, Fast & Slow Pointers, Monotonic Stack, Dynamic Programming.
- **System Design Framework**: Clarify requirements, estimate scale, design high-level components, dive into key bottlenecks.
- **Behavioral Framework**: Using the STAR method (Situation, Task, Action, Result) to articulate past engineering achievements.
        `,
        mindMap: {
          centralTopic: 'Technical Placements',
          branches: [
            {
              title: 'Coding Patterns',
              subnodes: ['Two Pointers & Sliding Window', 'Graph Traversals (BFS/DFS)', 'Dynamic Programming'],
            },
            {
              title: 'System Interviews',
              subnodes: ['Estimation & Scale Math', 'High-Level Diagramming', 'Bottleneck Resolution'],
            },
            {
              title: 'Career Branding',
              subnodes: ['STAR Behavioral Framework', 'Resume Optimization', 'GitHub Portfolio Hygiene'],
            },
          ],
        },
        youtubeUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
        youtubeTitle: 'NeetCode 150 Coding Patterns Overview',
        topics: [
          { id: 'sem8_sub3_t1', name: 'Top LeetCode Algorithmic Patterns', completed: true },
          { id: 'sem8_sub3_t2', name: 'Mock Technical Code Reviews & Pair Programming', completed: true },
          { id: 'sem8_sub3_t3', name: 'System Design Interview Framework', completed: false },
          { id: 'sem8_sub3_t4', name: 'Behavioral Interviews (STAR Method) & Resumes', completed: false },
        ],
      },
    ],
    suggestedProjects: [
      {
        id: 'proj_sem8_1',
        title: 'Autonomous Gemini AI Study Agent with RAG',
        difficulty: 'Capstone',
        description: 'Build an AI tutoring assistant powered by Gemini 2.5 Flash, featuring vector PDF search, tool calling, and voice input/output.',
        techStack: ['React', 'TypeScript', 'Gemini API', 'Vector Search', 'Web Speech'],
      },
      {
        id: 'proj_sem8_2',
        title: 'Enterprise Capstone Cloud Release',
        difficulty: 'Capstone',
        description: 'Finalize, load test, and deploy a full-stack CS portal application to Cloud Run with automated CI/CD and monitoring.',
        techStack: ['Cloud Run', 'Docker', 'PostgreSQL', 'Express', 'React'],
      },
    ],
  },
];
