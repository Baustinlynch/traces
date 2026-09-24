import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const CALLOUT_REGEX = /^\[!([a-zA-Z-]+)\](?:\s*([+-]))?\s*(.*)$/;
const IMAGE_SIZE_REGEX = /^(.+?)\s*=\s*(\d+)\s*x\s*(\d+)$/i;

function wikilinkNodes(value, docLookup) {
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = WIKILINK_REGEX.exec(value))) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
    }
    const target = match[1].trim();
    const alias = (match[2] ?? target).trim();
    const doc = docLookup.get(target.toLowerCase());
    const href = doc ? doc.href : '/docs';
    nodes.push({
      type: 'link',
      url: href,
      children: [{ type: 'text', value: alias }]
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: 'text', value: value.slice(lastIndex) });
  }

  return nodes;
}

export function remarkWikilink(docs) {
  const docLookup = new Map(
    docs.map((doc) => [doc.title.toLowerCase(), doc])
  );

  return (tree) => {
    const replacements = [];
    visit(tree, 'text', (node, index, parent) => {
      if (node.value && node.value.includes('[[')) {
        replacements.push({ parent, index, value: node.value });
      }
    });

    for (const { parent, index, value } of replacements.reverse()) {
      parent.children.splice(index, 1, ...wikilinkNodes(value, docLookup));
    }
  };
}

export function remarkCallout() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      const first = node.children && node.children[0];
      if (!first || first.type !== 'paragraph') return;

      const firstText = first.children && first.children[0];
      if (!firstText || firstText.type !== 'text') return;

      const lines = firstText.value.split('\n');
      const match = lines[0].match(CALLOUT_REGEX);
      if (!match) return;

      const type = match[1].toLowerCase();
      const rest = match[3] || '';
      const tail = first.children.slice(1);
      let title = rest.trim();
      if (!title && tail.length) {
        title = toString({ type: 'paragraph', children: tail }).trim();
      }
      if (!title) title = type;

      // Body: the rest of the first text node after the marker line, the rest
      // of the first paragraph, and every remaining blockquote child.
      const bodyChildren = [];
      const remainder = lines.slice(1).join('\n');
      const restChildren = tail.slice();

      if (remainder) {
        if (restChildren.length && restChildren[0].type === 'text') {
          restChildren[0] = {
            ...restChildren[0],
            value: `${remainder}\n${restChildren[0].value}`
          };
        } else {
          restChildren.unshift({ type: 'text', value: remainder });
        }
      }

      if (restChildren.length) {
        bodyChildren.push({ type: 'paragraph', children: restChildren });
      }
      bodyChildren.push(...node.children.slice(1));

      const callout = {
        type: 'callout',
        children: bodyChildren,
        data: { calloutType: type, title }
      };

      if (typeof index === 'number') parent.children[index] = callout;
    });
  };
}

export function calloutHandler(state, node) {
  const type = (node.data && node.data.calloutType) || 'note';
  const title = (node.data && node.data.title) || type;

  const result = {
    type: 'element',
    tagName: 'div',
    properties: { className: ['callout', `callout-${type}`] },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-title'] },
        children: [{ type: 'text', value: title }]
      },
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-body'] },
        children: state.all(node)
      }
    ]
  };

  state.patch(node, result);
  return state.applyData(node, result);
}

export function rehypeTracesExtensions() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const props = node.properties;

      if (node.tagName === 'img') {
        if (!props || !props.src) return;
        const src = String(props.src);
        const size = src.match(IMAGE_SIZE_REGEX);
        if (size) {
          props.src = size[1];
          props.width = size[2];
          props.height = size[3];
        }
        props.loading = 'lazy';
      }

      if (node.tagName === 'input') {
        if (!props || props.type !== 'checkbox') return;
        props.className = 'task-list-item-checkbox';
      }

      if (node.tagName === 'a') {
        if (!props) return;
        if (props.className === 'external') {
          props.target = '_blank';
          props.rel = 'noopener';
        }
      }
    });
  };
}