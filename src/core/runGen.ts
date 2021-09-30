import { join } from 'path';

import { verifyRequired } from '../utils/verifyRequired';
import { collectFiles } from './collectFiles';

export interface RunGenOps {
  cwd: string
  out: string
}

const required: RunGenOps = {
  cwd: 'cwd is required',
  out: 'out is required',
}

export const runGen = (ops: RunGenOps) => {
  if (ops.cwd && ops.out) {
    const srcPath = join(ops.cwd, 'src')
    return collectFiles(join(srcPath, 'pages'), join(srcPath, 'i18n', 'strings.ts'), ops.out)
  } else {
    verifyRequired(ops, required)
  }
}