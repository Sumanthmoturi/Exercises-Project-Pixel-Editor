// The original PixelEditor class, extended to handle keyboard input.
class PixelEditor {
    constructor(state, config) {
      let { tools, controls, dispatch } = config;
      this.state = state;
      this.canvas = new PictureCanvas(state.picture, pos => {
        let tool = tools[this.state.tool];
        let onMove = tool(pos, this.state, dispatch);
        if (onMove) {
          return pos => onMove(pos, this.state, dispatch);
        }
      });
      this.controls = controls.map(Control => new Control(state, config));
      //1. Create the editor's main element with tabIndex to make it focusable
      this.dom = elt("div", { tabIndex: 0 }, this.canvas.dom, elt("br"),
                     ...this.controls.reduce((a, c) => a.concat(" ", c.dom), []));
      
      //2. Register the keydown event handler
      this.dom.addEventListener("keydown", event => this.handleKey(event, tools, dispatch));
    }
  
    //3. Method to handle keyboard events
    handleKey(event, tools, dispatch) {
      if (event.shiftKey) return;   //Ignore shift key
        if (event.key.length === 1) {   //first letter of tool name
            for (let tool in tools) {
                if (event.key === tool[0]) {
                    dispatch({ tool });
                    event.preventDefault(); // Prevent default browser action
                    return;
          }
        }
      }
  
      // 4.Handle undo (Ctrl+Z or Cmd+Z)
      if ((event.ctrlKey || event.metaKey) && event.key === "z") {
        dispatch({ undo: true });
        event.preventDefault(); // Prevent default browser action
      }
    }
  
    syncState(state) {
      this.state = state;
      this.canvas.syncState(state.picture);
      for (let ctrl of this.controls) ctrl.syncState(state);
    }
  }
  
  // 5.Create and append the editor to the page
  document.querySelector("div")
    .appendChild(startPixelEditor({}));
  