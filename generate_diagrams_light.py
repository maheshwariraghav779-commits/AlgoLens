import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs("presentation_assets_light", exist_ok=True)

# Helper function to save light theme figures cleanly
def save_fig(fig, filename):
    plt.tight_layout()
    plt.savefig(f"presentation_assets_light/{filename}", dpi=300, bbox_inches='tight', facecolor='#ffffff')
    plt.close()
    print(f"Saved {filename}")

# 1. 5-Stage System Architecture Pipeline (Light Theme)
def make_architecture_flowchart_light():
    fig, ax = plt.subplots(figsize=(10, 4.2), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.axis('off')

    stages = [
        ("1. Input Data", "Arrays, Matrices,\nTrees, Expressions", "#2563eb", "#eff6ff"),
        ("2. Generator Engine", "ES6 function*\nPre-computes Steps", "#7c3aed", "#f5f3ff"),
        ("3. Controller", "Play, Pause,\nStep Forward/Back", "#db2777", "#fdf2f8"),
        ("4. Dual Stages", "Visual CSS Stage\n+ 64-Bit RAM State", "#059669", "#ecfdf5"),
        ("5. Assessment", "Blind Mode Quiz\n+ AI Tutor 'Lens'", "#d97706", "#fffbeb")
    ]

    for i, (title, desc, stroke, bg) in enumerate(stages):
        x = 0.4 + i * 1.95
        y = 1.0
        rect = patches.FancyBboxPatch((x, y), 1.65, 2.3, boxstyle="round,pad=0.12",
                                     edgecolor=stroke, facecolor=bg, linewidth=2.0)
        ax.add_patch(rect)
        
        ax.text(x + 0.825, y + 1.8, title, ha='center', va='center', color=stroke,
                fontsize=11, fontweight='bold', family='sans-serif')
        ax.text(x + 0.825, y + 0.95, desc, ha='center', va='center', color='#334155',
                fontsize=9.5, family='sans-serif', linespacing=1.3)
        
        if i < len(stages) - 1:
            ax.annotate('', xy=(x + 1.9, y + 1.15), xytext=(x + 1.7, y + 1.15),
                        arrowprops=dict(arrowstyle="->,head_width=0.4,head_length=0.4",
                                        color='#64748b', lw=2.5))

    ax.set_xlim(0, 10.2)
    ax.set_ylim(0, 4.2)
    save_fig(fig, "architecture_flowchart_light.png")

# 2. Operations Block Diagram (Light Theme)
def make_operations_block_diagram_light():
    fig, ax = plt.subplots(figsize=(10, 4.8), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.axis('off')

    # Top Central Box
    rect_top = patches.FancyBboxPatch((3.0, 3.4), 4.2, 0.95, boxstyle="round,pad=0.12",
                                     edgecolor='#4f46e5', facecolor='#eef2ff', linewidth=2)
    ax.add_patch(rect_top)
    ax.text(5.1, 3.88, "ALGOLENS INTERACTIVE PLATFORM", ha='center', va='center', color='#312e81',
            fontsize=12, fontweight='bold')

    branches = [
        ("Workbench (Mod 1-6)", "9 Sorts, Searches, Lists,\nStacks, BST, Graphs, Hash", 0.5, 1.7, '#2563eb', '#eff6ff'),
        ("Module 7: UNIX Tree", "Hierarchical File System\nSVG View + Sync Sidebar", 2.9, 1.7, '#059669', '#ecfdf5'),
        ("64-Bit Memory RAM", "Virtual Call Stack Frames\n+ Dynamic Heap Chunks", 5.3, 1.7, '#d97706', '#fffbeb'),
        ("Blind Prediction Mode", "Interactive Step Quizzes\nLive Streak & Score", 7.7, 1.7, '#db2777', '#fdf2f8')
    ]

    for title, desc, x, y, stroke, bg in branches:
        rect = patches.FancyBboxPatch((x, y), 2.0, 1.25, boxstyle="round,pad=0.1",
                                     edgecolor=stroke, facecolor=bg, linewidth=1.8)
        ax.add_patch(rect)
        ax.text(x + 1.0, y + 0.9, title, ha='center', va='center', color=stroke,
                fontsize=9.5, fontweight='bold')
        ax.text(x + 1.0, y + 0.42, desc, ha='center', va='center', color='#334155',
                fontsize=8.5, linespacing=1.2)
        
        ax.annotate('', xy=(x + 1.0, y + 1.3), xytext=(5.1, 3.35),
                    arrowprops=dict(arrowstyle="->", color='#94a3b8', lw=1.6, connectionstyle="angle,angleA=0,angleB=90,rad=6"))

    # Shared Core Bottom Box
    rect_bot = patches.FancyBboxPatch((1.5, 0.2), 7.2, 0.85, boxstyle="round,pad=0.1",
                                     edgecolor='#7c3aed', facecolor='#f5f3ff', linewidth=2)
    ax.add_patch(rect_bot)
    ax.text(5.1, 0.62, "SHARED DETERMINISTIC GENERATOR ENGINE + 4-LINE EXPLANATIONS", ha='center', va='center',
            color='#5b21b6', fontsize=10.5, fontweight='bold')

    for _, _, x, y, _, _ in branches:
        ax.annotate('', xy=(5.1, 1.1), xytext=(x + 1.0, y - 0.05),
                    arrowprops=dict(arrowstyle="->", color='#94a3b8', lw=1.4, connectionstyle="angle,angleA=-90,angleB=0,rad=6"))

    ax.set_xlim(0, 10.2)
    ax.set_ylim(0, 4.8)
    save_fig(fig, "operations_block_diagram_light.png")

# 3. Algorithm Stepper Flowchart (How the Generator Engine Works)
def make_stepper_flowchart_light():
    fig, ax = plt.subplots(figsize=(10, 3.8), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.axis('off')

    steps = [
        ("Input Array", "Ingest values\nAssign stable IDs", "#2563eb", "#eff6ff"),
        ("Generator Loop", "Iterate through pairs\nCheck condition", "#7c3aed", "#f5f3ff"),
        ("Yield Step Object", "{ order, kind,\nhighlighted, line }", "#db2777", "#fdf2f8"),
        ("Update Counters", "Increment comparisons\nand swaps count", "#d97706", "#fffbeb"),
        ("Done State", "Mark elements sorted\nUnlock playback scrub", "#059669", "#ecfdf5")
    ]

    for i, (title, desc, stroke, bg) in enumerate(steps):
        x = 0.4 + i * 1.95
        y = 0.8
        rect = patches.FancyBboxPatch((x, y), 1.65, 2.2, boxstyle="round,pad=0.12",
                                     edgecolor=stroke, facecolor=bg, linewidth=2.0)
        ax.add_patch(rect)
        
        ax.text(x + 0.825, y + 1.7, title, ha='center', va='center', color=stroke,
                fontsize=11, fontweight='bold', family='sans-serif')
        ax.text(x + 0.825, y + 0.85, desc, ha='center', va='center', color='#334155',
                fontsize=9.5, family='sans-serif', linespacing=1.3)
        
        if i < len(steps) - 1:
            ax.annotate('', xy=(x + 1.9, y + 1.1), xytext=(x + 1.7, y + 1.1),
                        arrowprops=dict(arrowstyle="->,head_width=0.4,head_length=0.4",
                                        color='#64748b', lw=2.5))

    ax.set_xlim(0, 10.2)
    ax.set_ylim(0, 3.8)
    save_fig(fig, "stepper_flowchart_light.png")

# 4. Blind Prediction Mode Flowchart
def make_blind_flowchart_light():
    fig, ax = plt.subplots(figsize=(10, 3.8), dpi=300)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.axis('off')

    steps = [
        ("Playback Running", "Step-by-step animation\nat chosen speed", "#2563eb", "#eff6ff"),
        ("Decision Point", "Engine pauses at random\nor critical branch", "#7c3aed", "#f5f3ff"),
        ("Blind Next Step", "Prompt user with 4\nmultiple-choice options", "#db2777", "#fdf2f8"),
        ("User Choice", "User selects predicted\nposition / operation", "#d97706", "#fffbeb"),
        ("Feedback & Score", "Reveal explanation\nUpdate score & streak", "#059669", "#ecfdf5")
    ]

    for i, (title, desc, stroke, bg) in enumerate(steps):
        x = 0.4 + i * 1.95
        y = 0.8
        rect = patches.FancyBboxPatch((x, y), 1.65, 2.2, boxstyle="round,pad=0.12",
                                     edgecolor=stroke, facecolor=bg, linewidth=2.0)
        ax.add_patch(rect)
        
        ax.text(x + 0.825, y + 1.7, title, ha='center', va='center', color=stroke,
                fontsize=11, fontweight='bold', family='sans-serif')
        ax.text(x + 0.825, y + 0.85, desc, ha='center', va='center', color='#334155',
                fontsize=9.5, family='sans-serif', linespacing=1.3)
        
        if i < len(steps) - 1:
            ax.annotate('', xy=(x + 1.9, y + 1.1), xytext=(x + 1.7, y + 1.1),
                        arrowprops=dict(arrowstyle="->,head_width=0.4,head_length=0.4",
                                        color='#64748b', lw=2.5))

    ax.set_xlim(0, 10.2)
    ax.set_ylim(0, 3.8)
    save_fig(fig, "blind_flowchart_light.png")

make_architecture_flowchart_light()
make_operations_block_diagram_light()
make_stepper_flowchart_light()
make_blind_flowchart_light()
