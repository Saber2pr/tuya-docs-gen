import consola from 'consola';

export const verifyRequired = <T extends object>(input: T, config: T) => {
  const meta = { ...config }
  for (const key in input) {
    delete meta[key]
  }
  if (Object.keys(meta).length) {
    consola.error(`Params Required:`, meta)
  }
}