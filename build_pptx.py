import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Color Palette (Dark Modern Tech Theme)
BG_COLOR = RGBColor(11, 17, 32)        # Deep slate/navy
CARD_BG = RGBColor(30, 41, 59)         # Slate 800
CARD_BORDER = RGBColor(51, 65, 85)     # Slate 700
ACCENT_PURPLE = RGBColor(139, 92, 246) # Violet
ACCENT_BLUE = RGBColor(56, 189, 248)   # Sky Blue
ACCENT_GREEN = RGBColor(16, 185, 129)  # Emerald
TEXT_WHITE = RGBColor(248, 250, 252)   # Slate 50
TEXT_MUTED = RGBColor(148, 163, 184)   # Slate 400
TEXT_BODY = RGBColor(226, 232, 240)    # Slate 200

def set_slide_background(slide):
    # Add a full-bleed rectangle for background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background() # no line

def add_header(slide, title_text, category_text="ALGOLENS • DATA STRUCTURES COURSE PROJECT"):
    # Category tag
    tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
    tf_cat = tb_cat.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category_text.upper()
    p_cat.font.size = Pt(11)
    p_cat.font.bold = True
    p_cat.font.color.rgb = ACCENT_BLUE

    # Title
    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(24)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

def add_card(slide, left, top, width, height, title="", title_color=ACCENT_PURPLE):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = CARD_BORDER
    card.line.width = Pt(1.2)
    
    if title:
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = title_color
    return card

# ----------------- SLIDE 1: TITLE SLIDE -----------------
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide1)

# Large Hero Box
hero_card = add_card(slide1, Inches(1.2), Inches(1.2), Inches(10.933), Inches(5.1), title="")
hero_card.line.color.rgb = ACCENT_PURPLE

tb = slide1.shapes.add_textbox(Inches(1.6), Inches(1.5), Inches(10.133), Inches(4.5))
tf = tb.text_frame
tf.word_wrap = True

p0 = tf.paragraphs[0]
p0.text = "DEPARTMENT OF COMPUTER ENGINEERING"
p0.font.size = Pt(13)
p0.font.bold = True
p0.font.color.rgb = ACCENT_BLUE
p0.space_after = Pt(14)

p1 = tf.add_paragraph()
p1.text = "AlgoLens"
p1.font.size = Pt(46)
p1.font.bold = True
p1.font.color.rgb = TEXT_WHITE

p2 = tf.add_paragraph()
p2.text = "Interactive Data Structures, Algorithms & System Memory Visualizer"
p2.font.size = Pt(20)
p2.font.bold = True
p2.font.color.rgb = ACCENT_PURPLE
p2.space_after = Pt(20)

p3 = tf.add_paragraph()
p3.text = "A Comprehensive Platform Covering Modules 1 to 7 • Real 64-Bit Memory Architecture • UNIX File System Explorer • Active Blind Prediction Mode"
p3.font.size = Pt(13.5)
p3.font.color.rgb = TEXT_MUTED
p3.space_after = Pt(36)

p4 = tf.add_paragraph()
p4.text = "Course: Data Structures Course Project (CP)   |   Institute: Vishwakarma Institute of Technology (VIT), Pune"
p4.font.size = Pt(13)
p4.font.bold = True
p4.font.color.rgb = ACCENT_GREEN

# ----------------- SLIDE 2: INTRODUCTION & PROBLEM STATEMENT -----------------
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide2)
add_header(slide2, "Introduction & Problem Statement")

# Card 1: The Learning Dilemma
add_card(slide2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "The Problem: Traditional DSA Learning", ACCENT_BLUE)
tb1 = slide2.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.2), Inches(4.4))
tf1 = tb1.text_frame
tf1.word_wrap = True

