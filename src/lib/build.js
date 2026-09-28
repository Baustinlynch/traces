const raw = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : 'dev';

export const buildId = raw;

export const buildLabel = raw === 'dev' ? 'dev build' : `built from commit ${raw}`;
