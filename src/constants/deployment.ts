export const STAGES = Object.freeze({
  LOGIN: 'login',
  GENERATE_REPO: 'generate-repo',
  ENABLE_PAGES: 'enable-pages',

  PUSH_CONTENT: 'push-content',
  BUILD: 'build',
} as const);

export const DEFAULT_BRANCH = 'main';

export const CREATE_STRATEGY = Object.freeze([
  STAGES.LOGIN,
  STAGES.GENERATE_REPO,
  STAGES.ENABLE_PAGES,
  STAGES.PUSH_CONTENT,
  STAGES.BUILD,
] as const);

export const UPDATE_STRATEGY = Object.freeze([STAGES.LOGIN, STAGES.PUSH_CONTENT, STAGES.BUILD] as const);

export const STAGE_LABELS = Object.freeze({
  [STAGES.LOGIN]: 'Sign In to GitHub',
  [STAGES.GENERATE_REPO]: 'Create a new repository',
  [STAGES.ENABLE_PAGES]: 'Set Up GitHub Actions',
  [STAGES.PUSH_CONTENT]: 'Upload content files to GitHub',
  [STAGES.BUILD]: 'Build a website',
});

export const INDICATORS = Object.freeze({
  PENDING: 0,
  PROCESSING: 1,
  SUCCESS: 2,
  ERROR: 3,
} as const);

export const MODES = Object.freeze({
  CREATE: 'create',
  PROGRESS: 'progress',
  UPDATE: 'update',
} as const);
