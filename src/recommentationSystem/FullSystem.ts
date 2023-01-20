import { Inject, Injectable } from '@tsed/di';
import { RatingsService } from 'src/services/RatingsService';
import { TripService } from 'src/services/TripService';
import { UserService } from 'src/services/UserService';
import { elementMult, elementDiv, transpose, matrixMultiply } from './matrixOperations'

let tripService:TripService;
let userService:UserService;
let ratings:RatingsService;

export async function system(){
    let rates=await ratings.getAll();
    let users:string[]=[];
    let trips:string[]=[];
    for (const iterator of rates) {
        users.push(iterator.userid);
        trips.push(iterator.tripid);

    }
    var usersSet =new Set(users);
    var tripsSet=new Set(trips);
    users=Array.from(usersSet);
    trips=Array.from(tripsSet);
    let w = new Array(usersSet.size).fill(0).map(() => new Array(tripsSet.size).fill(0));
    for (const iterator of rates){
        w[users.indexOf(iterator.userid)][trips.indexOf(iterator.tripid)]=iterator.rate;
    }
    for (let i = 0; i < w.length; i++){
        for(let j = 0; j < w[0].length; j++){
            if(!(w[i][j]>0)){
                w[i][j]=-1;
            }
        }
    }
    var result=nmf(w,w.length,10000);

    for (let i = 0; i < w.length; i++){
        for(let j = 0; j < w[0].length; j++){
            if(!(w[i][j]>0)){
                if(result[i][j]>2){
                    await this.userService.mailRecommendation(trips[j],users[i]);
                    await this.userService.addRecommendation(trips[j],users[i]);
                }
            }
        }
    }
    return;
    }

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

    // Perform the NMF iterations
    
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
  


  export function nmf1(v: number[][], k: number, maxIterations: number) {
    
    let w = new Array(v.length).fill(0).map(() => new Array(k).fill(0));
    for (let i = 0; i < v.length; i++) {
        for (let j = 0; j < k; j++) {
            w[i][j] = Math.random();
        }
    }

    let h = new Array(k).fill(0).map(() => new Array(v[0].length).fill(0));
    for (let i = 0; i < k; i++) {
        for (let j = 0; j < v[0].length; j++) {
            h[i][j] = Math.random();
        }
    }
    
    let maxerror=100000;
    let res=new Array(v.length).fill(0).map(() => new Array(v[0].length).fill(0));
    let check=new Array(v.length).fill(0).map(() => new Array(v[0].length).fill(0));
    check=matrixMultiply(w, h);
    for (let i = 0; i < maxIterations; i++) {
        for (let ii = 0; ii < check.length; ii++) {
            for (let jj = 0; jj < check[0].length; jj++) {
            if (v[ii][jj] > 0) {
                check[ii][jj] = v[ii][jj];
            }
            }
        }
        let w_transpose = transpose(w);
        let h_transpose = transpose(h);
        let num = matrixMultiply(w_transpose, check);
        let den = matrixMultiply(matrixMultiply(w_transpose, w), h);
        h = elementDiv(num, den);
        num = matrixMultiply(check, h_transpose);
        den = matrixMultiply(matrixMultiply(w, h), h_transpose);
        w = elementDiv(num, den);
        check = matrixMultiply(w, h);
        
        
    let error = 0;
    for (let ii = 0; ii < check.length; ii++) {
        for (let jj = 0; jj < check[0].length; jj++) {
            error += Math.pow(v[ii][jj] - check[ii][jj], 2);
        }
    }
    
    // Check for convergence
    if (error < maxerror) {
        res = check;
        maxerror = error;
        if (error < 0.001) {
            break;
        }
    }
}
return res;
  }


