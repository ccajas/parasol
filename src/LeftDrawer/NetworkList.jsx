import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

import {List, ListItem, makeSelectable} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import IconRefresh from 'material-ui/svg-icons/navigation/refresh';
import IconDownload from 'material-ui/svg-icons/file/file-download';
import IconSave from 'material-ui/svg-icons/content/save';

let Slider = require('rc-slider');
const createSliderWithTooltip = Slider.createSliderWithTooltip;
Slider = createSliderWithTooltip(Slider);

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);

@observer
export default class NetworkList extends React.Component {

  constructor(props) {
    super(props)
    this._selectNetwork = this._selectNetwork.bind(this);
    this._refreshSelectedNetwork = this._refreshSelectedNetwork.bind(this);
    this._saveSelectedNetwork = this._saveSelectedNetwork.bind(this);
    this._downloadSelectedNetwork = this._downloadSelectedNetwork.bind(this);
    this._filterOnStep = this._filterOnStep.bind(this);
  }

  _selectNetwork(network_index) {
    this.props.appState.selectNetwork(network_index);
  }

  _refreshSelectedNetwork() {
    this.props.appState.refreshSelectedNetwork();
  }

  _saveSelectedNetwork() {
    this.props.appState.saveSelectedNetwork();
  }

  _downloadSelectedNetwork() {
    this.props.appState.downloadSelectedNetwork();
  }

  _filterOnStep(step) {
    this.props.appState.filterOnStep(step);
  }

  render() {

    const appState = this.props.appState;

    const styles = {
      container: {
        top: 0,
        width: 'auto',
      },
      icon: {
        margin: 2,
        position: 'relative',
        width: 20,
        height: 20,
        color: '#999',
      }
    }

    const selectedNetworkIcons = (<div style={styles.container}>
      <IconRefresh
        style={styles.icon}
        onTouchTap={this._refreshSelectedNetwork}/>
      <IconSave
        style={styles.icon}
        onTouchTap={this._saveSelectedNetwork}/>
      <IconDownload
        style={styles.icon}
        onTouchTap={this._downloadSelectedNetwork}/>
    </div>);
    //const selectedNetworkIcons = null;

    return <SelectableList defaultValue={appState.selectedNetworkIndex}>
      { appState.networks.map( (network, index) => {

        const selectedItem = index == appState.selectedNetworkIndex;

        let secondaryText = '';
        if(selectedItem) {
          if(network.has('graph')) {
            secondaryText = "nodes: " + network.get('graph').nodes.length
                            + " - " +
                            "edges: " + network.get('graph').edges.length;
          } else if(network.has('status') && network.get('status') != 'complete') {
            secondaryText = network.get('status');
          }
        }

        const nested = [];

        if(false && network.has('graph')) {
          const graph = network.get('graph');
          if(graph.steps && graph.steps.length > 1) {
            nested.push(<ListItem
              key='nested-steps'
              primaryText={<Slider
                defaultValue={graph.steps.length}
                max={graph.steps.length}
                onChange={this._filterOnStep}
              />}
            />);
          }
        }

        return <ListItem
          key={index}
          value={index}
          primaryText={network.get('name')}
          secondaryText={secondaryText}
          rightIcon={ selectedItem ? selectedNetworkIcons : (<div/>)}
          onTouchTap={this._selectNetwork.bind(this, index)}
          nestedItems={nested}
        />
        })
      }
    </SelectableList>

  }

}
