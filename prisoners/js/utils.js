
export function getRandomUniqueIntegers(k, n) {
    // Returns k unique integers from 1 to n. Here 1<= k <=n
    const arr = Array.from({length: n}, (_, i) => i+1);
    // Fisher-Yates shuffle
    for(let i=n-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0,k);
}