points1 = [
    ("Abstract Classroom Diagrams: ", "Data structures are taught on blackboards or static slide decks, making dynamic pointer movements hard to imagine."),
    ("The 'Invisible Memory' Problem: ", "Students write code without understanding what happens in physical RAM—stack frames, heap allocation, and address calculation remain mystery concepts."),
    ("Passive Watching vs. Active Learning: ", "Existing tools show animations like movies; students watch passively without checking if they actually understand the algorithm."),
    ("No Real-World Context: ", "Trees and graphs are studied as abstract mathematical concepts rather than real-world tools like the operating system file hierarchy.")
]
for title, desc in points1:
    p = tf1.add_paragraph()
    p.text = "• " + title
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(2)
    p2 = tf1.add_paragraph()
    p2.text = "   " + desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(10)

# Card 2: The AlgoLens Solution
add_card(slide2, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2), "Our Solution: The AlgoLens Platform", ACCENT_GREEN)
tb2 = slide2.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.4))
tf2 = tb2.text_frame
tf2.word_wrap = True

points2 = [
    ("Deterministic Step Engine: ", "Every algorithm yields immutable state snapshots with zero-latency forward & backward time-travel scrubbing."),
    ("Dual-Stage Visualization: ", "Shows the high-level visual animation side-by-side with a low-level 64-bit RAM memory inspector (Call Stack & Heap)."),
    ("Structured 4-Line Explanations: ", "Every single step is explained through Operation, Algorithmic Invariant, RAM/Pointers, and Next Action."),
    ("Blind Prediction Mode: ", "Pauses at decision branches to quiz the student on what happens next, encouraging active recall."),
    ("Flagship Case Study: ", "A live UNIX File System Explorer that connects general tree algorithms to actual operating system directories.")
]
for title, desc in points2:
    p = tf2.add_paragraph()
    p.text = "✔ " + title
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p.space_after = Pt(2)
    p2 = tf2.add_paragraph()
    p2.text = "   " + desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(10)

# ----------------- SLIDE 3: NEED & MOTIVATION -----------------
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide3)
add_header(slide3, "Need & Motivation for the Project")

mots = [
    ("🧠 Visual Retention", "Humans process visual information 60,000x faster than raw text. Watching sorted boundaries grow and pointers rewire cements long-term algorithmic intuition.", ACCENT_BLUE),
    ("💻 Low-Level Hardware Bridge", "Computer Science students must understand both high-level algorithmic logic and low-level system constraints (cache locality, stack overflows, dynamic heap allocations).", ACCENT_PURPLE),
    ("🎯 Active Recall Over Passive Observation", "Educational research proves active prediction improves exam retention by 40%. Our 'Blind Mode' challenges students to think before revealing the answer.", ACCENT_GREEN),
    ("📁 Practical Engineering Relevance", "Showing trees as UNIX folders (/home, /usr, /var) and showing post-order traversal as folder size calculation makes algorithms meaningful and practical.", ACCENT_BLUE)
]

for i, (title, desc, col) in enumerate(mots):
    r = i // 2
    c = i % 2
    x = Inches(0.8 + c * 6.0)
    y = Inches(1.6 + r * 2.7)
    add_card(slide3, x, y, Inches(5.7), Inches(2.4), title, col)
    tb = slide3.shapes.add_textbox(x + Inches(0.2), y + Inches(0.6), Inches(5.3), Inches(1.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = desc
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_BODY
    p.line_spacing = 1.3

# ----------------- SLIDE 4: OBJECTIVES & SCOPE -----------------
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide4)
add_header(slide4, "Objectives & Scope of AlgoLens")

add_card(slide4, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "Key Project Objectives", ACCENT_PURPLE)
tb = slide4.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.2), Inches(4.4))
tf = tb.text_frame
tf.word_wrap = True
objs = [
    ("1. Unified Syllabus Coverage: ", "Build an interactive platform implementing all 7 university modules in one seamless interface."),
    ("2. Deterministic State Engine: ", "Implement generator-based time-travel enabling instant forward, backward, and jump navigation."),
    ("3. Hardware Memory Emulation: ", "Visualize 64-bit virtual memory addresses, activation call stacks, and dynamic heap pointer connections."),
    ("4. Active Recall Challenge: ", "Implement Blind Mode to assess learner comprehension at critical decision points."),
    ("5. UNIX Case Study: ", "Demonstrate general tree data structure operations in real-world operating system file hierarchies.")
]
for t, d in objs:
    p = tf.add_paragraph()
    p.text = t
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p2 = tf.add_paragraph()
    p2.text = d
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(10)

