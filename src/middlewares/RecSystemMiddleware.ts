import {Middleware, MiddlewareMethods} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class RecSystemMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context) {

  }
}
export function nmf(v: number[][], k: number, maxIterations: number) {
  // Initialize the matrices W and H with random non-negative values
  let w = v.map(row => Array(k).fill(0).map(() => Math.random()));
  let h = Array(k).fill(0).map(() => Array(v[0].length).fill(0).map(() => Math.random()));

  // Perform the NMF iterations
  for (let i = 0; i < maxIterations; i++) {
      // Update H
      let num = multiply(transpose(w), v);
      let den = multiply(multiply(transpose(w), w), h);
      h = elementMult(h, elementDiv(num, den));

      // Update W
      num = multiply(v, transpose(h));
      den = multiply(multiply(w, h), transpose(h));
      w = elementMult(w, elementDiv(num, den));
  }

  // Print the results
  console.log(w);
  console.log(h);
}

function elementMult(a: number[][], b: number[][]) {
  return a.map((row, i) => row.map((val, j) => val * b[i][j]));
}

function elementDiv(a: number[][], b: number[][]) {
  return a.map((row, i) => row.map((val, j) => val / b[i][j]));
}

function transpose(a: number[][]) {
  return a[0].map((col, i) => a.map(row => row[i]));
}

function multiply(a: number[][], b: number[][]) {
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
