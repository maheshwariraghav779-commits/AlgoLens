import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { ExplanationCard } from './components/ExplanationCard';
import { PseudocodeCard } from './components/PseudocodeCard';
import { DSAModule } from './modules/dsa/DSAModule';
import { FileSystemModule } from './modules/filesystem/FileSystemModule';
import { LensTutor } from './tutor/LensTutor';
import { usePlayback } from './engine/usePlayback';
import { Step } from './engine/types';
import { DSA_ALGORITHMS, ArrayItem } from './modules/dsa/generators/sortGenerators';
import { FSNode, FSTraversalType } from './modules/filesystem/types';
import { createInitialFSTree, cloneTree } from './modules/filesystem/initialTree';
import { FS_OPERATIONS, generateFileActionStep } from './modules/filesystem/generators/treeGenerators';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('algolens_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('algolens_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Active Module
  const [activeModule, setActiveModule] = useState<'dsa' | 'filesystem'>('dsa');

  // ---------------- MODULE A: DSA STATE ----------------
  const [dsaAlgo, setDsaAlgo] = useState<keyof typeof DSA_ALGORITHMS>('bubble');
  const [baseArray, setBaseArray] = useState<number[]>([34, 12, 27, 8, 41, 19, 5, 30, 16]);

  // Generate stable array items
  const dsaItems: ArrayItem[] = useMemo(() => {
    return baseArray.map((v, i) => ({ id: `bar_${i}_${v}`, v }));
  }, [baseArray]);

  // Pre-compute DSA Steps
  const dsaSteps: Step[] = useMemo(() => {
    const algo = DSA_ALGORITHMS[dsaAlgo];
    const A = dsaItems.map(x => ({ ...x }));
    const firstOrder = A.map(x => x.id);
    const doneSet = new Set<string>();

    let comparisons = 0;
    let swaps = 0;

    const S = (
      text: string,
      line: number,
      highlightedIndices: number[],
      kind: any,
      meta?: any
    ): Step => {
      if (kind === 'compare') comparisons++;
      if (kind === 'swap') swaps++;
      return {
        order: A.map(x => x.id),
        highlighted: highlightedIndices.map(i => A[i]?.id).filter(Boolean),
        kind,
        done: Array.from(doneSet),
        text,
        line,
        comparisons,
        swaps,
        meta
      };
    };

    const result: Step[] = [
      {
        order: firstOrder,
        highlighted: [],
        kind: 'none',
        done: [],
        text: `Start: ${baseArray.join(', ')}. Press Play or step through with ▶|.`,
        line: -1,
        comparisons: 0,
        swaps: 0
      }
    ];

    const gen = algo.generate(A, S, doneSet);
    for (const step of gen) {
      result.push(step);
    }

    A.forEach(x => doneSet.add(x.id));
    result.push({
      order: A.map(x => x.id),
      highlighted: [],
      kind: 'none',
      done: Array.from(doneSet),
      text: `Finished! Values sorted in order: ${A.map(x => x.v).join(' ≤ ')}.`,
      line: -1,
      comparisons,
      swaps
    });

    return result;
  }, [dsaAlgo, dsaItems, baseArray]);

  // ---------------- MODULE B: FILE SYSTEM STATE ----------------
  const [fsTree, setFsTree] = useState<FSNode>(() => createInitialFSTree());
  const [fsOp, setFsOp] = useState<FSTraversalType>('dfs-pre');
  const [customAction, setCustomAction] = useState<{
    action: 'create-file' | 'create-folder' | 'rename' | 'delete' | 'move';
    params: any;
  } | null>(null);

  // Pre-compute File System Steps
  const fsSteps: Step[] = useMemo(() => {
    const treeCopy = cloneTree(fsTree);
    const doneSet = new Set<string>();

    const S = (
      text: string,
      line: number,
      highlightedIds: string[],
      kind: any,
      meta?: any
    ): Step => ({
      order: [],
      highlighted: highlightedIds,
      kind,
      done: Array.from(doneSet),
      text,
      line,
      meta
    });

    const result: Step[] = [];

    if (customAction) {
      const gen = generateFileActionStep(
        customAction.action,
        treeCopy,
        customAction.params,
        S,
        doneSet
      );
      for (const step of gen) {
        result.push(step);
      }
    } else {
      const opObj = (FS_OPERATIONS as any)[fsOp];
      if (opObj) {
        const gen = opObj.generate(treeCopy, S, doneSet);
        for (const step of gen) {
          result.push(step);
        }
      }
    }

    return result.length > 0
      ? result
      : [
          {
            order: [],
            highlighted: [],
            kind: 'none',
            done: [],
            text: 'Ready to explore the file system tree. Choose a traversal or file operation above.',
            line: -1,
            meta: { tree: treeCopy }
          }
        ];
  }, [fsTree, fsOp, customAction]);

  // Active steps based on selected module
  const currentSteps = activeModule === 'dsa' ? dsaSteps : fsSteps;
  const playback = usePlayback(currentSteps);

  // Reset playback index when switching modules or algorithms
  useEffect(() => {
    playback.pause();
    playback.setStepIndex(0);
  }, [activeModule, dsaAlgo, fsOp, customAction]);

  // Shuffle DSA Array
  const handleShuffleArray = () => {
    playback.pause();
    const count = 9;
    const newArr = Array.from({ length: count }, () => Math.ceil(Math.random() * 45) + 3);
    setBaseArray(newArr);
  };

  const handleSetCustomArray = (newArr: number[]) => {
    playback.pause();
    setBaseArray(newArr);
  };

  // Perform File System Action
  const handlePerformFSAction = (
    action: 'create-file' | 'create-folder' | 'rename' | 'delete' | 'move',
    params: any
  ) => {
    playback.pause();
    setCustomAction({ action, params });
  };

  const handleSelectFSOp = (op: FSTraversalType) => {
    playback.pause();
    setCustomAction(null);
    setFsOp(op);
  };

  const handleResetFSTree = () => {
    playback.pause();
    setCustomAction(null);
    setFsTree(createInitialFSTree());
  };

  // Pseudocode lines & Metadata for currently active operation
  const currentPseudocode = useMemo(() => {
    if (activeModule === 'dsa') {
      return DSA_ALGORITHMS[dsaAlgo].pseudocode;
    } else {
      if (customAction) {
        return [
          '// File System Mutation',
          'traverse(root, targetParent)',
          'validatePermissionsAndUniqueness()',
          'mutateTreePointers()',
          'recomputeFolderSizesAndLayout()'
        ];
      }
      return (FS_OPERATIONS as any)[fsOp]?.pseudocode || [];
    }
  }, [activeModule, dsaAlgo, fsOp, customAction]);

  const activeOpName = activeModule === 'dsa'
    ? DSA_ALGORITHMS[dsaAlgo].name
    : customAction
      ? `FS: ${customAction.action}`
      : (FS_OPERATIONS as any)[fsOp]?.name || 'Tree Traversal';

  const activeComplexity = activeModule === 'dsa'
    ? DSA_ALGORITHMS[dsaAlgo].timeComplexity
    : (FS_OPERATIONS as any)[fsOp]?.timeComplexity || 'Time O(N)';

  // Current State Summary for AI Tutor context
  const currentStateDescription = useMemo(() => {
    if (activeModule === 'dsa') {
      const order = playback.currentStep?.order || dsaItems.map(x => x.id);
      const vals = order.map(id => dsaItems.find(it => it.id === id)?.v);
      return `Array values in current order: [${vals.join(', ')}]`;
    } else {
      return `UNIX Directory Tree with root '/', inspecting node: ${playback.currentStep?.highlighted?.join(', ') || 'root'}`;
    }
  }, [activeModule, playback.currentStep, dsaItems]);

  return (
    <div>
      <Header
        activeModule={activeModule}
        onSelectModule={mod => {
          playback.pause();
          setActiveModule(mod);
        }}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        {/* Left Column: Visualizer Stage + Controls + Cards */}
        <div>
          {activeModule === 'dsa' ? (
            <DSAModule
              currentAlgo={dsaAlgo}
              onSelectAlgo={algo => {
                playback.pause();
                setDsaAlgo(algo);
              }}
              baseArray={baseArray}
              items={dsaItems}
              currentStep={playback.currentStep}
              stepIndex={playback.stepIndex}
              totalSteps={playback.totalSteps}
            />
          ) : (
            <FileSystemModule
              tree={playback.currentStep?.meta?.tree || fsTree}
              currentStep={playback.currentStep}
              activeOp={fsOp}
              onSelectOp={handleSelectFSOp}
              onPerformAction={handlePerformFSAction}
              onResetTree={handleResetFSTree}
            />
          )}

          {/* Shared Universal Controls */}
          <div className="card" style={{ marginTop: '16px' }}>
            <Controls
              isPlaying={playback.isPlaying}
              onTogglePlay={playback.togglePlay}
              onStepPrev={playback.stepPrev}
              onStepNext={playback.stepNext}
              stepIndex={playback.stepIndex}
              totalSteps={playback.totalSteps}
              onScrub={playback.jumpTo}
              speed={playback.speed}
              onSpeedChange={playback.setSpeed}
              showArrayControls={activeModule === 'dsa'}
              onSetCustomArray={handleSetCustomArray}
              onShuffleArray={handleShuffleArray}
            />
          </div>

          {/* Two Sub-Cards: What's Happening & Pseudocode */}
          <div className="grid2">
            <ExplanationCard text={playback.currentStep?.text || ''} />
            <PseudocodeCard
              code={currentPseudocode}
              activeLine={playback.currentStep?.line ?? -1}
            />
          </div>
        </div>

        {/* Right Column: AI Tutor "Lens" */}
        <LensTutor
          moduleName={activeModule === 'dsa' ? 'Module A: DSA Analyser' : 'Module B: File System Tree Explorer'}
          algoOrOpName={activeOpName}
          timeComplexity={activeComplexity}
          pseudocode={currentPseudocode}
          currentStepIndex={playback.stepIndex}
          totalSteps={playback.totalSteps}
          currentStep={playback.currentStep}
          currentStateDescription={currentStateDescription}
          onQuestionAsked={playback.pause}
        />
      </main>
    </div>
  );
};

export default App;
