# Code Blocks

## JavaScript

```js
function greet(name) {
  return `Hello, ${name}!`;
}

const people = ['Alice', 'Bob'];
people.map((p) => greet(p)).forEach((msg) => console.log(msg));
```

## Arduino (C++)

```cpp
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(500);
  digitalWrite(ledPin, LOW);
  delay(500);
}
```

## CSS

```css
.callout-note {
  --callout-color: #448aff;
  border-left: 4px solid var(--callout-color);
}
```

## JSON

```json
{
  "slug": "test-code-blocks",
  "route": "docs/Testing/Test Code Blocks",
  "hidden": false
}
```

## Python

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])
```

## Bash

```bash
npm run dev
git status
git log --oneline -5
```

## Markdown (self-referential)

```md
# Markdown inside Markdown

- [x] meta!
- [ ] list!
```

## Plain text (no language)

```
This block has no specified language.
It should fall back to plain text highlighting.
```

## Inline code

Use `const result = await api.call()` inline, or `npm run build`.

## Escaped fenced blocks

````txt
To write a fenced block with three backticks, use four:
```js
console.log('nested');
```
````