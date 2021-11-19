const calc = (hitWeights, missWeights) => {
  // generate our DP array
  const dp = [...new Array(missWeights.length)].map((_, i) => new Array(missWeights.length - i).fill({
    weight: null,
    cost: null,
    root: null
  }))

  // base case(s)
  for (let i = 0; i < dp.length; i += 1) {
    dp[0][i] = {
      ...dp[0][i],
      weight: missWeights[i],
      cost: 0
    }
  }

  // row
  for (let i = 1; i < dp.length; i += 1) {
    let len = dp[i].length
    // col
    for (let j = 0; j < len; j += 1) {
      let weight = 0;

      // add the necessary hitWeights
      for (let hit = j; hit < j + i; hit += 1) {
        weight += hitWeights[hit]
      }

      // add the necessary missWeights
      for (let miss = j; miss < j + i + 1; miss += 1) {
        weight += missWeights[miss]
      }

      // find root
      // we want to check to see for all possible roots from j --> j + i
      // cost{optimal left} + weight{root} + cost{optimal right}
      let root = j + 1
      let cost = Infinity;

      const start = j
      const end = i + j
      // try all roots in the range {startNode}:{startNode + nodeCount} which is {j}{i + j}
      for (let r = start; r < end; r += 1) {

        // optimal costs of left and right sub-trees given root r and inherited contraints i, j
        let optimalLeft = 0
        let optimalRight = 0

        // set left
        if (r - start - 1 >= 0) {
          optimalLeft = dp[r - start][start].cost
        }

        // set right
        if (end - r - 1 >= 0) {
          optimalRight = dp[end - r - 1][r + 1].cost
        }

        // calculate node cost
        const curCost = weight + optimalLeft + optimalRight

        // if this root is optimal thusfar (cost is minimized), update the optimal
        // root and cost
        if (curCost < cost) {
          cost = curCost
          root = r + 1
        }
      }

      dp[i][j] = {
        weight,
        cost,
        root,
      }

    }
  }

  return dp
}

const generateOptimalTree = (nodeCount, startNode, endNode, data, hitWeights) => {
  // handle null cases
  if (data[nodeCount] === 0 || data[nodeCount][startNode] === null) {
    return null
  }

  // too many nodes!
  if (startNode + nodeCount > endNode) {
    return { value: `[nil_${startNode} (${data[0][startNode].weight})]` }
  }

  // nil node encountered
  if (data[nodeCount][startNode].root === null) {
    return { value: `[nil_${startNode} (${data[nodeCount][startNode].weight})]` }
  }

  const root = data[nodeCount][startNode].root

  // build optimal left subTree for root
  const left = generateOptimalTree(root - startNode - 1, startNode, root - 1, data, hitWeights)

  // build optimal right subTree for root
  const right = generateOptimalTree(endNode - root, root, endNode, data, hitWeights)

  // wire it all up
  return {
    value: `[node_${root} (${hitWeights[root - 1]})]`,
    left,
    right
  }
}

// https://github.com/saibabanadh/print-bst/blob/master/bst.js
const buildTree = (root, curr_index = 0, index = false, delimiter = '-') => {
  if (!root) return [[], 0, 0, 0];
  let line1 = [];
  let line2 = []
  let node_repr = index ? `${curr_index}${delimiter}${root.value}` : root.value;
  let new_root_width = node_repr.length;
  let gap_size = node_repr.length;
  let [l_box, l_box_width, l_root_start, l_root_end] = buildTree(root.left, (2 * curr_index) + 1, index, delimiter);
  let [r_box, r_box_width, r_root_start, r_root_end] = buildTree(root.right, (2 * curr_index) + 2, index, delimiter);
  let new_root_start = 0;
  let new_root_end = 0;
  if (l_box_width > 0) {
    l_root = Math.floor((l_root_start + l_root_end) / 2) + 1;
    line1.push(' '.repeat(l_root + 1));
    line1.push('_'.repeat(l_box_width - l_root));
    line2.push(' '.repeat(l_root) + '/');
    line2.push(' '.repeat(l_box_width - l_root));
    new_root_start = l_box_width + 1;
    gap_size += 1;
  } else {
    new_root_start = 0;
  }
  line1.push(node_repr);
  line2.push(' '.repeat(new_root_width));
  if (r_box_width > 0) {
    r_root = Math.floor((r_root_start + r_root_end) / 2);
    line1.push('_'.repeat(r_root));
    line1.push(' '.repeat(r_box_width - r_root + 1));
    line2.push(' '.repeat(r_root) + '\\');
    line2.push(' '.repeat(r_box_width - r_root));
    gap_size += 1;
  }
  new_root_end = new_root_start + new_root_width - 1;
  new_box = [line1.join(''), line2.join('')];
  let l_line, r_line;
  for (let i = 0; i < Math.max(l_box.length, r_box.length); i++) {
    if (i < l_box.length) l_line = l_box[i];
    else l_line = ' '.repeat(l_box_width);
    if (i < r_box.length) r_line = r_box[i];
    else r_line = ' '.repeat(r_box_width);
    new_box.push(l_line + ' '.repeat(gap_size) + r_line);
  }
  return [new_box, new_box[0].length, new_root_start, new_root_end];
};

// https://github.com/saibabanadh/print-bst/blob/master/bst.js
const printTree = (root, { totalCost, totalWeight }) => {
  console.log('\n\n')
  let lines = buildTree(root)[0];
  let output = "";
  for (let line of lines) {
    output += line + '\n';
  }
  process.stdout.write('\x1b[36m')
  console.log(output)
  process.stdout.write('\x1b[31m')
  console.log(`total tree cost: ${totalCost}`)
  console.log(`total tree weight: ${totalWeight}`)
  console.log('\n\n')
}

const run = (hitWeights, missWeights) => {
  // create our DP table
  const calculated = calc(hitWeights, missWeights)
  // generate our optimal tree
  const optimal = generateOptimalTree(calculated.length - 1, 0, calculated.length - 1, calculated, hitWeights)
  // print the tree
  printTree(optimal, {
    totalCost: calculated[calculated.length - 1][0].cost,
    totalWeight: calculated[calculated.length - 1][0].weight
  })
}

// class/pset examples
run([5, 3, 2, 1], [5, 1, 1, 1, 1])
run([2, 1, 4, 1], [1, 2, 1, 1, 3])

// online examples
run([15, 10, 5, 10, 20], [5, 10, 5, 5, 5, 10])
run([3, 3, 1, 1], [2, 3, 1, 1, 1])