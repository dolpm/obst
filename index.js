const hitWeights = [5, 3, 2, 1]
const missWeights = [5, 1, 1, 1, 1]

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

    // find cost via dp
    const cost = weight + Math.min(dp[i - 1][j].cost, dp[i - 1][j + 1].cost)

    // find root
    // we want to check to see for all possible roots from j --> j + i
    // cost{optimal left} + weight{root} + cost{optimal right}
    let root = j + 1
    if (i > 1) {
      const start = j
      const end = i + j
      for (let r = start; r <= end; r += 1) {

        // optimal costs of left and right sub-trees given root r and inherited contraints i, j
        let optimalLeft = 0
        let optimalRight = 0

        // set left
        if (r - start - 1 >= 0) {
          optimalLeft = dp[r - start - 1][start].cost
        }

        // set left
        if (end - r - 1 >= 0) {
          optimalRight = dp[end - r - 1][r + 1].cost
        }


        // cost{left} + weight{root} + cost{right} === opt{cost}
        if (optimalLeft + weight + optimalRight === cost) {
          /*
          console.log(`optimal root ${[j, i]} set: ${r + 1}`)
          console.log(`optimal left: ${optimalLeft}, optimal right: ${optimalRight}`)
          */
          root = r + 1
        }
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
