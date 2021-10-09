import { camelCase } from 'camel-case'

export const CamelCase = (str: string) => {
  const result = camelCase(str)
  return result[0].toUpperCase() + result.slice(1)
}
