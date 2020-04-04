## Installation

```sh
sudo apt-get update
sudo apt-get install python-pygraphviz
```

```sh
sudo apt-get install graphviz libgraphviz-dev pkg-config
pip install pygraphviz
```

## Data
Data are from the [SEIRS+ Model](https://github.com/ryansmcgee/seirsplus) Network graph example.

I exported the interaction network graph (`model.G`) and quarantine interaction network graph (`model.Q`) from the [network model demo](https://github.com/ryansmcgee/seirsplus/blob/master/examples/network_model_demo.ipynb) simulation data in [DOT format](https://en.wikipedia.org/wiki/DOT_(graph_description_language)) with:
```py
import pygraphviz
networkx.drawing.nx_agraph.write_dot(model.G, 'model_g.gv')
networkx.drawing.nx_agraph.write_dot(model.Q, 'model_q.gv')
```


## Viz libraries
[VivaGraphJs](https://github.com/anvaka/VivaGraphJS)
- [example](http://www.yasiv.com/graphs#Bai/rw5151)

[GraphViz](https://graphviz.gitlab.io/about/)
- [Wiki](https://en.wikipedia.org/wiki/Graphviz)

