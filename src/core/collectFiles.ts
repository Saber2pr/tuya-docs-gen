import fs from 'fs-extra';
import { dirname, join, resolve } from 'path';

import * as tp from '@saber2pr/ts-compiler';

import { Lang, parsePage } from './parsePage';

const resolveOutFilePath = (path: string, lang: Lang, outDir: string) =>
  join(outDir, path.replace(/\.tsx$/, lang === 'en' ? '.en.md' : '.md').replace(/\S+\/pages/, ''))

export const collectFiles = async (dir: string, i18nFilePath: string, outDir: string) => {
  const files = await tp.walkFile(dir, entry => {
    const entryDir = dirname(entry.path)
    const isSame = resolve(entryDir) === resolve(dir)
    return !isSame && entry.path.endsWith('.tsx')
  })
  const i18nConfig = await tp.readTsFileExport(i18nFilePath)
  for (const file of files) {
    const createAsset = async (lang: Lang) => ({
      path: resolveOutFilePath(file.path, lang, outDir),
      content: await parsePage(file.path, file.content, i18nConfig, lang)
    })
    const zhMd = await createAsset('zh')
    const enMd = await createAsset('en')
    await fs.outputFile(zhMd.path, zhMd.content)
    await fs.outputFile(enMd.path, enMd.content)
  }
}
