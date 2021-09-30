import prettier from 'prettier';

export const prettyCode = (code: string) => {
  code = prettier.format(code, {
    parser: 'typescript',
    semi: false,
  })

  code = code.replace(/^;/, '')

  return code
}