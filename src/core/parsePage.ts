import { parse } from './parser'
import { prettyCode } from '../utils/prettyCode'

export type Lang = 'zh' | 'en'
export type I18nConfig = Record<Lang, { [k: string]: string }>

const stringReg = /Strings\.getLang\(('|")([\s\S]*?)('|")\)/

const stringResolver = (code: string, i18nConfig: I18nConfig, lang: Lang) =>
  code.replace(
    stringReg,
    (arg1, arg2, arg3, arg4) => `"${i18nConfig[lang][arg3]}"`
  )

export const parsePage = async (
  filePath: string,
  content: string,
  i18nConfig: I18nConfig,
  lang: Lang
) => {
  const result = parse(content)
  const demos = result.map(item => ({
    title: stringResolver(item.title, i18nConfig, lang),
    content: stringResolver(item.content, i18nConfig, lang),
  }))
  return demos
    .map(
      item =>
        `### ${item.title.replace(/"/g, '')}\n\n\`\`\`tsx\n${prettyCode(
          item.content
        )}\`\`\`\n\n`
    )
    .join('\n')
}
