const fs = require('fs')
 

 
// Write data in 'Output.txt' .
fs.writeFile('Output.txt', "aaaa", (err) => {
    if (err) throw err;
})