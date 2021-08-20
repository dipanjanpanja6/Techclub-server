const fs = require("fs");
const path = require("path");

const envFile = `
FIREBASE_API_KEY =
FIREBASE_AUTHDOMAIN = 
FIREBASE_DATABASE = 
FIREBASE_API_ID =
FIREBASE_MEASUREMENTID =
`;

fs.writeFileSync(path.join(process.cwd(), ".env"), envFile);
