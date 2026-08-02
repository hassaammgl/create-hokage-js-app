#!/usr/bin/env node

import Main from '../src/main.js';
import { error } from '../src/utils/logger.js';

const app = new Main(process.argv.slice(2));

app.run().catch((err) => {
  error(err.message || String(err));
  process.exitCode = 1;
});
