/**
 * Memory Visualizer Engine
 * Simulates 64-bit Virtual Address Space (Call Stack segment, Heap segment, Pointers, Registers)
 */

export function generateMemorySnapshot(unitKey, topicKey, stepIndex, currentStep, baseArray) {
  const stackFrames = [];
  const heapChunks = [];

  const STACK_BASE = 0x7FFF_EF40;
  const HEAP_BASE = 0x10A4_B000;

  if (unitKey === 'unit1' || !unitKey) {
    stackFrames.push({
      name: `${topicKey || 'sort'}(arr, n=${baseArray?.length || 9})`,
      addr: `0x${(STACK_BASE - 0x60).toString(16).toUpperCase()}`,
      vars: [
        { name: 'arr (ptr)', val: `0x${HEAP_BASE.toString(16).toUpperCase()}`, type: 'int*' },
        { name: 'step_idx', val: stepIndex, type: 'int' },
        { name: 'comparisons', val: currentStep?.comparisons ?? 0, type: 'int' },
        { name: 'swaps', val: currentStep?.swaps ?? 0, type: 'int' }
      ]
    });
    stackFrames.push({
      name: 'main(argc, argv)',
      addr: `0x${STACK_BASE.toString(16).toUpperCase()}`,
      vars: [
        { name: 'exit_code', val: '0', type: 'int' },
        { name: 'ret_addr', val: '0x4000_1020', type: 'void*' }
      ]
    });

    // Heap allocation: Contiguous int array
    const arr = baseArray || [34, 12, 27, 8, 41, 19, 5, 30, 16];
    const highlightedIndices = currentStep?.highlighted || [];
    arr.forEach((v, i) => {
      const chunkAddr = `0x${(HEAP_BASE + i * 4).toString(16).toUpperCase()}`;
      heapChunks.push({
        addr: chunkAddr,
        label: `arr[${i}]`,
        val: `${v} (4 bytes)`,
        active: highlightedIndices.includes(i) || highlightedIndices.includes(`bar_${i}_${v}`),
        target: false
      });
    });
  } else if (unitKey === 'unit2') {
    // Linked Lists: Stack pointer to Head + Heap allocated Node structs
    stackFrames.push({
      name: 'linkedListOp(head)',
      addr: `0x${(STACK_BASE - 0x40).toString(16).toUpperCase()}`,
      vars: [
        { name: 'head', val: `0x${HEAP_BASE.toString(16).toUpperCase()}`, type: 'Node*' },
        { name: 'curr', val: currentStep?.meta?.activeId ? `0x${(HEAP_BASE + 0x30).toString(16).toUpperCase()}` : '0x0 (NULL)', type: 'Node*' }
      ]
    });

    const list = currentStep?.meta?.list || [
      { id: '1', val: 10 }, { id: '2', val: 20 }, { id: '3', val: 30 }
    ];
    list.forEach((node, i) => {
      const nodeAddr = `0x${(HEAP_BASE + i * 0x30).toString(16).toUpperCase()}`;
      const nextAddr = i < list.length - 1 ? `0x${(HEAP_BASE + (i + 1) * 0x30).toString(16).toUpperCase()}` : '0x0 (NULL)';
      heapChunks.push({
        addr: nodeAddr,
        label: `Node [${node.val}]`,
        val: `data: ${node.val} | next: ${nextAddr}`,
        active: currentStep?.meta?.activeId === node.id || currentStep?.meta?.newNode?.id === node.id,
        target: false
      });
    });
  } else if (unitKey === 'unit3') {
    // Stacks & Queues: Stack buffer
    stackFrames.push({
      name: 'evalOrQueue(capacity=5)',
      addr: `0x${STACK_BASE.toString(16).toUpperCase()}`,
      vars: [
        { name: 'top_ptr', val: currentStep?.meta?.stack ? currentStep.meta.stack.length - 1 : 0, type: 'int' },
        { name: 'front', val: currentStep?.meta?.front ?? 0, type: 'int' },
        { name: 'rear', val: currentStep?.meta?.rear ?? -1, type: 'int' }
      ]
    });

    const stackItems = currentStep?.meta?.stack || [5, 3];
    stackItems.forEach((item, i) => {
      heapChunks.push({
        addr: `0x${(HEAP_BASE + i * 8).toString(16).toUpperCase()}`,
        label: `Stack Slot [${i}]`,
        val: `value: ${item}`,
        active: i === stackItems.length - 1,
        target: false
      });
    });
  } else if (unitKey === 'unit4' || unitKey === 'filesystem') {
    // Trees: Heap-allocated TreeNode structs
    stackFrames.push({
      name: 'treeTraverse(root)',
      addr: `0x${STACK_BASE.toString(16).toUpperCase()}`,
      vars: [
        { name: 'root', val: `0x${HEAP_BASE.toString(16).toUpperCase()}`, type: 'TreeNode*' },
        { name: 'recursion_depth', val: '2', type: 'int' }
      ]
    });

    heapChunks.push({
      addr: `0x${HEAP_BASE.toString(16).toUpperCase()}`,
      label: 'Root Node',
      val: `left: 0x${(HEAP_BASE + 0x40).toString(16).toUpperCase()} | right: 0x${(HEAP_BASE + 0x80).toString(16).toUpperCase()}`,
      active: true
    });
    heapChunks.push({
      addr: `0x${(HEAP_BASE + 0x40).toString(16).toUpperCase()}`,
      label: 'Left Child',
      val: 'val: 30 | left: NULL | right: NULL',
      active: false
    });
    heapChunks.push({
      addr: `0x${(HEAP_BASE + 0x80).toString(16).toUpperCase()}`,
      label: 'Right Child',
      val: 'val: 70 | left: NULL | right: NULL',
      active: false
    });
  } else {
    // General Heap Table
    stackFrames.push({
      name: 'executeOp()',
      addr: `0x${STACK_BASE.toString(16).toUpperCase()}`,
      vars: [{ name: 'status', val: '0x1', type: 'uint32_t' }]
    });
    heapChunks.push({
      addr: `0x${HEAP_BASE.toString(16).toUpperCase()}`,
      label: 'Dynamic Bucket Array',
      val: 'capacity: 10 slots allocated',
      active: true
    });
  }

  return { stackFrames, heapChunks };
}
