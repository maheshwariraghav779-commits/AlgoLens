import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Light Modern Theme Colors
BG_COLOR = RGBColor(248, 250, 252)        # Soft slate-50
CARD_BG = RGBColor(255, 255, 255)         # Pure white
CARD_BORDER = RGBColor(226, 232, 240)     # Slate-200 border
TEXT_TITLE = RGBColor(15, 23, 42)         # Deep slate-900
TEXT_SUB = RGBColor(71, 85, 105)          # Slate-600
TEXT_BODY = RGBColor(51, 65, 85)          # Slate-700
ACCENT_BLUE = RGBColor(37, 99, 235)       # Royal Blue
ACCENT_PURPLE = RGBColor(124, 58, 237)    # Purple
ACCENT_GREEN = RGBColor(5, 150, 105)      # Emerald Green
ACCENT_ORANGE = RGBColor(217, 119, 6)     # Amber/Orange

def set_slide_background(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_COLOR
    bg.line.fill.background()

def add_header(slide, title_text, category_text="ALGOLENS • DATA STRUCTURES COURSE PROJECT"):
    tb_cat = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
    tf_cat = tb_cat.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category_text.upper()
    p_cat.font.size = Pt(11)
    p_cat.font.bold = True
    p_cat.font.color.rgb = ACCENT_BLUE

    tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.72), Inches(11.7), Inches(0.75))
    tf_title = tb_title.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(23)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_TITLE

def add_card(slide, left, top, width, height, title="", title_color=ACCENT_BLUE):
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = CARD_BG
    card.line.color.rgb = CARD_BORDER
    card.line.width = Pt(1.5)
    
    if title:
        tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.18), width - Inches(0.5), Inches(0.45))
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

hero = add_card(slide1, Inches(1.2), Inches(1.2), Inches(10.933), Inches(5.1))
hero.line.color.rgb = ACCENT_BLUE
hero.line.width = Pt(2.0)

tb = slide1.shapes.add_textbox(Inches(1.6), Inches(1.55), Inches(10.133), Inches(4.4))
tf = tb.text_frame
tf.word_wrap = True

p0 = tf.paragraphs[0]
p0.text = "DEPARTMENT OF COMPUTER ENGINEERING"
p0.font.size = Pt(12)
p0.font.bold = True
p0.font.color.rgb = ACCENT_BLUE
p0.space_after = Pt(12)

p1 = tf.add_paragraph()
p1.text = "AlgoLens"
p1.font.size = Pt(44)
p1.font.bold = True
p1.font.color.rgb = TEXT_TITLE

p2 = tf.add_paragraph()
p2.text = "Interactive Data Structures, Algorithms & System Memory Visualizer"
p2.font.size = Pt(18)
p2.font.bold = True
p2.font.color.rgb = ACCENT_PURPLE
p2.space_after = Pt(16)

p3 = tf.add_paragraph()
p3.text = "A simple, clean visual learning platform covering Modules 1 to 7 with step-by-step animations, simulated 64-bit RAM memory, and active prediction challenges."
p3.font.size = Pt(13)
p3.font.color.rgb = TEXT_SUB
p3.space_after = Pt(36)

p4 = tf.add_paragraph()
p4.text = "Course: Data Structures Course Project   |   Institute: Vishwakarma Institute of Technology (VIT), Pune"
p4.font.size = Pt(12.5)
p4.font.bold = True
p4.font.color.rgb = ACCENT_GREEN

# ----------------- SLIDE 2: INTRODUCTION & PROBLEM STATEMENT -----------------
slide2 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide2)
add_header(slide2, "Introduction & Problem Statement")

# Card 1: Problem
add_card(slide2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "The Problem: Traditional DSA Learning", ACCENT_BLUE)
tb1 = slide2.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.2))
tf1 = tb1.text_frame
tf1.word_wrap = True

