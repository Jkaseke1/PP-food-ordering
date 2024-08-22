
const crypto = require('crypto');

// Generate a random 64-byte secret and convert it to a hexadecimal string
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Output the generated JWT secret
console.log(`Generated JWT Secret: ${jwtSecret}`);
