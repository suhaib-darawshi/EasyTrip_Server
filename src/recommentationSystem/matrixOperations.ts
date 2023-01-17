 export function elementMult(a: number[][], b: number[][]) {
    return a.map((row, i) => row.map((val, j) => val * b[i][j]));
  }
  
  export function elementDiv(a: number[][], b: number[][]) {
    return a.map((row, i) => row.map((val, j) => val / b[i][j]));
  }
  
  export function transpose(a: number[][]) {
    return a[0].map((col, i) => a.map(row => row[i]));
  }
  
  export function matrixMultiply(a: number[][], b: number[][]) {
    return a.map(row => {
        return row.map((val, j) => {
            return row.reduce((sum, elt, i) => sum + elt * b[i][j], 0);
        });
    });
  }
  
  export function pearsonSimilarity(user1: number[], user2: number[]) {
    let sum1 = 0;
    let sum2 = 0;
    let sum1Sq = 0;
    let sum2Sq = 0;
    let pSum = 0;
    let n = 0;
  
    for (let i = 0; i < user1.length; i++) {
        if (user1[i] != null && user2[i] != null) {
            n++;
            sum1 += user1[i];
            sum2 += user2[i];
            sum1Sq += user1[i] * user1[i];
            sum2Sq += user2[i] * user2[i];
            pSum += user1[i] * user2[i];
        }
    }
  
    if (n == 0) {
        return 0;
    }
  
    let num = pSum - (sum1 * sum2 / n);
    let den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
    if (den == 0) {
        return 0;
    }
  
    return num / den;
  }