add_card(slide4, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2), "Project Scope & Boundary", ACCENT_GREEN)
tb = slide4.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.4))
tf = tb.text_frame
tf.word_wrap = True
scopes = [
    ("In Scope - Modules 1 to 7: ", "Arrays, Searching, 9 Sorting algorithms, Singly/Doubly/Circular/Generalized Lists, Stacks, Queues, Deque, BST, Threaded Trees, Graphs (Dijkstra, Kruskal), Hashing, and File Systems."),
    ("In Scope - Browser Performance: ", "Pure zero-dependency web architecture executing 60 FPS CSS transforms with hardware GPU acceleration."),
    ("In Scope - Self-Assessment: ", "Blind prediction mode with live scoring, streaks, and AI tutor support."),
    ("Out of Scope / Future Work: ", "Real-time multi-user shared classroom whiteboards and 3D spatial graph networks (planned for Phase 2).")
]
for t, d in scopes:
    p = tf.add_paragraph()
    p.text = t
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_WHITE
    p2 = tf.add_paragraph()
    p2.text = d
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(10)

# ----------------- SLIDE 5: LITERATURE SURVEY & EXISTING SYSTEMS -----------------
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide5)
add_header(slide5, "Literature Survey & Comparison with Existing Tools")

# Table
table_shape = slide5.shapes.add_table(5, 4, Inches(0.8), Inches(1.6), Inches(11.733), Inches(4.8))
table = table_shape.table
table.columns[0].width = Inches(2.4)
table.columns[1].width = Inches(3.1)
table.columns[2].width = Inches(3.1)
table.columns[3].width = Inches(3.133)

headers = ["Platform", "Key Strengths", "Limitations & Gaps", "How AlgoLens Improves"]
row0 = table.rows[0]
for idx, text in enumerate(headers):
    cell = row0.cells[idx]
    cell.fill.solid()
    cell.fill.fore_color.rgb = CARD_BG
    p = cell.text_frame.paragraphs[0]
    p.text = text
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = ACCENT_BLUE

data = [
    ("VisuAlgo", "Covers tree diagrams and standard sorting bars cleanly.", "No memory inspector; no backward step scrubbing; dated UI.", "True bidirectional time-travel; live 64-bit RAM memory mapping."),
    ("GeeksforGeeks", "Detailed theoretical code snippets and explanations.", "Static images and code blocks; no interactive animations.", "Deterministic real-time visual state machine with spring physics."),
    ("Python Tutor", "Good line-by-line pointer and call-stack tracing.", "Only basic code execution; lacks rich dedicated DSA visual stages.", "Dedicated specialized stages for Trees, Deque, Graphs, Hashing & File Trees."),
    ("AlgoLens (Ours)", "Full university syllabus, low-level memory, Blind Mode, real UNIX case study.", "Phase 1 is single-player web client without multi-user classroom sync.", "Unified, modern, responsive platform bridging theory, RAM, and practice.")
]

for row_idx, row_data in enumerate(data, start=1):
    row = table.rows[row_idx]
    for col_idx, text in enumerate(row_data):
        cell = row.cells[col_idx]
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(20, 27, 45) if row_idx % 2 == 1 else CARD_BG
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_WHITE if col_idx == 0 else TEXT_BODY
        if col_idx == 0:
            p.font.bold = True

# ----------------- SLIDE 6: FUNCTIONS OR OPERATIONS (BLOCK DIAGRAM) -----------------
slide6 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide6)
add_header(slide6, "System Functions & Operations (Block Diagram)")

# Image on Left
img_path = "presentation_assets/operations_block_diagram.png"
if os.path.exists(img_path):
    slide6.shapes.add_picture(img_path, Inches(0.8), Inches(1.6), Inches(7.2), Inches(5.1))

