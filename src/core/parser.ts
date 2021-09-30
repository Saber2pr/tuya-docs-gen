import $ from 'gogocode';

type AstNode = ReturnType<typeof $>

export class Parser {
  private result: { title: string, content: string }[] = []
  // match
  private matchTitle(ast: AstNode) {
    return ast.find(`title: $_$1`)
  }
  private matchContent(ast: AstNode) {
    return ast.find(`content: $_$1`)
  }
  private matchItem(ast: AstNode) {
    return ast.find(`{ title: $_$1, content: $_$2 }`)
  }

  // apply
  private applyTitle(ast: AstNode) {
    const title = ast.generate().replace(/^title:/, '').trim()
    return title
  }
  private applyContent(ast: AstNode) {
    return ast.generate().replace(/^content:/, '').trim()
  }
  private applyItem(ast: AstNode) {
    const title = this.applyTitle(this.matchTitle(ast))
    const content = this.applyContent(this.matchContent(ast))
    return {
      title,
      content
    }
  }

  private scan(code: string) {
    const item = this.matchItem($(code))
    if (!item[0]) return
    const result = this.applyItem(item)
    this.result.push(result)
    return code.slice(0, item.node.start) + '{}' + code.slice(item.node.end)
  }

  parse(code: string) {
    while (code) {
      code = this.scan(code)
    }
    return this.result
  }
}