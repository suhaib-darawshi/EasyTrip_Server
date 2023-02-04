import { Inject, Injectable } from '@tsed/di';
import { RatingsService } from 'src/services/RatingsService';
import { TripService } from 'src/services/TripService';
import { UserService } from 'src/services/UserService';
import { elementMult, elementDiv, transpose, matrixMultiply } from './matrixOperations'





export function nmf(v: number[][], k: number, maxIterations: number) {
    
   
    let w = new Array(v.length).fill(0).map(() => new Array(k).fill(0));
    for (let i = 0; i < v.length; i++) {
        for (let j = 0; j < k; j++) {
            w[i][j] = Math.floor(Math.random()+1);
        }
    }

    let h = new Array(k).fill(0).map(() => new Array(v[0].length).fill(0));
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < v[0].length; j++) {
            h[i][j] = Math.floor(Math.random()+1);
        }
    }

    
    let maxerror=100000;
    let res=new Array(v.length).fill(0).map(() => new Array(v[0].length).fill(0));
    let check=new Array(v.length).fill(0).map(() => new Array(v[0].length).fill(0));check=matrixMultiply(w, h);
    for (let i = 0; i < maxIterations; i++) {
        
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
            if (v[ii][jj] > 0) {
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
            if(error<0.001){
                break;
            }
        }
    }
  

    
    return res;
  }
  


 