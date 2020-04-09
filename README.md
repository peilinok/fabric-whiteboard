# fabric-whiteboard

This is a whiteboard react component base on fabricjs.

<br/>

### ScreenShots

![](screenshots/1.png)

<br/>

### Features

- Draw ink with pressure (when using a pen with pen pressure).
- Freely drag the palette.
- Arrow,Square,Ellipse,Line,Select,Erase,RayPen modes support.
- Text input mode support

<br/>

### Todo

- Adjust the size of brush.
- Select colors by simply clicks.
- Get|Set all objects in json

<br/>

### Instal

```sh
$ npm install fabric-whiteboard

# or

$ yarn add fabric-whiteboard
```

<br/>

### Usage

```js
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'select',
      size: {
        width: '800px',
        height: '800px',
      },
    }

    this.calcBoundsSize = this.calcBoundsSize.bind(this)

    this.handleOnModeClick = this.handleOnModeClick.bind(this)
    this.handleBoundsSizeChange = this.handleBoundsSizeChange.bind(this)
  }

  componentDidMount() {
    //this.calcBoundsSize()

    window.addEventListener('resize', this.handleBoundsSizeChange)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleBoundsSizeChange)
  }

  render() {
    const { mode, size } = this.state
    return (
      <div className="App" id="App">
        <WhiteBoard
          size={size}
          showToolbar={true}
          showBoard={true}
          mode={mode}
          onModeClick={this.handleOnModeClick}
        />
      </div>
    )
  }

  calcBoundsSize() {
    const dom = document.getElementById('App')
    const domStyle = window.getComputedStyle(dom)

    this.setState({
      size: {
        width: domStyle.width,
        height: domStyle.height,
      },
    })
  }

  handleOnModeClick(mode) {
    this.setState({
      mode: mode,
    })
  }

  handleBoundsSizeChange() {
    this.calcBoundsSize()
  }
}
```