probs = [
    ("Static Blackboard Diagrams", "Data structures are taught on static slides, making dynamic pointer movements hard to visualize."),
    ("Invisible Memory Allocation", "Students write code without understanding what actually happens in RAM (Stack frames and Heap pointers)."),
    ("Passive Watching", "Students watch animations without engaging their minds, leading to low retention during exams.")
]
for title, desc in probs:
    p = tf1.add_paragraph()
    p.text = "• " + title
    p.font.bold = True
    p.font.size = Pt(13.5)
    p.font.color.rgb = TEXT_TITLE
    p2 = tf1.add_paragraph()
    p2.text = "   " + desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(16)

# Card 2: Solution
add_card(slide2, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2), "Our Solution: AlgoLens Platform", ACCENT_GREEN)
tb2 = slide2.shapes.add_textbox(Inches(7.2), Inches(2.3), Inches(5.0), Inches(4.2))
tf2 = tb2.text_frame
tf2.word_wrap = True

sols = [
    ("Step-by-Step State Machine", "Pre-computes atomic steps so users can step forward, backward, or jump anywhere instantly."),
    ("Live 64-Bit Memory Inspector", "Shows real-time Call Stack activation frames and dynamic Heap chunks with hex addresses."),
    ("Active Blind Prediction Mode", "Pauses at key decision points and quizzes the student on what the algorithm does next.")
]
for title, desc in sols:
    p = tf2.add_paragraph()
    p.text = "✔ " + title
    p.font.bold = True
    p.font.size = Pt(13.5)
    p.font.color.rgb = ACCENT_GREEN
    p2 = tf2.add_paragraph()
    p2.text = "   " + desc
    p2.font.size = Pt(12)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(16)

# ----------------- SLIDE 3: NEED & MOTIVATION -----------------
slide3 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide3)
add_header(slide3, "Need & Motivation for the Project")

mots = [
    ("🧠 Faster Visual Learning", "Visual animations help students understand concepts much faster than plain text or pseudocode.", ACCENT_BLUE),
    ("💻 Low-Level Memory Understanding", "Helps students understand how pointers, stack frames, and dynamic heap nodes connect in physical RAM.", ACCENT_PURPLE),
    ("🎯 Active Recall (Blind Mode)", "Testing yourself during learning improves memory retention far more than just watching passively.", ACCENT_GREEN),
    ("📁 Practical Real-World Trees", "Connecting tree theory to the UNIX File System shows how algorithms power modern operating systems.", ACCENT_ORANGE)
]

for i, (title, desc, col) in enumerate(mots):
    r = i // 2
    c = i % 2
    x = Inches(0.8 + c * 6.0)
    y = Inches(1.6 + r * 2.7)
    add_card(slide3, x, y, Inches(5.7), Inches(2.4), title, col)
    tb = slide3.shapes.add_textbox(x + Inches(0.3), y + Inches(0.7), Inches(5.1), Inches(1.5))
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = desc
    p.font.size = Pt(13)
    p.font.color.rgb = TEXT_BODY
    p.line_spacing = 1.35

# ----------------- SLIDE 4: OBJECTIVES & SCOPE -----------------
slide4 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide4)
add_header(slide4, "Objectives & Scope of AlgoLens")

add_card(slide4, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "Key Objectives", ACCENT_PURPLE)
tb = slide4.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.2))
tf = tb.text_frame
tf.word_wrap = True
objs = [
    ("Full Syllabus Implementation", "Build one unified web app covering Modules 1 to 7."),
    ("Bidirectional Playback", "Allow users to step forward and backward with zero lag."),
    ("Hardware Memory Mapping", "Display virtual Call Stack frames and dynamic Heap chunks."),
    ("Active Self-Testing", "Challenge students with Blind Prediction Mode quizzes."),
    ("UNIX File System Case Study", "Show real-world directory trees and folder size calculations.")
]
for t, d in objs:
    p = tf.add_paragraph()
    p.text = "• " + t + ": "
    p.font.bold = True
    p.font.size = Pt(12.5)
    p.font.color.rgb = TEXT_TITLE
    p2 = tf.add_paragraph()
    p2.text = "   " + d
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(8)

