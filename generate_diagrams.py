import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs("presentation_assets", exist_ok=True)

# 1. System Architecture Flowchart
def make_architecture_flowchart():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_facecolor('#0f172a')
    fig.patch.set_facecolor('#0f172a')
    ax.axis('off')

    stages = [
        ("01. Input Ingestion", "Arrays, Matrices, Trees, Expressions\nCustom or Random Data", "#3b82f6"),
        ("02. Generator Engine", "ES6 function* pre-computes\natomic immutable steps", "#8b5cf6"),
        ("03. Playback Controller", "Bidirectional Scrubbing\n(Play, Pause, Step ◀ ▶)", "#ec4899"),
        ("04. Dual Visual Stages", "High-Level: CSS/SVG\nLow-Level: 64-bit RAM", "#10b981"),
        ("05. Active Assessment", "Blind Mode Quizzes\nAI Tutor 'Lens'", "#f59e0b")
    ]

    for i, (title, desc, color) in enumerate(stages):
        x = 0.5 + i * 1.9
        y = 1.2
        # Draw box
        rect = patches.FancyBboxPatch((x, y), 1.6, 2.6, boxstyle="round,pad=0.15",
                                     edgecolor=color, facecolor='#1e293b', linewidth=2.5)
        ax.add_patch(rect)
        
        # Title
        ax.text(x + 0.8, y + 2.1, title, ha='center', va='center', color=color,
                fontsize=11, fontweight='bold', family='sans-serif')
        # Desc
        ax.text(x + 0.8, y + 1.1, desc, ha='center', va='center', color='#e2e8f0',
                fontsize=8.5, family='sans-serif', linespacing=1.3)
        
        # Arrow
        if i < len(stages) - 1:
            ax.annotate('', xy=(x + 1.85, y + 1.3), xytext=(x + 1.65, y + 1.3),
                        arrowprops=dict(arrowstyle="->,head_width=0.4,head_length=0.4",
                                        color='#94a3b8', lw=2.5))

    ax.set_xlim(0, 10)
    ax.set_ylim(0, 5)
    plt.tight_layout()
    plt.savefig("presentation_assets/system_architecture_flowchart.png", bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()
    print("Saved architecture flowchart")

# 2. Block Diagram of Operations
def make_operations_block_diagram():
    fig, ax = plt.subplots(figsize=(10, 5), dpi=300)
    ax.set_facecolor('#0f172a')
    fig.patch.set_facecolor('#0f172a')
    ax.axis('off')

    # Top Central Box
    rect_top = patches.FancyBboxPatch((3.0, 3.6), 4.0, 1.0, boxstyle="round,pad=0.15",
                                     edgecolor='#6366f1', facecolor='#1e1b4b', linewidth=2)
    ax.add_patch(rect_top)
    ax.text(5.0, 4.1, "ALGOLENS INTERACTIVE PLATFORM", ha='center', va='center', color='#ffffff',
            fontsize=12, fontweight='bold')

    # 4 Branch Boxes
    branches = [
        ("Module 1-6 Workbench", "9 Sorts, Searches, Lists\nStacks, Queues, Trees, Graphs", 0.5, 1.8, '#3b82f6'),
        ("Module 7: UNIX Explorer", "General Tree in OS\nSVG Diagram + Sync Sidebar", 2.9, 1.8, '#10b981'),
        ("64-Bit Memory RAM", "Call Stack (Frames)\nHeap (Dynamic Malloc)", 5.3, 1.8, '#f59e0b'),
        ("Blind Prediction Mode", "Active Recall Quizzes\nStreak & Score Counters", 7.7, 1.8, '#ec4899')
    ]

    for title, desc, x, y, color in branches:
        rect = patches.FancyBboxPatch((x, y), 2.0, 1.3, boxstyle="round,pad=0.1",
                                     edgecolor=color, facecolor='#1e293b', linewidth=1.8)
        ax.add_patch(rect)
        ax.text(x + 1.0, y + 0.95, title, ha='center', va='center', color=color,
                fontsize=9.5, fontweight='bold')
        ax.text(x + 1.0, y + 0.45, desc, ha='center', va='center', color='#cbd5e1',
                fontsize=8, linespacing=1.2)
        
        # Connect top to branch
        ax.annotate('', xy=(x + 1.0, y + 1.35), xytext=(5.0, 3.55),
                    arrowprops=dict(arrowstyle="->", color='#64748b', lw=1.5, connectionstyle="angle,angleA=0,angleB=90,rad=5"))

    # Shared Core Bottom Box
    rect_bot = patches.FancyBboxPatch((1.5, 0.2), 7.0, 0.9, boxstyle="round,pad=0.1",
                                     edgecolor='#8b5cf6', facecolor='#2e1065', linewidth=2)
    ax.add_patch(rect_bot)
    ax.text(5.0, 0.65, "SHARED GENERATOR ENGINE + 4-LINE STRUCTURED EXPLANATIONS", ha='center', va='center',
            color='#e9d5ff', fontsize=10, fontweight='bold')

    for _, _, x, y, _ in branches:
        ax.annotate('', xy=(5.0, 1.15), xytext=(x + 1.0, y - 0.05),
                    arrowprops=dict(arrowstyle="->", color='#64748b', lw=1.2, connectionstyle="angle,angleA=-90,angleB=0,rad=5"))

    ax.set_xlim(0, 10.2)
    ax.set_ylim(0, 5)
    plt.tight_layout()
    plt.savefig("presentation_assets/operations_block_diagram.png", bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()
    print("Saved operations block diagram")

make_architecture_flowchart()
make_operations_block_diagram()