# Text Card on Right
add_card(slide6, Inches(8.3), Inches(1.6), Inches(4.2), Inches(5.1), "Core Functional Modules", ACCENT_BLUE)
tb = slide6.shapes.add_textbox(Inches(8.5), Inches(2.2), Inches(3.8), Inches(4.3))
tf = tb.text_frame
tf.word_wrap = True

fn_points = [
    ("1. Core Generator Engine: ", "Pre-computes state transitions as immutable objects before playback starts."),
    ("2. Dual-Stage Rendering: ", "Simultaneously renders visual state transitions and low-level 64-bit RAM addresses."),
    ("3. 4-Line Structured Explanations: ", "Action, Invariant, RAM Pointers, and Next Step lookahead on every step."),
    ("4. Blind Prediction Challenge: ", "Pauses at algorithmic branches to test student comprehension."),
    ("5. UNIX Tree Case Study: ", "Interactive general tree representing directories, files, and disk size computation.")
]
for t, d in fn_points:
    p = tf.add_paragraph()
    p.text = t
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p2 = tf.add_paragraph()
    p2.text = d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(6)

# ----------------- SLIDE 7: DATA STRUCTURES & ALGORITHMS USED (PART 1) -----------------
slide7 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide7)
add_header(slide7, "Data Structures & Algorithms Used (Modules 1 to 4)")

u_cards = [
    ("📊 Module 1: Arrays & Sorting", 
     "• 9 Sorting Techniques: Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Shell, Bucket Sort.\n"
     "• 4 Search Strategies: Linear, Binary, Indexed Sequential, Fibonacci Search.\n"
     "• 2D Address Mapping: Row-Major and Column-Major byte address calculation.\n"
     "• Sparse Matrix: 3-Tuple representation with Simple and Fast Transpose.", ACCENT_BLUE),
    ("🔗 Module 2: Linked Lists",
     "• Singly Linked List (SLL): Front/Rear/Middle insertion, deletion & search.\n"
     "• Doubly Linked List (DLL): Dual prev ⇄ next pointers with NULL boundaries.\n"
     "• Circular Linked List (CLL): Tail wraps back to head with continuous traversal.\n"
     "• Generalized Linked List (GLL): Atoms and recursive sublists (L1, L2).\n"
     "• In-Place Reversal: 3-pointer manipulation in O(1) auxiliary space.", ACCENT_PURPLE),
    ("🥞 Module 3: Stacks & Queues",
     "• Stack Evaluation: Infix to Postfix, Infix to Prefix (3-phase scan), Postfix Eval.\n"
     "• Circular Queue: Modulo arithmetic ((rear + 1) % MAX) preventing false overflow.\n"
     "• Double Ended Queue (Deque): Bidirectional insert & delete at Front and Rear.\n"
     "• Josephus Problem: Circular elimination simulation finding safe survivor.", ACCENT_GREEN),
    ("🌳 Module 4: Trees & BST",
     "• Binary Search Tree (BST): Recursive insertion and 3-case deletion.\n"
     "• Traversal Suite: Pre-order, In-order, and Post-order recursive traversals.\n"
     "• Threaded Binary Tree (TBT): Replaces NULL pointers with thread pointers to achieve O(1) space traversal without stack or recursion.", ACCENT_BLUE)
]

for i, (title, content, col) in enumerate(u_cards):
    r = i // 2
    c = i % 2
    x = Inches(0.8 + c * 6.0)
    y = Inches(1.6 + r * 2.7)
    add_card(slide7, x, y, Inches(5.7), Inches(2.4), title, col)
    tb = slide7.shapes.add_textbox(x + Inches(0.2), y + Inches(0.55), Inches(5.3), Inches(1.7))
    tf = tb.text_frame
    tf.word_wrap = True
    for line in content.split('\n'):
        p = tf.add_paragraph()
        p.text = line
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_BODY
        p.space_after = Pt(2)

# ----------------- SLIDE 8: DATA STRUCTURES & ALGORITHMS USED (PART 2) -----------------
slide8 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide8)
add_header(slide8, "Data Structures & Algorithms Used (Modules 5 to 7)")