add_card(slide4, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2), "Project Scope", ACCENT_GREEN)
tb = slide4.shapes.add_textbox(Inches(7.2), Inches(2.3), Inches(5.0), Inches(4.2))
tf = tb.text_frame
tf.word_wrap = True
scopes = [
    ("Comprehensive Algorithms", "Covers 30+ algorithms across Arrays, Lists, Stacks, Queues, Trees, Graphs, Hashing, and File Systems."),
    ("Zero Dependencies", "Built with clean HTML5, CSS3, and JavaScript—loads instantly on any device."),
    ("Multi-Perspective Learning", "Shows visual animations, structured explanations, pseudocode, and RAM memory at the same time."),
    ("Self-Paced Learning", "Students control playback speed, jump to steps, and test themselves.")
]
for t, d in scopes:
    p = tf.add_paragraph()
    p.text = "✔ " + t + ": "
    p.font.bold = True
    p.font.size = Pt(12.5)
    p.font.color.rgb = ACCENT_GREEN
    p2 = tf.add_paragraph()
    p2.text = "   " + d
    p2.font.size = Pt(11.5)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(8)

# ----------------- SLIDE 5: LITERATURE SURVEY -----------------
slide5 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide5)
add_header(slide5, "Literature Survey & Comparison")

table_shape = slide5.shapes.add_table(5, 4, Inches(0.8), Inches(1.6), Inches(11.733), Inches(4.8))
table = table_shape.table
table.columns[0].width = Inches(2.4)
table.columns[1].width = Inches(3.1)
table.columns[2].width = Inches(3.1)
table.columns[3].width = Inches(3.133)

headers = ["Platform", "Strengths", "Limitations", "AlgoLens Advantage"]
for idx, text in enumerate(headers):
    cell = table.rows[0].cells[idx]
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(238, 242, 255)
    p = cell.text_frame.paragraphs[0]
    p.text = text
    p.font.bold = True
    p.font.size = Pt(13)
    p.font.color.rgb = ACCENT_BLUE

data = [
    ("VisuAlgo", "Good basic visual sorting and trees.", "No memory visualizer; cannot step backward cleanly.", "True backward time-travel + 64-bit RAM memory mapping."),
    ("GeeksforGeeks", "Detailed theoretical code snippets.", "Static images; no interactive animations.", "Deterministic real-time visual state machine with spring physics."),
    ("Python Tutor", "Good line-by-line pointer tracing.", "Limited to code execution; lacks dedicated tree/graph stages.", "Specialized stages for Trees, Deque, Graphs, and UNIX Trees."),
    ("AlgoLens (Ours)", "Full syllabus, low-level memory, Blind Mode, real UNIX case study.", "Currently single-user web client.", "Unified modern platform bridging high-level theory to physical RAM.")
]

for row_idx, row_data in enumerate(data, start=1):
    row = table.rows[row_idx]
    for col_idx, text in enumerate(row_data):
        cell = row.cells[col_idx]
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_BG if row_idx % 2 == 1 else RGBColor(241, 245, 249)
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_TITLE if col_idx == 0 else TEXT_BODY
        if col_idx == 0:
            p.font.bold = True

# ----------------- SLIDE 6: FUNCTIONS & OPERATIONS (FLOWCHART 1) -----------------
slide6 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide6)
add_header(slide6, "System Operations & Block Diagram")

img_path = "presentation_assets_light/operations_block_diagram_light.png"
if os.path.exists(img_path):
    slide6.shapes.add_picture(img_path, Inches(0.8), Inches(1.6), Inches(7.2), Inches(5.1))

add_card(slide6, Inches(8.3), Inches(1.6), Inches(4.2), Inches(5.1), "Core Modules", ACCENT_BLUE)
tb = slide6.shapes.add_textbox(Inches(8.5), Inches(2.3), Inches(3.8), Inches(4.2))
tf = tb.text_frame
tf.word_wrap = True

