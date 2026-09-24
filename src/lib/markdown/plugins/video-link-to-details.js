// Derived from https://github.com/jaywcjlove/rehype-video/tree/main/src (as in @hackclub/markdown)

import { visit } from 'unist-util-visit';

// TODO improve regex
const videoTest = /^(https?:\/\/[^\s]+(\.mp4|\.mov))$/;

export function detailsNode(title, src) {
  return {
    type: 'element',
    tagName: 'details',
    properties: { open: true, className: 'details-video' },
    children: [
      {
        type: 'element',
        tagName: 'summary',
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: 'details-video-summary' },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: 'details-video-caret' },
                children: []
              },
              {
                type: 'element',
                tagName: 'svg',
                properties: {
                  'aria-hidden': true,
                  height: 16,
                  width: 16,
                  viewBox: '0 0 16 16',
                  version: '1.1',
                  className: 'video-summary-camera-icon'
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'path',
                    properties: {
                      'fill-rule': 'evenodd',
                      d: 'M16 3.75a.75.75 0 00-1.136-.643L11 5.425V4.75A1.75 1.75 0 009.25 3h-7.5A1.75 1.75 0 000 4.75v6.5C0 12.216.784 13 1.75 13h7.5A1.75 1.75 0 0011 11.25v-.675l3.864 2.318A.75.75 0 0016 12.25v-8.5zm-5 5.075l3.5 2.1v-5.85l-3.5 2.1v1.65zM9.5 6.75v-2a.25.25 0 00-.25-.25h-7.5a.25.25 0 00-.25.25v6.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-4.5z'
                    },
                    children: []
                  }
                ]
              },
              {
                type: 'element',
                tagName: 'span',
                properties: {
                  'aria-label': `${title}`
                },
                children: [
                  {
                    type: 'text',
                    value: title || ''
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'element',
        tagName: 'video',
        properties: {
          src: src,
          muted: 'muted',
          controls: 'controls',
          style: 'max-height:640px;'
        },
        children: []
      }
    ]
  };
}

function nodeToDetails(node, src) {
  const filename = src.split('/').pop();
  const newNode = detailsNode(filename, src);
  for (const k in newNode) node[k] = newNode[k];
}

const videoLinkToDetails = () => {
  const nodeTest = (node) => {
    const child = node.children && node.children[0];
    const grandChild = child && child.children && child.children[0];
    return (
      node.tagName === 'p' &&
      node.children.length === 1 &&
      child.tagName === 'a' &&
      child.children.length === 1 &&
      grandChild.type === 'text' &&
      videoTest.test(grandChild.value)
    );
  };

  return (tree) => {
    visit(tree, nodeTest, (node) => {
      const grandchild = node.children[0].children[0];
      nodeToDetails(node, grandchild.value);
    });
  };
};

export default videoLinkToDetails;