u_cards2 = [
    ("🕸️ Module 5: Graphs & Minimum Spanning Trees",
     "• Representations: Dynamic Adjacency Matrix and Adjacency List switching.\n"
     "• Traversals: Breadth-First Search (BFS) and Depth-First Search (DFS).\n"
     "• Shortest Paths: Dijkstra's Algorithm with greedy distance relaxation.\n"
     "• Kruskal's MST: Edge weight sorting with Disjoint Set Union (DSU / Union-Find) and path compression.\n"
     "• Bipartite Graph Check: 2-coloring BFS verification.", ACCENT_PURPLE),
    ("🗝️ Module 6: Hashing & Collision Strategies",
     "• Open Addressing: Linear Probing with primary clustering analysis and Quadratic Probing.\n"
     "• Closed Addressing: Separate Chaining dynamic linked-list buckets.\n"
     "• Extendible Hashing: Global Depth (D) and Local Depth (d) directory doubling for dynamic external storage.", ACCENT_GREEN),
    ("📁 Module 7: Flagship Case Study — UNIX File System",
     "• Operating System Application: General N-ary tree modeling real-world file directories (/home, /usr, /var).\n"
     "• Synchronized Dual View: Animated SVG Tree Diagram synchronized with a collapsible sidebar tree.\n"
     "• Post-Order Traversal: Demonstrates directory disk size calculation (sum of all children).\n"
     "• File Actions: Add file/folder, rename, delete, move (drag-and-drop), and pathfinding from root.", ACCENT_BLUE)
]

# 2 cards top, 1 full-width card bottom
for i, (title, content, col) in enumerate(u_cards2):
    if i < 2:
        x = Inches(0.8 + i * 6.0)
        y = Inches(1.6)
        w = Inches(5.7)
        h = Inches(2.6)
    else:
        x = Inches(0.8)
        y = Inches(4.4)
        w = Inches(11.7)
        h = Inches(2.5)
    
    add_card(slide8, x, y, w, h, title, col)
    tb = slide8.shapes.add_textbox(x + Inches(0.2), y + Inches(0.55), w - Inches(0.4), h - Inches(0.7))
    tf = tb.text_frame
    tf.word_wrap = True
    for line in content.split('\n'):
        p = tf.add_paragraph()
        p.text = line
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_BODY
        p.space_after = Pt(2)

# ----------------- SLIDE 9: COMPLEXITY OF DATA STRUCTURES USED -----------------
slide9 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide9)
add_header(slide9, "Theoretical Complexity Analysis")

table_shape = slide9.shapes.add_table(9, 5, Inches(0.8), Inches(1.6), Inches(11.733), Inches(5.1))
table = table_shape.table
table.columns[0].width = Inches(3.2)
table.columns[1].width = Inches(2.1)
table.columns[2].width = Inches(2.1)
table.columns[3].width = Inches(2.1)
table.columns[4].width = Inches(2.233)

headers = ["Algorithm / Data Structure", "Best Time", "Average Time", "Worst Time", "Space Complexity"]
for idx, text in enumerate(headers):
    cell = table.rows[0].cells[idx]
    cell.fill.solid()
    cell.fill.fore_color.rgb = CARD_BG
    p = cell.text_frame.paragraphs[0]
    p.text = text
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = ACCENT_BLUE

c_data = [
    ("Bubble / Selection / Insertion Sort", "O(N) / O(N^2)", "O(N^2)", "O(N^2)", "O(1) in-place"),
    ("Merge Sort", "O(N log N)", "O(N log N)", "O(N log N)", "O(N) auxiliary"),
    ("Quick Sort (Lomuto Partition)", "O(N log N)", "O(N log N)", "O(N^2)", "O(log N) stack"),
    ("Binary Search", "O(1)", "O(log N)", "O(log N)", "O(1)"),
    ("Doubly Linked List (Insert/Delete)", "O(1)", "O(1)", "O(1)", "O(1)"),
    ("Binary Search Tree (Search/Insert)", "O(log N)", "O(log N)", "O(N) skewed", "O(H) height"),
    ("Dijkstra's Shortest Path", "O(E log V)", "O(E log V)", "O(V^2)", "O(V) priority table"),
    ("UNIX Directory Post-Order Size", "O(N)", "O(N)", "O(N)", "O(H) max depth")
]

