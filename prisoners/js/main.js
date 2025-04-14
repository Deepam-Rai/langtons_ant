import { Tokens } from "./tokens.js";
import { drawBar, drawDoughnut } from "./graph.js";
import { getRandomUniqueIntegers } from "./utils.js";

Chart.plugins.register(ChartDataLabels);

const meta = {
    "tokens": null,
    "configs": {
        "n": 10,
        "timestep": 50 // ms
    },
    "stats": {
        "A": {
            "buckets": [],
            "allPassCount": 0
        },
        "B": {
            "buckets": [],
            "allPassCount": 0
        }
    },
    "simulation": null,
    "iterations": 0,
}

meta.stats.A.buckets = Array.from({length: meta.configs.n+1}, (_, i) => 0);
meta.stats.B.buckets = Array.from({length: meta.configs.n+1}, (_, i) => 0);

function iterate() {
    // new config of token boxes
    meta.tokens = new Tokens( meta.configs.n);

    let n = meta.configs.n;
    // Group A: Random guess strategy
    let APassCount = 0;
    for(let i=1; i<=n; ++i) {
        const choices = getRandomUniqueIntegers(n/2, n);
        for(const choice of choices){
            if (meta.tokens.getToken(choice) === i) {
                APassCount++;
                break;
            }
        }
    }
    meta.stats.A.buckets[APassCount]++;
    if (APassCount === n) {
        meta.stats.A.allPassCount++;
    }
    // Group B: Cycle-following strategy
    let BPassCount = 0;
    for(let i=1; i<=n ; ++i){
        const triesRequired = meta.tokens.getCycleTries(i);
        const triesPresent = n/2;
        if (triesRequired <= triesPresent){
            BPassCount++;
        }
    }
    meta.stats.B.buckets[BPassCount]++;
    if (BPassCount === n) {
        meta.stats.B.allPassCount++;
    }
}

function updateUi() {
    drawBar("APassCountDistribution", meta.stats.A.buckets, "Pass Count per Iteration Distribution")
    const aPass = meta.stats.A.allPassCount / meta.iterations * 100;
    drawDoughnut("AAllPassDistribution", aPass, 100-aPass, "All Pass Distribution");
    drawBar("BPassCountDistribution", meta.stats.B.buckets, "Pass Count per Iteration Distribution")
    const bPass = meta.stats.B.allPassCount / meta.iterations * 100;
    drawDoughnut("BAllPassDistribution", bPass, 100-bPass, "All Pass Distribution");
}

function run() {
    iterate();
    meta.iterations++;
    updateUi();
}

meta.simulation = setInterval( run, meta.configs.timestep);
