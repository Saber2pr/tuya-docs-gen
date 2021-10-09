import { traverser } from '@saber2pr/ts-compiler'
import ts from 'typescript'

const parseListViewDemos = (rets: ts.ReturnStatement[]) => {
  const lastRet = rets[rets.length - 1]
  const ListView = traverser.findJsxElementByTagName(lastRet, 'ListView')[0]

  if (ListView) {
    const attrs = traverser.findJsxAttribute(ListView)
    const list = attrs.filter(attr => attr.getText().startsWith('list='))[0]
    const obJs = traverser.findObjectLiteralExpression(list)
    return obJs.reduce((acc, obj) => {
      const props = traverser.findPropertyAssignment(obj)
      const title = props.find(prop => prop.getText().startsWith('title:'))
      const content = props.find(prop => prop.getText().startsWith('content:'))
      if (title && content) {
        return acc.concat({
          title: title.getChildAt(2).getText(),
          content: content.getChildAt(2).getText(),
        })
      }
      return acc
    }, [] as Array<{ title: string; content: string }>)
  }

  return []
}

export function parse(content: string) {
  const root = traverser.createAstNode(content)
  const exported = traverser.findExportAssignment(root)[0]
  if (exported) {
    const returnJSXs = traverser.findReturnStatement(exported)
    const listViewDemos = parseListViewDemos(returnJSXs)
    return listViewDemos
  }
  return []
}
