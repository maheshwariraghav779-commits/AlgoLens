import shutil
import os

os.makedirs("presentation_assets", exist_ok=True)

sources = {
    "landing_page.png": r"C:\Users\Jinay Saraf\.gemini\antigravity\brain\f3e98abd-37a3-4abd-9518-ddc1330fcf2f\browser_sandbox\screenshots\step_4_shot_1.png",
    "bubble_sort_explanation.png": r"C:\Users\Jinay Saraf\.gemini\antigravity\brain\f3e98abd-37a3-4abd-9518-ddc1330fcf2f\browser_sandbox\screenshots\step_10.png",
    "doubly_linked_list.png": r"C:\Users\Jinay Saraf\.gemini\antigravity\brain\f3e98abd-37a3-4abd-9518-ddc1330fcf2f\browser_sandbox\screenshots\step_12_shot_1.png",
    "deque_operations.png": r"C:\Users\Jinay Saraf\.gemini\antigravity\brain\f3e98abd-37a3-4abd-9518-ddc1330fcf2f\browser_sandbox\screenshots\step_20_shot_1.png",
    "unix_filesystem_tree.png": r"C:\Users\Jinay Saraf\.gemini\antigravity\brain\4cc6dc8f-be37-4a80-b4e1-5fe7789d6acd\browser_evidence\9d8a8d8e-16c3-4b3e-a246-8d9490f7cd3e\final_step_34.png",
    "memory_visualizer.png": r"C:\Users\Jinay Saraf\.gemini\antigravity\brain\4cc6dc8f-be37-4a80-b4e1-5fe7789d6acd\browser_evidence\e603090c-d259-44ba-af6a-8a09db465bc4\final_step_32.png"
}

for name, src in sources.items():
    if os.path.exists(src):
        dst = os.path.join("presentation_assets", name)
        shutil.copy2(src, dst)
        print(f"Copied {name} ({os.path.getsize(dst)} bytes)")
    else:
        print(f"Missing {src}")
