let number = [1, 400, 12, 34];
let i = 0;
let total = 0;

while (i < number.length) {
    total = total + number[i];
    i = i + 1;
}
console.log(`total : ${total}`);