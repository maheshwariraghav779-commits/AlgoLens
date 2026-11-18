// Unit 6: Hashing & Collision Resolution Generators

export const UNIT6_HASHING = {
  // Linear Probing
  linearProbing: {
    name: 'Open Addressing: Linear Probing',
    time: 'O(1) avg, O(n) worst',
    space: 'O(M)',
    pseudocode: [
      'hash = key % tableSize',
      'for i from 0 to tableSize - 1:',
      '  slot = (hash + i) % tableSize',
      '  if table[slot] == empty: table[slot] = key; return'
    ],
    *generate(keysToInsert, tableSize, S) {
      if (typeof keysToInsert === 'function') {
        S = keysToInsert;
        keysToInsert = null;
      } else if (typeof tableSize === 'function') {
        S = tableSize;
        tableSize = null;
      }
      const keys = Array.isArray(keysToInsert) && keysToInsert.length > 0 ? keysToInsert : [12, 22, 32, 42, 15];
      const m = tableSize || 10;
      const table = Array(m).fill(null);
      yield S(`Linear Probing: Hash Table size M = ${m}. Hash formula h(k) = k % ${m}. Probing: (h(k) + i) % M.`, 0, [], 'none', { table: [...table] });

      for (const k of keys) {
        const h0 = k % m;
        yield S(`Inserting key ${k}: initial hash slot h(${k}) = ${k} % ${m} = ${h0}.`, 0, [h0], 'none', { table: [...table] });

        let inserted = false;
        for (let i = 0; i < m; i++) {
          const slot = (h0 + i) % m;
          yield S(`Probe i = ${i}: checking slot ${slot}...`, 2, [slot], 'cmp', { table: [...table], activeSlot: slot });

          if (table[slot] === null) {
            table[slot] = k;
            yield S(`Slot ${slot} is empty! Inserted key ${k} at index ${slot} after ${i} collision probes.`, 3, [slot], 'swap', {
              table: [...table], activeSlot: slot
            });
            inserted = true;
            break;
          } else {
            yield S(`Collision at slot ${slot} (occupied by ${table[slot]}). Probing next sequential slot...`, 2, [slot], 'cmp', {
              table: [...table], activeSlot: slot
            });
          }
        }

        if (!inserted) {
          yield S(`Table overflow! Could not insert ${k}.`, 3, [], 'none', { table: [...table] });
        }
      }

      yield S(`Linear Probing complete! All keys placed. (Notice how consecutive collisions lead to primary clustering).`, 0, [], 'none', { table: [...table] });
    }
  },

  // Quadratic Probing
  quadraticProbing: {
    name: 'Open Addressing: Quadratic Probing',
    time: 'O(1) avg, O(n) worst',
    space: 'O(M)',
    pseudocode: [
      'hash = key % tableSize',
      'for i from 0 to tableSize - 1:',
      '  slot = (hash + i * i) % tableSize',
      '  if table[slot] == empty: table[slot] = key; return'
    ],
    *generate(keysToInsert, tableSize, S) {
      if (typeof keysToInsert === 'function') {
        S = keysToInsert;
        keysToInsert = null;
      } else if (typeof tableSize === 'function') {
        S = tableSize;
        tableSize = null;
      }
      const keys = Array.isArray(keysToInsert) && keysToInsert.length > 0 ? keysToInsert : [13, 23, 33, 43];
      const m = tableSize || 10;
      const table = Array(m).fill(null);
      yield S(`Quadratic Probing: Hash slot formula: (h(k) + i²) % M. Resolves primary clustering!`, 0, [], 'none', { table: [...table] });

      for (const k of keys) {
        const h0 = k % m;
        yield S(`Inserting ${k}: initial slot h0 = ${h0}.`, 0, [h0], 'none', { table: [...table] });

        for (let i = 0; i < m; i++) {
          const slot = (h0 + i * i) % m;
          yield S(`Probe i = ${i}: offset = ${i}² = ${i * i}. Testing slot (${h0} + ${i * i}) % ${m} = ${slot}.`, 2, [slot], 'cmp', {
            table: [...table], activeSlot: slot
          });

          if (table[slot] === null) {
            table[slot] = k;
            yield S(`Empty slot found! Inserted ${k} into slot ${slot}.`, 3, [slot], 'swap', {
              table: [...table], activeSlot: slot
            });
            break;
          }
        }
      }
      yield S(`Quadratic Probing finished!`, 0, [], 'none', { table: [...table] });
    }
  },

  // Separate Chaining
  separateChaining: {
    name: 'Closed Addressing: Separate Chaining (Linked Lists)',
    time: 'O(1 + α)',
    space: 'O(M + N)',
    pseudocode: [
      'bucket = key % tableSize',
      'newNode = createNode(key)',
      'newNode.next = table[bucket]',
      'table[bucket] = newNode'
    ],
    *generate(keysToInsert, tableSize, S) {
      if (typeof keysToInsert === 'function') {
        S = keysToInsert;
        keysToInsert = null;
      } else if (typeof tableSize === 'function') {
        S = tableSize;
        tableSize = null;
      }
      const keys = Array.isArray(keysToInsert) && keysToInsert.length > 0 ? keysToInsert : [15, 25, 35, 12, 22];
      const m = tableSize || 5;
      const table = Array.from({ length: m }, () => []);
      yield S(`Separate Chaining: each table bucket maintains a linked list of collided keys. Table Size M = ${m}.`, 0, [], 'none', { table: table.map(b => [...b]) });

      for (const k of keys) {
        const b = k % m;
        yield S(`Key ${k} hashes to Bucket ${b} (${k} % ${m} = ${b}).`, 0, [b], 'cmp', {
          table: table.map(bucket => [...bucket]), activeBucket: b
        });

        table[b].unshift(k); // insert at head of bucket's list
        yield S(`Inserted ${k} at the head of Bucket ${b}'s linked list chain.`, 3, [b], 'swap', {
          table: table.map(bucket => [...bucket]), activeBucket: b
        });
      }

      yield S(`Separate Chaining complete! Load factor α = N / M = ${keys.length} / ${m} = ${(keys.length / m).toFixed(1)}.`, 0, [], 'none', {
        table: table.map(bucket => [...bucket])
      });
    }
  },

  // Extendible Hashing
  extendibleHashing: {
    name: 'Extendible Hashing (Dynamic Directory & Local Depth)',
    time: 'O(1) lookup',
    space: 'O(Directory + Buckets)',
    pseudocode: [
      'hash = h(key) in binary',
      'dir_idx = leading_bits(hash, global_depth)',
      'if bucket is full and local_depth == global_depth: double directory; global_depth++',
      'split bucket and redistribute keys; local_depth++'
    ],
    *generate(dummy, S) {
      if (typeof dummy === 'function') {
        S = dummy;
      }
      let globalDepth = 1;
      const directory = [
        { dirIdx: 0, bin: '0', bucketId: 'B0' },
        { dirIdx: 1, bin: '1', bucketId: 'B1' }
      ];
      const buckets = {
        'B0': { id: 'B0', localDepth: 1, keys: [4, 8] },
        'B1': { id: 'B1', localDepth: 1, keys: [5] }
      };

      yield S(`Extendible Hashing: Global Depth = ${globalDepth}. 2 directory pointers referencing 2 buckets of capacity 2.`, 0, [], 'none', {
        globalDepth, directory: [...directory], buckets: JSON.parse(JSON.stringify(buckets))
      });

      // Insert 12 (binary 1100 -> ends with 00)
      yield S(`Inserting key 12 (binary ...00): hashes to Bucket B0. But Bucket B0 is FULL ([4, 8])!`, 2, [], 'cmp', {
        globalDepth, directory: [...directory], buckets: JSON.parse(JSON.stringify(buckets))
      });

      // Local depth == Global depth -> Directory doubles
      globalDepth = 2;
      const newDirectory = [
        { dirIdx: 0, bin: '00', bucketId: 'B0_new' },
        { dirIdx: 1, bin: '01', bucketId: 'B1' },
        { dirIdx: 2, bin: '10', bucketId: 'B2_new' },
        { dirIdx: 3, bin: '11', bucketId: 'B1' }
      ];
      const newBuckets = {
        'B0_new': { id: 'B0_new', localDepth: 2, keys: [4, 12] },
        'B1': { id: 'B1', localDepth: 1, keys: [5] },
        'B2_new': { id: 'B2_new', localDepth: 2, keys: [8] }
      };

      yield S(`Local Depth (1) == Global Depth (1): Directory DOUBLES! Global Depth increased to 2. Bucket B0 split into B0_new and B2_new with local depth = 2.`, 3, [], 'swap', {
        globalDepth, directory: newDirectory, buckets: newBuckets
      });

      yield S(`Extendible Hashing completed! Notice how only the overflowing bucket split without rehashing the entire database!`, 3, [], 'none', {
        globalDepth, directory: newDirectory, buckets: newBuckets
      });
    }
  }
};
