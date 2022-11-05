import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { getHighlighter, Highlighter } from "shiki";
import { unified } from "unified";
import { visit, Visitor, VisitorResult } from "unist-util-visit";

export async function markdownToHtml(md: string) {
  const highlighter = await getHighlighter({
    theme: "dark-plus",
  });

  const result = unified()
    .use(remarkParse)
    .use({
      plugins: [() => replaceCode(highlighter)],
    })
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeStringify, {
      allowDangerousHtml: true,
    })
    .processSync(md);

  return result.value.toString();
}

function isCodeNode(
  node: any
): node is any & { type: string; lang: string; value: string } {
  return (
    node.type === "code" &&
    typeof node.lang === "string" &&
    typeof node.value === "string"
  );
}

function replaceCode(highlighter: Highlighter) {
  const visitor: Visitor = (node: any): VisitorResult => {
    if (!isCodeNode(node)) {
      return;
    }

    const html = highlighter.codeToHtml(node.value, {
      lang: node.lang,
    });

    node.type = "html";
    node.value = html;
  };

  return (tree: any) => {
    visit(tree, visitor);
  };
}
