

export class Tokens {
    constructor(n) {
        this.n = n;  // count of tokens
        this.boxes = this.fillBoxes();
    }

    fillBoxes() {
        // Fills this.n boxes with values 1,2,3,...,this.n 
        const arr = Array.from({length: this.n}, (_, i) => i+1);
        // swap the values
        for (let i = this.n-1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    getToken(i) {
        // gets token in i'th box where 1<= i <= this.n
        return this.boxes[i-1];
    }

    getCycleTries(t) {
        // Returns the length of the cycle to which token t belongs
        // Cycle: Sequence of boxes b1, b2, b3,...,b1  such that box bi contains token b(i+1)
        // cycle tries: Number of boxes in the cycle needed to open to get their token
        let l = 1, box=t;
        while( this.getToken(box) !== t) {
            box = this.getToken(box);
            l++;
        }
        return l;
    }
}