export const logger = {
  INFO: console.log,
  ERROR: console.trace,
};

function log(level: keyof typeof logger, ...args: any[]) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] instanceof Error) {
      args[i] = args[i].stack;
    }
  }
  const f = logger[level];
  const now = new Date();
  f(`[${level}] ${now.toISOString()} ${args.map(String).join(' ')}`);
}

function info(...args: any[]) {
  log('INFO', ...args);
}

function error(...args: any[]) {
  log('ERROR', ...args);
}

export default {
  info,
  error,
};
