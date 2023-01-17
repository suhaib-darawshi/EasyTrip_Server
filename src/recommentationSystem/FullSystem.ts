import { TripService } from 'src/services/TripService';
import { UserService } from 'src/services/UserService';
import { elementMult, elementDiv, transpose, matrixMultiply } from './matrixOperations'

let tripService:TripService;
let userService:UserService;
export async function system(){
    
}
export function nmf(v: number[][], k: number, maxIterations: number) {
    // Initialize the matrices W and H with random non-negative values
    const m = v.length
    const n = v[0].length
    
    let w = new Array(v.length).fill(0).map(() => new Array(k).fill(0));
    for (let i = 0; i < v.length; i++) {
        for (let j = 0; j < k; j++) {
            w[i][j] = Math.random;
        }
    }

    let h = new Array(k).fill(0).map(() => new Array(v[0].length).fill(0));
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < v[0].length; j++) {
            h[i][j] = Math.random;
        }
    }
    // Perform the NMF iterations
    let maxerror=100000;
    let res=new Array(v.length).fill(0).map(() => new Array(v[0].length).fill(0));
    let check=new Array(v.length).fill(0).map(() => new Array(v[0].length).fill(0));
    check=matrixMultiply(w, h);
    for (let i = 0; i < maxIterations; i++) {
        // Update H
        let num = matrixMultiply(transpose(w), check);
        let den = matrixMultiply(matrixMultiply(transpose(w), w), h);
        h = elementMult(h, elementDiv(num, den));
        num = matrixMultiply(check, transpose(h));
        den = matrixMultiply(matrixMultiply(w, h), transpose(h));
        w = elementMult(w, elementDiv(num, den));
        let product = matrixMultiply(w, h);
        check = matrixMultiply(w, h);
        for (let ii = 0; ii < check.length; ii++) {
            for (let jj = 0; jj < check[0].length; jj++) {
            if (v[ii][jj] >= 1) {
                check[ii][jj] = v[ii][jj];
            }
            }
        }
        let error = 0;

        for (let ii = 0; ii < product.length; ii++) {
            for (let jj = 0; jj < product[0].length; jj++) {
            error += Math.sqrt(Math.pow(product[ii][jj] - check[ii][jj], 2));
            }
        }
        if (error < maxerror) {
            res = product;
            maxerror = error;
        }
    }
  
    // Print the results
    console.log(w);
    console.log(h);
  }
  