for row_idx, row_data in enumerate(c_data, start=1):
    row = table.rows[row_idx]
    for col_idx, text in enumerate(row_data):
        cell = row.cells[col_idx]
        cell.fill.solid()
        cell.fill.fore_color.rgb = RGBColor(20, 27, 45) if row_idx % 2 == 1 else CARD_BG
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_WHITE if col_idx == 0 else TEXT_BODY
        if col_idx == 0:
            p.font.bold = True

# ----------------- SLIDE 10: INPUT DATA SOURCES -----------------
slide10 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide10)
add_header(slide10, "Input Data Sources & Generation Strategies")

inputs = [
    ("1. User-Specified Numerical Arrays", "Students can type arbitrary comma-separated integers (e.g. 34, 12, 8, 45) to trace specific edge cases or textbook questions.", ACCENT_BLUE),
    ("2. Automated Random Shuffler", "Generates randomized arrays of configurable lengths (8 to 16 elements) to visualize average-case sorting behavior with one click.", ACCENT_PURPLE),
    ("3. Mathematical Infix Strings", "Accepts standard algebraic expressions like `(A + B) * (C - D)` for infix-to-postfix and infix-to-prefix translation pipelines.", ACCENT_GREEN),
    ("4. 3-Tuple Sparse Matrix Data", "Ingests non-zero matrix elements as triplets `[row, col, value]` to demonstrate Simple and Fast Transpose algorithms.", ACCENT_BLUE),
    ("5. Graph Edge Lists & Adjacency Sets", "Dynamic graph topologies with user-configurable vertex weights for shortest path and minimum spanning tree tracking.", ACCENT_PURPLE),
    ("6. Hierarchical UNIX Directory Tree", "A pre-built UNIX root filesystem with interactive node creation, renaming, and deletion actions.", ACCENT_GREEN)
]

for i, (title, desc, col) in enumerate(inputs):
    r = i // 2
    c = i % 2
    x = Inches(0.8 + c * 6.0)
    y = Inches(1.6 + r * 1.8)
    add_card(slide10, x, y, Inches(5.7), Inches(1.5), title, col)
    tb = slide10.shapes.add_textbox(x + Inches(0.2), y + Inches(0.45), Inches(5.3), Inches(0.9))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = desc
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_BODY

# ----------------- SLIDE 11: SYSTEM ARCHITECTURE & FLOW DIAGRAM -----------------
slide11 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide11)
add_header(slide11, "System Architecture & Execution Pipeline")

# Image on Left
img_path = "presentation_assets/system_architecture_flowchart.png"
if os.path.exists(img_path):
    slide11.shapes.add_picture(img_path, Inches(0.8), Inches(1.6), Inches(7.2), Inches(5.1))

# Text Card on Right
add_card(slide11, Inches(8.3), Inches(1.6), Inches(4.2), Inches(5.1), "Pipeline Highlights", ACCENT_GREEN)
tb = slide11.shapes.add_textbox(Inches(8.5), Inches(2.2), Inches(3.8), Inches(4.3))
tf = tb.text_frame
tf.word_wrap = True

pipe_points = [
    ("Deterministic Generator: ", "Pre-computing all steps allows instant jumping, scrubbing, and zero lag."),
    ("Hardware Acceleration: ", "CSS transforms (translate3d) offload bar animations to the GPU, avoiding CPU lag."),
    ("Synchronized State: ", "The visual stage, memory inspector, explanation panel, and code line stay 100% in sync."),
    ("Active Assessment: ", "Blind mode hooks into the state stream to pause and evaluate the user.")
]
for t, d in pipe_points:
    p = tf.add_paragraph()
    p.text = t
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p2 = tf.add_paragraph()
    p2.text = d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(10)

