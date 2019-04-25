# lightning

[demo](https://guljeny.github.io/lightning/) | [npm-package](https://www.npmjs.com/package/lightning-vi)

`npm i lightning-vi --save`

`import Lightning from 'lightning-vi'`

```javascript
new Lightning(document.querySelector("selector"))
```

or with options
```javascript
const options = {
  sectionCount: 30, // count of curve parts
  color: "#ff0000", // line color
  lineWidth: 4, // width of main line
  offset: 5, // top & bottom paddings
  speed: 0.17, // speed to change curves
  bloom: 4, // blur radius
  bloomColor: "#ffe6e6", // bloom color
  bloomWidth: 12, // bloom line width
  levels: 7, // independent parts of the curve 
}

new Lightning(document.querySelector("selector"), options)
```
