/**
 * Prediction Engine (Blind / Competitive Challenge Mode)
 * Generates context-aware multiple-choice questions for the user to predict the next step.
 */

export function generatePredictionQuestion(unitKey, topicKey, stepIndex, currentStep, nextStep) {
  if (!nextStep) {
    return {
      question: "What is the final state of the algorithm?",
      options: [
        { text: "The data structure is completely processed and invariants are satisfied.", correct: true },
        { text: "The algorithm enters an infinite loop.", correct: false },
        { text: "Elements are in reverse order.", correct: false },
        { text: "Pointers point to dangling memory.", correct: false }
      ],
      explanation: "All passes have completed and the final invariants (e.g. sorted array, complete traversal, or resolved hashes) are fully satisfied."
    };
  }

  const kind = nextStep.kind;
  const nextText = nextStep.text || "";

  // 1. Sorting predictions
  if (kind === 'cmp' || kind === 'compare') {
    return {
      question: "Comparing the active elements. What will happen next?",
      options: [
        { text: "They will be compared to check if their ordering satisfies the invariant.", correct: true },
        { text: "They will immediately swap without any condition check.", correct: false },
        { text: "The entire array will reset to initial positions.", correct: false },
        { text: "Both elements will be deleted from memory.", correct: false }
      ],
      explanation: `Algorithm compares the elements: ${nextText}`
    };
  }

  if (kind === 'swap') {
    return {
      question: "Elements are out of order! What operation must occur now?",
      options: [
        { text: "A swap or shift takes place to move elements toward their correct positions.", correct: true },
        { text: "Skip them and advance the counter without changes.", correct: false },
        { text: "Restart the algorithm from index 0.", correct: false },
        { text: "Double the size of the array.", correct: false }
      ],
      explanation: `Because the condition was met, elements swap or shift: ${nextText}`
    };
  }

  // 2. Tree / Graph / Stack / Queue predictions
  if (unitKey === 'unit3') {
    if (nextText.toLowerCase().includes('push') || nextText.toLowerCase().includes('enqueue')) {
      return {
        question: "How will the Stack/Queue data structure update in this step?",
        options: [
          { text: "The token or item will be pushed/enqueued onto the structure.", correct: true },
          { text: "The entire structure will be emptied.", correct: false },
          { text: "Items will be sorted in-place inside the buffer.", correct: false },
          { text: "An underflow exception is thrown.", correct: false }
        ],
        explanation: nextText
      };
    }
  }

  if (unitKey === 'unit4' || unitKey === 'filesystem') {
    return {
      question: "Which branch will the traversal follow next?",
      options: [
        { text: "Traverse down into the next child or neighbor according to the traversal rule.", correct: true },
        { text: "Jump randomly to a leaf node.", correct: false },
        { text: "Delete the root of the tree.", correct: false },
        { text: "Convert the tree to an unsorted array.", correct: false }
      ],
      explanation: `Traversal rule dictates: ${nextText}`
    };
  }

  if (unitKey === 'unit6') {
    return {
      question: "If a collision occurs at this hash bucket, how is it resolved?",
      options: [
        { text: "Probe the next candidate bucket according to the probing / chaining strategy.", correct: true },
        { text: "Overwrite the previous key and discard the existing data.", correct: false },
        { text: "Crash the application with an unhandled exception.", correct: false },
        { text: "Rehash the entire table to size 0.", correct: false }
      ],
      explanation: `Collision resolution strategy: ${nextText}`
    };
  }

  // Fallback general prediction
  return {
    question: "What is the expected state transition in the next step?",
    options: [
      { text: "Advance the loop pointer or state according to algorithm logic.", correct: true },
      { text: "Terminate immediately without checking remaining elements.", correct: false },
      { text: "Reverse all pointers in memory.", correct: false },
      { text: "Allocate 1 GB of memory.", correct: false }
    ],
    explanation: nextText
  };
}