# ----------------- SLIDE 12: REAL-WORLD CASE STUDY: UNIX FILE SYSTEM -----------------
slide12 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide12)
add_header(slide12, "Case Study: UNIX File System & Directory Tree Explorer")

# Screenshot on Left
fs_img = "presentation_assets/unix_filesystem_tree.png"
if os.path.exists(fs_img):
    slide12.shapes.add_picture(fs_img, Inches(0.8), Inches(1.6), Inches(6.8), Inches(5.1))

# Card on Right
add_card(slide12, Inches(7.9), Inches(1.6), Inches(4.6), Inches(5.1), "Tree Data Structure in Operating Systems", ACCENT_BLUE)
tb = slide12.shapes.add_textbox(Inches(8.1), Inches(2.2), Inches(4.2), Inches(4.3))
tf = tb.text_frame
tf.word_wrap = True

fs_points = [
    ("Hierarchical General Tree: ", "Represents root `/` branching into `/home`, `/usr`, `/var`, `/etc`, and nested subdirectories."),
    ("Synchronized Dual Views: ", "An interactive SVG tree diagram is synchronized with a collapsible sidebar file explorer."),
    ("Path Resolution: ", "Animates step-by-step traversal from root down ancestor chains to locate target files."),
    ("Post-Order Disk Size Aggregation: ", "Demonstrates why Post-Order traversal is essential: a folder's total disk size cannot be known until all child subfolders and files are computed first!"),
    ("Dynamic Actions: ", "Create file, create folder, rename, delete, and search with step-by-step path highlighting.")
]
for t, d in fs_points:
    p = tf.add_paragraph()
    p.text = "• " + t
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_WHITE
    p2 = tf.add_paragraph()
    p2.text = "   " + d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(6)

# ----------------- SLIDE 13: SCREENSHOTS OF OUTPUT - WORKBENCH & EXPLANATION -----------------
slide13 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide13)
add_header(slide13, "Output Screenshots: Workbench & 4-Line Explanations")

# Image 1: Landing Page
add_card(slide13, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.1), "Landing Page & Pipeline Showcase", ACCENT_PURPLE)
lp_img = "presentation_assets/landing_page.png"
if os.path.exists(lp_img):
    slide13.shapes.add_picture(lp_img, Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))

# Image 2: Bubble Sort & 4-Line Explanation
add_card(slide13, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.1), "Sorting Workbench & 4-Line Breakdown", ACCENT_GREEN)
bs_img = "presentation_assets/bubble_sort_explanation.png"
if os.path.exists(bs_img):
    slide13.shapes.add_picture(bs_img, Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))

# ----------------- SLIDE 14: SCREENSHOTS OF OUTPUT - MEMORY VISUALIZER & ADVANCED LISTS -----------------
slide14 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide14)
add_header(slide14, "Output Screenshots: Memory Visualizer & Advanced Lists")

# Image 1: Memory Visualizer
add_card(slide14, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.1), "64-Bit Memory Architecture (Stack & Heap)", ACCENT_BLUE)
mem_img = "presentation_assets/memory_visualizer.png"
if os.path.exists(mem_img):
    slide14.shapes.add_picture(mem_img, Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))

# Image 2: Doubly Linked List / Deque
add_card(slide14, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.1), "Module 2: Doubly Linked List (DLL)", ACCENT_PURPLE)
dll_img = "presentation_assets/doubly_linked_list.png"
if os.path.exists(dll_img):
    slide14.shapes.add_picture(dll_img, Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))

# ----------------- SLIDE 15: ADVANTAGES & KEY INNOVATIONS -----------------
slide15 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide15)
add_header(slide15, "Key Advantages & Technical Innovations")

advs = [
    ("⚡ Zero-Dependency Architecture", "Built purely with Vanilla JavaScript (ES6+), HTML5, and CSS3. No heavy frameworks or bloated bundles—guarantees lightning-fast startup and smooth 60 FPS transitions.", ACCENT_BLUE),
    ("⏪ True Bidirectional Time Travel", "Users can freely scrub forward, backward, or jump to any step in the algorithm's execution history without reloading or losing state.", ACCENT_PURPLE),
    ("🧠 64-Bit System Memory Bridge", "Connects high-level algorithmic logic to simulated low-level Call Stack activation frames and dynamic Heap chunks in hexadecimal RAM notation.", ACCENT_GREEN),
    ("🎯 Active Blind Prediction Recall", "Transforms passive video-style watching into active problem solving, reinforcing loop invariants and algorithmic thinking.", ACCENT_BLUE)
]

