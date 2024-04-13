import hljs from 'highlight.js'
import { marked } from 'marked'

export const markedRenderer = marked
marked.setOptions({
  highlight: function (code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  },
})
