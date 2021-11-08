const hitWeights = [5, 3, 2, 1]
const missWeights = [5, 1, 1, 1, 1]

//const hitWeights = [2, 1, 4, 1]
//const missWeights = [1, 2, 1, 1, 3]

const dp = [...new Array(missWeights.length)].map((_, i) => new Array(missWeights.length - i).fill({
  weight: null,
  cost: null,
  root: null
}))


// base case
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

    // at this point our weights are correct

    // find root
    // we want to check to see for all possible roots from j --> j + i
    // cost{optimal left} + weight{root} + cost{optimal right}
    let root = j + 1
    let cost = Infinity;

    const start = j
    const end = i + j
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

      const curCost = weight + optimalLeft + optimalRight

      // if this root is optimal thusfar, then set it
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

console.log(dp)