for i, (title, desc, col) in enumerate(advs):
    r = i // 2
    c = i % 2
    x = Inches(0.8 + c * 6.0)
    y = Inches(1.6 + r * 2.7)
    add_card(slide15, x, y, Inches(5.7), Inches(2.4), title, col)
    tb = slide15.shapes.add_textbox(x + Inches(0.2), y + Inches(0.6), Inches(5.3), Inches(1.6))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = desc
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_BODY
    p.line_spacing = 1.3

# ----------------- SLIDE 16: CONCLUSION, FUTURE SCOPE & REFERENCES -----------------
slide16 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide16)
add_header(slide16, "Conclusion, Future Scope & References")

# Card 1: Conclusion & Future Scope
add_card(slide16, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "Conclusion & Future Scope", ACCENT_GREEN)
tb1 = slide16.shapes.add_textbox(Inches(1.0), Inches(2.2), Inches(5.2), Inches(4.4))
tf1 = tb1.text_frame
tf1.word_wrap = True

p = tf1.add_paragraph()
p.text = "Project Conclusion:"
p.font.bold = True
p.font.size = Pt(13)
p.font.color.rgb = TEXT_WHITE
p2 = tf1.add_paragraph()
p2.text = "AlgoLens successfully provides an end-to-end, multi-perspective platform for mastering data structures. By combining high-level animations, low-level RAM mapping, and real operating system file hierarchies, it closes the gap between classroom theory and practical systems engineering."
p2.font.size = Pt(11.5)
p2.font.color.rgb = TEXT_BODY
p2.space_after = Pt(10)

p3 = tf1.add_paragraph()
p3.text = "Future Scope:"
p3.font.bold = True
p3.font.size = Pt(13)
p3.font.color.rgb = TEXT_WHITE
future = [
    "• Multi-Language Code View: Side-by-side C++, Java, and Python code.",
    "• 3D Graph Visualization: Force-directed graphs for complex networks.",
    "• Teacher Classroom Mode: Synchronous real-time stepping for lectures."
]
for f in future:
    pf = tf1.add_paragraph()
    pf.text = f
    pf.font.size = Pt(11.5)
    pf.font.color.rgb = TEXT_BODY

# Card 2: References
add_card(slide16, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2), "References & Syllabus Alignment", ACCENT_PURPLE)
tb2 = slide16.shapes.add_textbox(Inches(7.1), Inches(2.2), Inches(5.2), Inches(4.4))
tf2 = tb2.text_frame
tf2.word_wrap = True

refs = [
    ("1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. ", "Introduction to Algorithms (4th ed.), MIT Press, 2022."),
    ("2. Horowitz, E., Sahni, S., & Anderson-Freed, S. ", "Fundamentals of Data Structures in C, Silicon Press."),
    ("3. Silberschatz, A., Galvin, P. B., & Gagne, G. ", "Operating System Concepts (10th ed.), File System Implementation."),
    ("4. MDN Web Docs. ", "JavaScript Iterators and Generators; CSS 3D Hardware Accelerated Transforms."),
    ("5. Course Syllabus. ", "Vishwakarma Institute of Technology (VIT), Pune. Department of Computer Engineering: Data Structures Course.")
]
for t, d in refs:
    p = tf2.add_paragraph()
    p.text = t
    p.font.bold = True
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_WHITE
    p2 = tf2.add_paragraph()
    p2.text = d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(8)

output_pptx = r"C:\Users\Jinay Saraf\.gemini\antigravity\scratch\algolens\AlgoLens_Data_Structures_CP_Presentation.pptx"
prs.save(output_pptx)
print(f"Successfully generated {output_pptx} with {len(prs.slides)} slides!")
