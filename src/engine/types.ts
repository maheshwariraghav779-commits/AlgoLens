export type StepKind = 'compare' | 'swap' | 'visit' | 'insert' | 'delete' | 'none' | 'cmp';

export interface Step {
  /** Array of item IDs in their current positional order */
  order: string[];
  /** IDs of elements currently active or highlighted in this step */
  highlighted: string[];
  /** Type of action performed in this step */
  kind: StepKind;
  /** IDs of elements that are sorted or completed */
  done: string[];
  /** Plain-English explanation of this step */
  text: string;
  /** Zero-based line number in pseudocode to highlight (-1 for none) */
  line: number;
  /** Cumulative comparisons up to this step */
  comparisons?: number;
  /** Cumulative swaps / moves up to this step */
  swaps?: number;
  /** Optional metadata snapshot (e.g. tree snapshot, search target, etc.) */
  meta?: any;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode: string[];
  bestCase: string;
  averageCase: string;
  worstCase: string;
  description: string;
}

export type StepGenerator<TInput, TItem> = (
  input: TInput,
  emitStep: (
    text: string,
    line: number,
    highlighted: string[],
    kind: StepKind,
    meta?: any
  ) => Step,
  doneSet: Set<string>
) => Generator<Step, void, unknown>;
