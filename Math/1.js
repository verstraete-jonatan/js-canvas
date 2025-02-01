
// algortim reauires to have some prime numbers to start with. Only works starting from prime 5
const primes = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29,]
let index = 3



let iter = 0
// prime n = (prime[n-3] + prime[n-4] + prime[n-5])
// or: prime[n+4] = prime[n] + prime[n+1] + prime[n+2]
while(++iter < 1000) {
    primes[index+4] =  sum([...primes.slice(index, index+3)])
    index++
}

console.log([...primes])