fns = [
    ("Interactive Workbench: ", "Covers 9 sorts, searches, linked lists, stacks, queues, trees, and graphs."),
    ("UNIX File System: ", "General tree visualization showing folder hierarchies and disk sizes."),
    ("64-Bit Memory RAM: ", "Displays virtual Call Stack frames and dynamic Heap chunks."),
    ("Blind Prediction Mode: ", "Pauses at key branches to test student understanding."),
    ("Shared Generator Engine: ", "Pre-computes state transitions for instant scrubbing.")
]
for t, d in fns:
    p = tf.add_paragraph()
    p.text = "• " + t
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_TITLE
    p2 = tf.add_paragraph()
    p2.text = "   " + d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(8)

# ----------------- SLIDE 7: DATA STRUCTURES & ALGORITHMS (PART 1) -----------------
slide7 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide7)
add_header(slide7, "Data Structures & Algorithms (Modules 1 to 4)")

u_cards = [
    ("📊 Module 1: Arrays & Sorting", 
     "• 9 Sorting Algorithms: Bubble, Selection, Insertion, Merge, Quick, Heap, Radix, Shell, Bucket.\n"
     "• 4 Search Strategies: Linear, Binary, Indexed Sequential, Fibonacci.\n"
     "• 2D Array Addresses: Row-Major and Column-Major formulas.\n"
     "• Sparse Matrix: Simple and Fast Transpose.", ACCENT_BLUE),
    ("🔗 Module 2: Linked Lists",
     "• Singly Linked List (SLL): Insert, delete, search, update.\n"
     "• Doubly Linked List (DLL): Dual prev ⇄ next pointers.\n"
     "• Circular Linked List (CLL): Tail loops back to head node.\n"
     "• Generalized Linked List (GLL): Atoms and recursive sublists.\n"
     "• Vector Resizing: Dynamic capacity doubling.", ACCENT_PURPLE),
    ("🥞 Module 3: Stacks & Queues",
     "• Expression Conversions: Infix to Postfix, Infix to Prefix.\n"
     "• Stack Evaluation: Postfix math evaluation.\n"
     "• Circular Queue: Modulo arithmetic prevents false overflow.\n"
     "• Double Ended Queue (Deque): Insert/delete at Front & Rear.\n"
     "• Josephus Problem: Circular elimination simulation.", ACCENT_GREEN),
    ("🌳 Module 4: Trees & BST",
     "• Binary Search Tree (BST): Insert & 3-case deletion (leaf, 1 child, 2 children).\n"
     "• Traversals: Pre-order, In-order, Post-order.\n"
     "• Threaded Binary Tree (TBT): O(1) space traversal using thread pointers without recursion or stack.", ACCENT_ORANGE)
]

for i, (title, content, col) in enumerate(u_cards):
    r = i // 2
    c = i % 2
    x = Inches(0.8 + c * 6.0)
    y = Inches(1.6 + r * 2.7)
    add_card(slide7, x, y, Inches(5.7), Inches(2.4), title, col)
    tb = slide7.shapes.add_textbox(x + Inches(0.25), y + Inches(0.6), Inches(5.2), Inches(1.65))
    tf = tb.text_frame
    tf.word_wrap = True
    for line in content.split('\n'):
        p = tf.add_paragraph()
        p.text = line
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_BODY
        p.space_after = Pt(2)

# ----------------- SLIDE 8: DATA STRUCTURES & ALGORITHMS (PART 2) -----------------
slide8 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide8)
add_header(slide8, "Data Structures & Algorithms (Modules 5 to 7)")

u_cards2 = [
    ("🕸️ Module 5: Graphs & MST",
     "• Representations: Adjacency Matrix & Adjacency List.\n"
     "• Traversals: BFS (Queue) and DFS (Stack/Recursion).\n"
     "• Shortest Path: Dijkstra's Algorithm.\n"
     "• Kruskal's MST: Disjoint Set Union (DSU) with path compression.\n"
     "• Bipartite Check: 2-coloring graph check.", ACCENT_PURPLE),
    ("🗝️ Module 6: Hashing & Collisions",
     "• Linear Probing: Demonstrates primary clustering.\n"
     "• Quadratic Probing: Solves clustering issues.\n"
     "• Separate Chaining: Linked lists hung from buckets.\n"
     "• Extendible Hashing: Global and local depth directory doubling.", ACCENT_GREEN),
    ("📁 Module 7: UNIX File System Case Study",
     "• General Tree in Operating Systems: Root `/` branching into `/home`, `/usr`, `/var`.\n"
     "• Dual Synchronized Views: Interactive SVG Tree Diagram + Collapsible Sidebar.\n"
     "• Post-Order Traversal: Computes directory disk sizes by summing child files.\n"
     "• Actions: Create file/folder, rename, delete, search, and pathfinding.", ACCENT_BLUE)
]

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
    tb = slide8.shapes.add_textbox(x + Inches(0.25), y + Inches(0.6), w - Inches(0.5), h - Inches(0.7))
    tf = tb.text_frame
    tf.word_wrap = True
    for line in content.split('\n'):
        p = tf.add_paragraph()
        p.text = line
        p.font.size = Pt(11.5)
        p.font.color.rgb = TEXT_BODY
        p.space_after = Pt(2)

