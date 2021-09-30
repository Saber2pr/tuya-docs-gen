import path from 'path';

import { prettyCode } from '../utils/prettyCode';
import { Parser } from './parser';

export type Lang = 'zh' | 'en'
export type I18nConfig = Record<Lang, { [k: string]: string }>

const stringReg = /Strings\.getLang\(('|")([\s\S]*?)('|")\)/

const stringResolver = (code: string, i18nConfig: I18nConfig, lang: Lang) =>
  code.replace(stringReg, (arg1, arg2, arg3, arg4) => `"${i18nConfig[lang][arg3]}"`)

export const parsePage = async (filePath: string, content: string, i18nConfig: I18nConfig, lang: Lang) => {
  const parser = new Parser()
  const result = parser.parse(content)
  const demos = result.map(item => ({ title: stringResolver(item.title, i18nConfig, lang), content: stringResolver(item.content, i18nConfig, lang) }))

  const parsed = path.parse(filePath)
  const name = parsed.name
  const group = path.basename(parsed.dir)
  const demo = filePath.replace(/\S+docs/, '').replace(/\.tsx$/, '')

  return demos.map(item => `### ${item.title.replace(/"/g, '')}\n\n\`\`\`tsx\n${prettyCode(item.content)}\`\`\`\n\n`).join('\n')
}