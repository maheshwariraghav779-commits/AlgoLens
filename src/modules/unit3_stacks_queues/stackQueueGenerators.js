// Unit 3: Stacks & Queues Generators

export const UNIT3_STACKS_QUEUES = {
  // Infix to Postfix Conversion
  infixToPostfix: {
    name: 'Infix to Postfix Conversion (Stack Application)',
    time: 'O(N)',
    space: 'O(N)',
    pseudocode: [
      'for char in expression:',
      '  if operand: append to output',
      '  else if "(": push to stack',
      '  else if ")": pop until "(", append to output',
      '  else if operator: pop higher/equal precedence, push operator',
      'pop remaining operators from stack'
    ],
    *generate(infixStr, S) {
      const expr = infixStr || '(A + B) * C - D / E';
      const tokens = expr.replace(/\s+/g, '').split('');
      const stack = [];
      const output = [];

      const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

      yield S(`Infix to Postfix: scanning expression "${expr}".`, 0, [], 'none', { expr, stack: [], output: [] });

      for (let idx = 0; idx < tokens.length; idx++) {
        const char = tokens[idx];

        if (/[A-Za-z0-9]/.test(char)) {
          output.push(char);
          yield S(`Token "${char}" is an operand: append directly to output.`, 1, [idx], 'swap', {
            token: char, stack: [...stack], output: [...output]
          });
        } else if (char === '(') {
          stack.push(char);
          yield S(`Token "(" open parenthesis: push onto stack.`, 2, [idx], 'cmp', {
            token: char, stack: [...stack], output: [...output]
          });
        } else if (char === ')') {
          yield S(`Token ")" close parenthesis: pop operators until matching "(".`, 3, [idx], 'cmp', {
            token: char, stack: [...stack], output: [...output]
          });
          while (stack.length > 0 && stack[stack.length - 1] !== '(') {
            const popped = stack.pop();
            output.push(popped);
            yield S(`Popped operator "${popped}" from stack and appended to output.`, 3, [], 'swap', {
              token: char, stack: [...stack], output: [...output]
            });
          }
          stack.pop(); // remove '('
        } else {
          // Operator
          while (
            stack.length > 0 &&
            stack[stack.length - 1] !== '(' &&
            precedence[stack[stack.length - 1]] >= precedence[char]
          ) {
            const popped = stack.pop();
            output.push(popped);
            yield S(`Popped higher/equal precedence operator "${popped}" from stack.`, 4, [], 'swap', {
              token: char, stack: [...stack], output: [...output]
            });
          }
          stack.push(char);
          yield S(`Pushed operator "${char}" onto stack.`, 4, [idx], 'cmp', {
            token: char, stack: [...stack], output: [...output]
          });
        }
      }

      while (stack.length > 0) {
        const popped = stack.pop();
        output.push(popped);
        yield S(`Drained remaining operator "${popped}" from stack into output.`, 5, [], 'swap', {
          stack: [...stack], output: [...output]
        });
      }

      yield S(`Conversion complete! Postfix result: "${output.join(' ')}".`, 5, [], 'none', {
        stack: [], output: [...output]
      });
    }
  },

  // Postfix Evaluation
  postfixEval: {
    name: 'Postfix Expression Evaluation',
    time: 'O(N)',
    space: 'O(N)',
    pseudocode: [
      'for token in postfix_expression:',
      '  if operand: push value to stack',
      '  else if operator: op2 = pop(), op1 = pop(); push(eval(op1, op, op2))',
      'return stack.pop()'
    ],
    *generate(postfixStr, S) {
      // Default: "6 2 3 + * 3 8 2 / + * 2 ^ 3 +" -> simple sample: "5 3 + 2 *"
      const tokens = (postfixStr || '5 3 + 2 *').split(/\s+/).filter(Boolean);
      const stack = [];

      yield S(`Postfix Evaluation for expression: [${tokens.join(', ')}].`, 0, [], 'none', { tokens, stack: [] });

      for (let i = 0; i < tokens.length; i++) {
        const tok = tokens[i];
        if (!isNaN(tok)) {
          const num = Number(tok);
          stack.push(num);
          yield S(`Operand ${num}: push onto calculation stack.`, 1, [i], 'cmp', { tokens, activeIdx: i, stack: [...stack] });
        } else {
          const op2 = stack.pop();
          const op1 = stack.pop();
          let res = 0;
          if (tok === '+') res = op1 + op2;
          else if (tok === '-') res = op1 - op2;
          else if (tok === '*') res = op1 * op2;
          else if (tok === '/') res = Math.floor(op1 / op2);

          stack.push(res);
          yield S(`Operator "${tok}": popped operands ${op1} and ${op2}; evaluated ${op1} ${tok} ${op2} = ${res}; pushed result back to stack.`, 2, [i], 'swap', {
            tokens, activeIdx: i, stack: [...stack], evalDetail: `${op1} ${tok} ${op2} = ${res}`
          });
        }
      }

      yield S(`Evaluation complete! Final answer = ${stack[0]}.`, 3, [], 'none', { tokens, stack: [...stack] });
    }
  },

  // Circular Queue Simulation
  circularQueue: {
    name: 'Circular Queue (Resolving False Overflow)',
    time: 'O(1) Enqueue / Dequeue',
    space: 'O(Capacity)',
    pseudocode: [
      'rear = (rear + 1) % capacity // Enqueue',
      'queue[rear] = item; count++',
      'front = (front + 1) % capacity // Dequeue',
      'count--'
    ],
    *generate(capacity = 5, operations, S) {
      const cap = capacity;
      const buffer = Array(cap).fill(null);
      let front = 0;
      let rear = -1;
      let count = 0;

      const ops = operations || [
        { op: 'enq', val: 10 },
        { op: 'enq', val: 20 },
        { op: 'enq', val: 30 },
        { op: 'deq' },
        { op: 'enq', val: 40 },
        { op: 'enq', val: 50 },
        { op: 'enq', val: 60 }, // wrap around to index 0!
        { op: 'deq' }
      ];

      yield S(`Circular Queue initialized with capacity ${cap}. Modulo arithmetic wraps rear to 0 when end is reached!`, 0, [], 'none', {
        buffer: [...buffer], front, rear, count, cap
      });

      for (const stepOp of ops) {
        if (stepOp.op === 'enq') {
          if (count === cap) {
            yield S(`Queue is FULL (${count}/${cap}). Cannot enqueue ${stepOp.val}.`, 1, [], 'cmp', {
              buffer: [...buffer], front, rear, count, cap
            });
            continue;
          }
          rear = (rear + 1) % cap;
          buffer[rear] = stepOp.val;
          count++;
          yield S(`Enqueue ${stepOp.val}: new rear = (prev + 1) % ${cap} = index ${rear}.`, 1, [rear], 'swap', {
            buffer: [...buffer], front, rear, count, cap, activeIdx: rear
          });
        } else {
          if (count === 0) {
            yield S(`Queue is EMPTY. Cannot dequeue.`, 2, [], 'cmp', {
              buffer: [...buffer], front, rear, count, cap
            });
            continue;
          }
          const val = buffer[front];
          buffer[front] = null;
          yield S(`Dequeue element ${val} at front index ${front}.`, 2, [front], 'swap', {
            buffer: [...buffer], front, rear, count, cap, activeIdx: front
          });
          front = (front + 1) % cap;
          count--;
        }
      }

      yield S(`Circular Queue operations finished. Current size: ${count}/${cap}.`, 3, [], 'none', {
        buffer: [...buffer], front, rear, count, cap
      });
    }
  },

  // Josephus Problem Application
  josephus: {
    name: 'Josephus Problem (Queue Application)',
    time: 'O(n · k)',
    space: 'O(n)',
    pseudocode: [
      'queue = [1, 2, ..., n]',
      'while queue.size > 1:',
      '  for i in 1..k-1: queue.enqueue(queue.dequeue())',
      '  eliminated = queue.dequeue()',
      'survivor = queue.dequeue()'
    ],
    *generate(n = 7, k = 3, S) {
      const queue = Array.from({ length: n }, (_, i) => i + 1);
      yield S(`Josephus Problem: ${n} people in a circle. Counting every ${k}-th person for elimination.`, 0, [], 'none', {
        queue: [...queue], n, k
      });

      while (queue.length > 1) {
        for (let i = 1; i < k; i++) {
          const person = queue.shift();
          queue.push(person);
          yield S(`Count ${i}: Person ${person} survives this round and moves to the back of the queue.`, 2, [], 'none', {
            queue: [...queue], currentCount: i, activePerson: person
          });
        }

        const eliminated = queue.shift();
        yield S(`Count ${k}! Person ${eliminated} is eliminated from the circle.`, 3, [], 'swap', {
          queue: [...queue], eliminated
        });
      }

      const survivor = queue[0];
      yield S(`Execution complete! Person ${survivor} is the sole survivor!`, 4, [], 'swap', {
        queue: [...queue], survivor
      });
    }
  },

  // Double Ended Queue (Deque)
  dequeOperations: {
    name: 'Double Ended Queue (Deque)',
    time: 'O(1) all ends',
    space: 'O(Capacity)',
    pseudocode: [
      'insertFront(val): front = (front - 1 + cap) % cap; arr[front] = val',
      'insertRear(val): rear = (rear + 1) % cap; arr[rear] = val',
      'deleteFront(): val = arr[front]; front = (front + 1) % cap',
      'deleteRear(): val = arr[rear]; rear = (rear - 1 + cap) % cap'
    ],
    *generate(dummy, S) {
      if (typeof dummy === 'function') S = dummy;
      const cap = 6;
      let deque = [null, null, 25, 40, null, null];
      let front = 2;
      let rear = 3;

      yield S(`Double Ended Queue (Deque): insertions and deletions are permitted at BOTH ends (Front and Rear) in O(1) time.`, 0, [], 'none', {
        type: 'deque', items: [...deque], front, rear, cap
      });

      // 1. insertRear(65)
      rear = (rear + 1) % cap;
      deque[rear] = 65;
      yield S(`Operation: insertRear(65). New rear = (prev + 1) % ${cap} = index ${rear}.`, 1, [rear], 'swap', {
        type: 'deque', items: [...deque], front, rear, cap, activeOp: 'insertRear', activeVal: 65
      });

      // 2. insertFront(12)
      front = (front - 1 + cap) % cap;
      deque[front] = 12;
      yield S(`Operation: insertFront(12). New front = (prev - 1 + ${cap}) % ${cap} = index ${front}.`, 0, [front], 'swap', {
        type: 'deque', items: [...deque], front, rear, cap, activeOp: 'insertFront', activeVal: 12
      });

      // 3. insertFront(8) - Demonstrating front wrapping around!
      front = (front - 1 + cap) % cap;
      deque[front] = 8;
      yield S(`Operation: insertFront(8). Front decrements and wraps around to index ${front}!`, 0, [front], 'swap', {
        type: 'deque', items: [...deque], front, rear, cap, activeOp: 'insertFront', activeVal: 8
      });

      // 4. deleteRear()
      const poppedRear = deque[rear];
      deque[rear] = null;
      rear = (rear - 1 + cap) % cap;
      yield S(`Operation: deleteRear(). Removed value ${poppedRear} from rear; rear shifted to index ${rear}.`, 3, [rear], 'cmp', {
        type: 'deque', items: [...deque], front, rear, cap, activeOp: 'deleteRear', activeVal: poppedRear
      });

      // 5. deleteFront()
      const poppedFront = deque[front];
      deque[front] = null;
      front = (front + 1) % cap;
      yield S(`Operation: deleteFront(). Removed value ${poppedFront} from front; front shifted to index ${front}.`, 2, [front], 'cmp', {
        type: 'deque', items: [...deque], front, rear, cap, activeOp: 'deleteFront', activeVal: poppedFront
      });

      yield S(`Deque operations finalized! Deque can flexibly emulate both a Stack (LIFO) and a Queue (FIFO).`, 0, [], 'none', {
        type: 'deque', items: [...deque], front, rear, cap
      });
    }
  },

  // Infix to Prefix Conversion
  infixToPrefix: {
    name: 'Infix to Prefix Conversion',
    time: 'O(N)',
    space: 'O(N)',
    pseudocode: [
      '1. Reverse the infix expression (swap "(" with ")")',
      '2. Compute Postfix using operator precedence stack',
      '3. Reverse the postfix output to obtain final Prefix result'
    ],
    *generate(infixStr, S) {
      if (typeof infixStr === 'function') {
        S = infixStr;
        infixStr = null;
      }
      const expr = infixStr || '(A + B) * (C - D)';
      yield S(`Infix to Prefix Conversion for: "${expr}". Method: Reverse Infix -> Infix-to-Postfix -> Reverse Postfix.`, 0, [], 'none', {
        type: 'prefix', stage: 'start', expr, stack: [], output: []
      });

      // Step 1: Reverse infix and swap parentheses
      const reversedTokens = expr.replace(/\s+/g, '').split('').reverse().map(ch => {
        if (ch === '(') return ')';
        if (ch === ')') return '(';
        return ch;
      });
      yield S(`Step 1: Invert string and swap parentheses: "${reversedTokens.join('')}".`, 0, [], 'cmp', {
        type: 'prefix', stage: 'reversed', reversedInfix: reversedTokens.join(' '), stack: [], output: []
      });

      // Step 2: Postfix conversion of reversed string
      const stack = [];
      const output = [];
      const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };

      for (let i = 0; i < reversedTokens.length; i++) {
        const token = reversedTokens[i];
        if (/[A-Za-z0-9]/.test(token)) {
          output.push(token);
          yield S(`Token "${token}" is operand: append to intermediate output.`, 1, [i], 'swap', {
            type: 'prefix', stage: 'scan', token, stack: [...stack], output: [...output]
          });
        } else if (token === '(') {
          stack.push(token);
          yield S(`Token "(": push to operator stack.`, 1, [i], 'cmp', {
            type: 'prefix', stage: 'scan', token, stack: [...stack], output: [...output]
          });
        } else if (token === ')') {
          while (stack.length > 0 && stack[stack.length - 1] !== '(') {
            output.push(stack.pop());
          }
          stack.pop(); // remove '('
          yield S(`Token ")": popped operators enclosed within parentheses.`, 1, [i], 'swap', {
            type: 'prefix', stage: 'scan', token, stack: [...stack], output: [...output]
          });
        } else {
          while (stack.length > 0 && stack[stack.length - 1] !== '(' && prec[stack[stack.length - 1]] > prec[token]) {
            output.push(stack.pop());
          }
          stack.push(token);
          yield S(`Operator "${token}": pushed to operator stack.`, 1, [i], 'cmp', {
            type: 'prefix', stage: 'scan', token, stack: [...stack], output: [...output]
          });
        }
      }

      while (stack.length > 0) {
        output.push(stack.pop());
      }
      yield S(`Intermediate postfix of reversed expression: "${output.join(' ')}".`, 1, [], 'cmp', {
        type: 'prefix', stage: 'intermediate', stack: [], output: [...output]
      });

      // Step 3: Reverse output to get Prefix!
      const finalPrefix = [...output].reverse().join(' ');
      yield S(`Step 3: Reversing intermediate output yields FINAL PREFIX: "${finalPrefix}"!`, 2, [], 'swap', {
        type: 'prefix', stage: 'final', finalPrefix, output: [...output]
      });
    }
  }
};
