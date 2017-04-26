import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import SearchInput from './RightDrawer/SearchInput';
//import Filters from './RightDrawer/Filters';

import SelectedNode from './RightDrawer/SelectedNode';
import NeighborNodes from './RightDrawer/NeighborNodes';

@observer
export default class RightDrawer extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const appState = this.props.appState;

    return (
      <Drawer openSecondary={true} open={appState.ui.rightDrawer} >
        <SearchInput appState={appState}/>
        <Divider/>
        <SelectedNode node={appState.graph.selectedNode} />
        <Divider/>
        <NeighborNodes appState={appState}/>
      </Drawer>
    );
  }
};