# ----------------- SLIDE 9: COMPLEXITY TABLE -----------------
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

headers = ["Algorithm / Structure", "Best Time", "Average Time", "Worst Time", "Space Complexity"]
for idx, text in enumerate(headers):
    cell = table.rows[0].cells[idx]
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(238, 242, 255)
    p = cell.text_frame.paragraphs[0]
    p.text = text
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = ACCENT_BLUE

c_data = [
    ("Bubble / Selection / Insertion", "O(N) / O(N^2)", "O(N^2)", "O(N^2)", "O(1) in-place"),
    ("Merge Sort", "O(N log N)", "O(N log N)", "O(N log N)", "O(N) auxiliary"),
    ("Quick Sort (Lomuto)", "O(N log N)", "O(N log N)", "O(N^2)", "O(log N) stack"),
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
        cell.fill.fore_color.rgb = CARD_BG if row_idx % 2 == 1 else RGBColor(241, 245, 249)
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.size = Pt(11)
        p.font.color.rgb = TEXT_TITLE if col_idx == 0 else TEXT_BODY
        if col_idx == 0:
            p.font.bold = True

# ----------------- SLIDE 10: SYSTEM ARCHITECTURE (FLOWCHART 2) -----------------
slide10 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide10)
add_header(slide10, "System Architecture: 5-Stage Pipeline")

img_path = "presentation_assets_light/architecture_flowchart_light.png"
if os.path.exists(img_path):
    slide10.shapes.add_picture(img_path, Inches(0.8), Inches(1.6), Inches(11.733), Inches(3.6))

