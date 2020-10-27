var express = require('express');
var app = express();
const fs = require('fs');
const crypto = require('crypto');
const cpuCount = require('os').cpus().length;
const workerpool = require('workerpool');
const pool = workerpool.pool();

// process.env.NODE_ENV = process.env.environment || "PROD";
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// either increase thread pool size or use workerpool
process.env.UV_THREADPOOL_SIZE = cpuCount;
console.log("POOL ", process.env.UV_THREADPOOL_SIZE)
// const PORT = 3000;


var count = 0;
//ASYNC
app.get('/async', async (req, res) => {
    // console.log("LOOP")
    let resp = await doIt(count++);
    res.json(resp)
});

// //SYNC
app.get('/sync', (req, res) => {
    // let resp = doItSYNC(count++)
    count++;
    console.log(`READ START${count}`);
    // fs.readFileSync('test.txt')
    let rest = crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
    console.log(`READ COMP${count}`);
    res.json(`DONE`)

});

function doIt(count) {
    return new Promise((resolve, reject) => {
        console.log(`READ START${count}`);

        crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
            console.log(`READ COMP${count}`);
            resolve(`DONE${count}`)
        });

        // fs.readFile('test.txt', () => {
        //     console.log(`READ COMP${count}`);
        //     resolve(`DONE${count}`)
        // })
    })
}






app.get("/workerloop", async (req, res, next) => {
    // console.log("LOOP")
    // console.log(`LOOP START${count}`);
    let result = await pool.exec(forLoop, [count++])
    // let det = await forLoop(count);

    res.json(result)
})

app.get("/loop", async (req, res, next) => {
    // console.log("LOOP")

    // let result = await pool.exec(forLoop, [count])
    let det = await forLoop(count++);

    res.json(det)
})

function forLoop(count) {
    return new Promise((resolve, reject) => {
        console.log(`LOOP START${count}`);
        for (let i = 0; i < 5000000000; i++) {

        }
        console.log(`LOOP END${count}`);
        resolve(new Date())
    })


}

console.log("ENV", process.env.NODE_ENV);

let server = app.listen(9091, () => {
    console.log("Strted on 9091")
})