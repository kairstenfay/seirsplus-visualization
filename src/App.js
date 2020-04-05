import React, {useState, useEffect} from 'react';
import dot from 'ngraph.fromdot'
import Viva from 'vivagraphjs'
import styled from "styled-components"
import * as d3 from 'd3'
import constants from './constants'
import './App.css';
import questionMark from "./question-mark.png"

const TOOLTIP_WIDTH = 200
const TOOLTIP_PADDING = 10

const Tooltip = styled.p`
  width: ${TOOLTIP_WIDTH}px;
  background-color: black;
  color: white;
  border-radius: 5px;
  padding: ${TOOLTIP_PADDING}px;
  font-size: 12px;
`

function App() {

  const defaultLayout = {
    springLength: 30,
    springCoeff: 0.0008,
    gravity: -1.2,
    theta: 0.8,
    dragCoeff: 0.02,
    timeStep : 20,
  }

  const mouseOverText = {
    springLength: "Ideal length for links (springs in physical model) in pixels.",
    springCoeff: "Hook's law coefficient. 1 - solid spring. A smaller number loosens edge lengths.",
    gravity: "Coulomb's law coefficient. It's used to repel nodes thus should be negative.",
    theta: `Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
      The closer it's to 1 the more nodes algorithm will have to go through.
      Setting it to one makes Barnes Hut simulation no different from brute-force forces calculation (each node is considered).`,
    dragCoeff: `Drag force coefficient. Used to slow down system, thus should be less than 1.
      The closer it is to 0 the less tight system will be.`,
    timeStep: "Default time step (dt) for forces integration",
  }

  const [graphName, setGraphName] = useState('modelG')
  const [graph, setGraph] = useState(dot(constants[graphName]))
  const [layoutSettings, setLayoutSettings] = useState(defaultLayout)
  const [tooltipStyles, setTooltipStyles] = useState({display: "none"})
  const [tooltipText, setTooltipText] = useState()

  useEffect(() => {
    setGraph(dot(constants[graphName]))
  }, [graphName])

  useEffect(() => {
    // The surefire way I know how to remove elements from the DOM by attribute
    d3.select('canvas').remove()

    var graphics = Viva.Graph.View.webglGraphics();

    // See all values you can tune in this file:
    // https://github.com/anvaka/ngraph.physics.simulator/blob/master/index.js#L12
    var layout = Viva.Graph.Layout.forceDirected(graph, layoutSettings)

    var renderer = Viva.Graph.View.renderer(graph,
      {
        graphics: graphics,
        layout: layout,
      })
    renderer.run()
  }, [graph, layoutSettings])

  const Nodes = () => (
    <table>
      <tbody>
        <tr>
          <th>Nodes:</th>
          <td>{graph.getLinksCount()}</td>
        </tr>
        <tr>
          <th>Edges:</th>
          <td>{graph.getNodesCount()}</td>
        </tr>
      </tbody>
    </table>
  )

  async function handleChange(event) {
    const target = event.target
    await new Promise(r => setTimeout(r, 1000))
    const value = Number(target.value)

    if (!!value) {
      const newSettings = {}
      newSettings[`${target.id}`] = value
      setLayoutSettings({...layoutSettings, ...newSettings})
    }
  }

  const handleHelpHover = (event) => {
    const x = event.target.x - TOOLTIP_WIDTH - TOOLTIP_PADDING * 2
    const y = event.target.y - event.target.height / 2
    const styles = {
      position: "absolute",
      top: y,
      left: x,
    }
    setTooltipText(mouseOverText[event.target.parentNode.control.id])
    setTooltipStyles(styles)
  }

  const handleHelpHoverExit = () => {
    setTooltipStyles({display: "none"})
  }

  const GraphForm = () => (
    <>
      <div className="layout-settings">
        <input type="radio"
          id="modelG"
          name="model"
          value="modelG"
          checked={graphName === 'modelG'}
          onChange={() => setGraphName('modelG')} />
        <label htmlFor="modelG">Interaction (modelG)</label>
      </div>

      <div className="layout-settings">
        <input type="radio"
          id="modelQ"
          name="model"
          value="modelQ"
          checked={graphName === 'modelQ'}
          onChange={() => setGraphName('modelQ')} />
        <label htmlFor="modelQ">Quarantine interaction (modelQ)</label>
      </div>
    </>
  )

  const SettingsForm = () => (
    <form className="layout-settings">

      { Object.keys(layoutSettings).map(setting => (
        <div key={setting}
          className="layout-settings">
          <label htmlFor={setting}>
            <img src={questionMark}
              alt="help"
              onMouseEnter={handleHelpHover}
              onMouseLeave={handleHelpHoverExit}/>
              {setting}:
          </label>
          <input name="layout-settings"
            id={setting}
            defaultValue={layoutSettings[setting]}
            onChange={handleChange} />
        </div>
      ))}
    <button name="layout-settings"
      type="button"
      onClick={() => setLayoutSettings(defaultLayout)}
      >
      Reset to default
    </button>

    </form>
    )

  return (
    <div>
      <h1>
        <a href="https://github.com/ryansmcgee/seirsplus">SEIRS+ Model</a> Simulation Data
      </h1>
      <div id="controls">
        <h2>Network Graph</h2>
        <GraphForm />

        <h2>Layout Settings</h2>
        <SettingsForm />

        <Nodes />
        <Tooltip id="tooltip" style={tooltipStyles}>
          {tooltipText}
        </Tooltip>
      </div>
      <p>
        Inspired by <a href="http://www.yasiv.com/graphs#">yasiv.com</a>
      </p>
    </div>
  );
}

export default App;