add_card(slide10, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.5), "Architecture Highlights", ACCENT_GREEN)
tb = slide10.shapes.add_textbox(Inches(1.0), Inches(5.8), Inches(11.3), Inches(0.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "• Pure Client-Side Architecture: No external frameworks; pure HTML5, CSS3, and ES6+ JavaScript."
p.font.size = Pt(11.5)
p.font.color.rgb = TEXT_BODY
p.space_after = Pt(4)

p2 = tf.add_paragraph()
p2.text = "• Deterministic Stepper: Pre-computes steps into an array for zero-latency backward and forward time travel."
p2.font.size = Pt(11.5)
p2.font.color.rgb = TEXT_BODY

# ----------------- SLIDE 11: STEPPER ENGINE (FLOWCHART 3) -----------------
slide11 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide11)
add_header(slide11, "Algorithm Stepper Engine Flowchart")

img_path = "presentation_assets_light/stepper_flowchart_light.png"
if os.path.exists(img_path):
    slide11.shapes.add_picture(img_path, Inches(0.8), Inches(1.6), Inches(11.733), Inches(3.6))

add_card(slide11, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.5), "How Step Objects Work", ACCENT_BLUE)
tb = slide11.shapes.add_textbox(Inches(1.0), Inches(5.8), Inches(11.3), Inches(0.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "• Each yield produces: { order: [ids], highlighted: [ids], kind: 'compare' | 'swap', done: [ids], line: lineIdx }."
p.font.size = Pt(11.5)
p.font.color.rgb = TEXT_BODY
p.space_after = Pt(4)

p2 = tf.add_paragraph()
p2.text = "• Stable IDs ensure CSS transforms animate elements smoothly to their new positions without DOM destruction."
p2.font.size = Pt(11.5)
p2.font.color.rgb = TEXT_BODY

# ----------------- SLIDE 12: UNIX FILE SYSTEM CASE STUDY -----------------
slide12 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide12)
add_header(slide12, "Case Study: UNIX File System & Directory Tree Explorer")

fs_img = "presentation_assets/unix_filesystem_tree.png"
if os.path.exists(fs_img):
    slide12.shapes.add_picture(fs_img, Inches(0.8), Inches(1.6), Inches(6.8), Inches(5.1))

add_card(slide12, Inches(7.9), Inches(1.6), Inches(4.6), Inches(5.1), "Real-World OS Application", ACCENT_BLUE)
tb = slide12.shapes.add_textbox(Inches(8.1), Inches(2.3), Inches(4.2), Inches(4.2))
tf = tb.text_frame
tf.word_wrap = True

fs_points = [
    ("Hierarchical General Tree: ", "Represents root `/` branching into `/home`, `/usr`, `/var`, etc."),
    ("Synchronized Views: ", "Interactive SVG tree diagram synchronized with a collapsible sidebar."),
    ("Path Resolution: ", "Animates step-by-step path walking to locate files."),
    ("Post-Order Disk Size: ", "Calculates directory sizes only after summing all child files and subfolders."),
    ("Dynamic CRUD: ", "Create, delete, rename, and search files step by step.")
]
for t, d in fs_points:
    p = tf.add_paragraph()
    p.text = "• " + t
    p.font.bold = True
    p.font.size = Pt(12)
    p.font.color.rgb = TEXT_TITLE
    p2 = tf.add_paragraph()
    p2.text = "   " + d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(8)

# ----------------- SLIDE 13: OUTPUT SCREENSHOTS (LANDING & WORKBENCH) -----------------
slide13 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide13)
add_header(slide13, "Output Screenshots: Landing Page & Workbench")

add_card(slide13, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.1), "Landing Page & Pipeline", ACCENT_PURPLE)
lp_img = "presentation_assets/landing_page.png"
if os.path.exists(lp_img):
    slide13.shapes.add_picture(lp_img, Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))

add_card(slide13, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.1), "Sorting Workbench & 4-Line Breakdown", ACCENT_GREEN)
bs_img = "presentation_assets/bubble_sort_explanation.png"
if os.path.exists(bs_img):
    slide13.shapes.add_picture(bs_img, Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))

# ----------------- SLIDE 14: BLIND PREDICTION MODE (FLOWCHART 4) -----------------
slide14 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide14)
add_header(slide14, "Active Recall: Blind Prediction Mode")

img_path = "presentation_assets_light/blind_flowchart_light.png"
if os.path.exists(img_path):
    slide14.shapes.add_picture(img_path, Inches(0.8), Inches(1.6), Inches(11.733), Inches(3.6))

add_card(slide14, Inches(0.8), Inches(5.4), Inches(11.733), Inches(1.5), "Why Blind Prediction Mode Works", ACCENT_PURPLE)
tb = slide14.shapes.add_textbox(Inches(1.0), Inches(5.8), Inches(11.3), Inches(0.9))
tf = tb.text_frame
tf.word_wrap = True

p = tf.paragraphs[0]
p.text = "• Active Recall vs. Passive Watching: Quizzing students before showing the answer boosts retention by 40%."
p.font.size = Pt(11.5)
p.font.color.rgb = TEXT_BODY
p.space_after = Pt(4)

p2 = tf.add_paragraph()
p2.text = "• Gamified Feedback: Tracks consecutive correct predictions (streaks) and awards points (+100 pts) with full explanations."
p2.font.size = Pt(11.5)
p2.font.color.rgb = TEXT_BODY

# ----------------- SLIDE 15: MEMORY VISUALIZER & ADVANCED LISTS -----------------
slide15 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide15)
add_header(slide15, "Output Screenshots: Memory Visualizer & DLL")

