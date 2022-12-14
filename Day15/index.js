const utils = require('../utils');

class elements {
    static air = " ";
    static sensor = "S";
    static beacon = "B";
    static signal = "#";
}

function Parser(file) {
    let fileRows = utils.read(file).split('\n');
    var data = []
    for (const row of fileRows) {
        let split = row.split(": closest beacon is at ");
        split[0] = split[0].split("Sensor at ")[1];
        let sensor = split[0].split(",").map(i => parseInt(i.trim().slice(2)));
        let beacon = split[1].split(",").map(i => parseInt(i.trim().slice(2)));
        data.push([...sensor, ...beacon]);
    }
    return { waypoints: data }
}

function checkSignal(waypoints, row) {
    let valid = new Set();
    for (const data of waypoints) {
        let [Sx, Sy, Bx, By] = data;
        let dist = Math.abs((Sx - Bx)) + Math.abs((Sy - By));
        for (let y = dist * -1; y < dist + 1; y++) {
            let SignalY = Sy + y;
            if (SignalY != row) continue;
            for (let x = Math.abs(y) - dist; x < dist - Math.abs(y) + 1; x++) {
                let SignalX = Sx + x;
                if (waypoints.filter(i => (i[0] == SignalX && i[1] == SignalY) || (i[2] == SignalX && i[3] == SignalY)).length)
                    continue
                if (SignalY == row) valid.add(SignalX);
            }
        }
    }
    return valid.size;
}

function isCovered(waypoints, y, x) {
    for (const data of waypoints) {
        let [Sx, Sy, Bx, By] = data;
        let dist = Math.abs(Sx - Bx) + Math.abs(Sy - By);
        let dist2 = Math.abs(Sx - x) + Math.abs(Sy - y);
        if (dist2 <= dist) return true;
    }
    return false;
}


function PartOne({ waypoints }, row) {
    return checkSignal(waypoints, row);
}

function PartTwo({ waypoints }, limit) {
    let minX = Math.min(...waypoints.flatMap(i => [i[0], i[2]]));
    let minY = Math.min(...waypoints.flatMap(i => [i[1], i[3]]));
    for (let y = minY < 0 ? 0 : minY; y < limit; y++) {
        for (let x = minX < 0 ? 0 : minX; x < limit; x++) {
            if (!isCovered(waypoints, y, x)) return [x, y];
        }
    }
}

// TESTS
// let testInput = Parser("test.txt");
// utils.test("Test 1", PartOne(testInput, 10), 26);
testInput = Parser("test.txt");
utils.test("Test 2", PartTwo(testInput, 20), 56000011);

// ANSWER
// let input = Parser("input.txt");
// console.log("Part 1 solution: " + PartOne(input, 2000000)); // 5100463
input = Parser("input.txt");
console.log("Part 2 solution: " + PartTwo(input, 4000000)); // 
