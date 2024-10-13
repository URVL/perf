
const config = {
    count: 10,
    charsUntil: 800000,
    runCount: 40
}


if (process.argv[2]) {
    config.count = +process.argv[2];
}

const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+[{(&=)}]*!|`%#\\";
console.log("max", str.length);

const strFnToUse = createString;


function randomCreateString(count, charsUntil) {
    let substr = str.substring(0, count - 1);
    let noRepeat = str.substring(0, count);

    let i = 0;
    let innerCount = 0;
    let rand = Math.floor(Math.random() * count - 1);

    return function() {
        i++;
        innerCount++;
        if (i < charsUntil) {
            if (innerCount === rand) {
                innerCount = 0;
                rand = Math.floor(Math.random() * count - 1);
            }
            return substr[innerCount];
        } else {
            return noRepeat[i % count];
        }
    };
}

function createString(count, charsUntil) {
    let substr = str.substring(0, count - 1);
    let noRepeat = str.substring(0, count);

    let i = 0;

    return function() {
        i++;
        if (i < charsUntil) {
            return substr[i % (count - 1)];
        } else {
            return noRepeat[i % count];
        }
    };
}


function findWithSet(iter, count) {
    let set = new Set();
    let runs = 0;

    while (set.size < count) {
        runs++;
        const char = iter();
        const len = set.size;

        set.add(char);
        if (set.size === len) {
            set = new Set();
            set.add(char);
        }
    }

    return runs;
}


function findWithArray(iter, count) {
    /** @type {string[]} */
    let arr = [];
    let runs = 0;

    while (arr.length < count) {
        runs++;
        const char = iter();
        if (arr.includes(char)) {
            arr = [];
        }

        arr.push(char);
    }

    return runs;
}

const THRESHOLD = 50;
const USE_VARIANT = THRESHOLD <= config.count ? 'set' : 'array';


function findAdapted(iter, count) {
    if (USE_VARIANT === 'set') return findWithSet(iter, count);
    return findWithArray(iter, count);
}


function run(fn) {

    const runs = [];

    for (let i = 0; i < config.runCount; ++i) {
        const gen = strFnToUse(config.count, config.charsUntil);
        const start = Date.now();
        const c = fn(gen, config.count);
        const runtime = Date.now() - start;
        runs.push([runtime, c]);
    }

    return runs;
}


function printStats(name, values) {
    const [time, totalRuns] = values.reduce((acc, [time, runs]) => {
        acc[0] += time;
        acc[1] += runs;
        return acc;
    }, [0, 0]);

    console.log(`${name} total time ${time} ms, total runs ${totalRuns}, runs / time ${Math.round(totalRuns / time)}`);
}

function runAll() {
    console.log(`Using [${USE_VARIANT}] for count ${config.count}`);
    printStats(`Adapted [${USE_VARIANT}]: `, run(findAdapted));
    console.log('\n');
    printStats("[set]: ", run(findWithSet));
    printStats("[array]: ", run(findWithArray));
}

runAll();