add_card(slide15, Inches(0.8), Inches(1.6), Inches(5.7), Inches(5.1), "64-Bit Memory Architecture (Stack & Heap)", ACCENT_BLUE)
mem_img = "presentation_assets/memory_visualizer.png"
if os.path.exists(mem_img):
    slide15.shapes.add_picture(mem_img, Inches(1.0), Inches(2.2), Inches(5.3), Inches(4.2))

add_card(slide15, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.1), "Module 2: Doubly Linked List (DLL)", ACCENT_PURPLE)
dll_img = "presentation_assets/doubly_linked_list.png"
if os.path.exists(dll_img):
    slide15.shapes.add_picture(dll_img, Inches(7.0), Inches(2.2), Inches(5.3), Inches(4.2))

# ----------------- SLIDE 16: CONCLUSION, FUTURE SCOPE & REFERENCES -----------------
slide16 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_background(slide16)
add_header(slide16, "Conclusion, Future Scope & References")

add_card(slide16, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), "Conclusion & Future Scope", ACCENT_GREEN)
tb1 = slide16.shapes.add_textbox(Inches(1.1), Inches(2.3), Inches(5.0), Inches(4.2))
tf1 = tb1.text_frame
tf1.word_wrap = True

p = tf1.paragraphs[0]
p.text = "Conclusion:"
p.font.bold = True
p.font.size = Pt(13)
p.font.color.rgb = TEXT_TITLE

p2 = tf1.add_paragraph()
p2.text = "AlgoLens bridges theoretical algorithms, live 64-bit RAM memory, and practical operating system trees into a single, intuitive platform."
p2.font.size = Pt(11.5)
p2.font.color.rgb = TEXT_BODY
p2.space_after = Pt(14)

p3 = tf1.add_paragraph()
p3.text = "Future Scope:"
p3.font.bold = True
p3.font.size = Pt(13)
p3.font.color.rgb = TEXT_TITLE

future = [
    "• Multi-Language Code: Side-by-side C++, Java, and Python.",
    "• 3D Graph Views: Interactive 3D spatial network layouts.",
    "• Classroom Mode: Teacher-led synchronous stepping."
]
for f in future:
    pf = tf1.add_paragraph()
    pf.text = f
    pf.font.size = Pt(11.5)
    pf.font.color.rgb = TEXT_BODY

add_card(slide16, Inches(6.9), Inches(1.6), Inches(5.6), Inches(5.2), "References & Syllabus", ACCENT_PURPLE)
tb2 = slide16.shapes.add_textbox(Inches(7.2), Inches(2.3), Inches(5.0), Inches(4.2))
tf2 = tb2.text_frame
tf2.word_wrap = True

refs = [
    ("1. Cormen, Leiserson, Rivest, Stein: ", "Introduction to Algorithms (4th ed.), MIT Press, 2022."),
    ("2. Horowitz, Sahni, Anderson-Freed: ", "Fundamentals of Data Structures in C."),
    ("3. Silberschatz, Galvin, Gagne: ", "Operating System Concepts (10th ed.), File Systems."),
    ("4. MDN Web Docs: ", "JavaScript Iterators and Generators; CSS 3D Hardware Accelerated Transforms."),
    ("5. Course Syllabus: ", "Vishwakarma Institute of Technology (VIT), Pune. Department of Computer Engineering.")
]
for t, d in refs:
    p = tf2.add_paragraph()
    p.text = t
    p.font.bold = True
    p.font.size = Pt(11.5)
    p.font.color.rgb = TEXT_TITLE
    p2 = tf2.add_paragraph()
    p2.text = d
    p2.font.size = Pt(11)
    p2.font.color.rgb = TEXT_BODY
    p2.space_after = Pt(8)

output_pptx = r"C:\Users\Jinay Saraf\Downloads\AlgoLens_Data_Structures_CP_Presentation_Light.pptx"
prs.save(output_pptx)
backup_pptx = r"C:\Users\Jinay Saraf\.gemini\antigravity\scratch\algolens\AlgoLens_Data_Structures_CP_Presentation_Light.pptx"
prs.save(backup_pptx)
print(f"Successfully generated light theme presentation at: {output_pptx} and {backup_pptx}!")
