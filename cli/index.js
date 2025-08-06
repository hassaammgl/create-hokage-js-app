#!/usr/bin/env node

import Main from '../src/main.js';
const args = process.argv.slice(2);

const app = new Main(args);
app.init();
