const fs = require('fs');

const ws = fs.createWriteStream('../public/index.txt', {
    highWaterMark: 3
});

