import React, { Component } from 'react';
import { connect } from 'react-redux'
import { COL0WIDTH} from '../constants'

const styleContainer = {
  paddingLeft: COL0WIDTH,
}

const styleToolbar = {
  height:40,
  borderBottom: 'lightgray 1px solid',
  width:600,
  display:'flex'
}

const styleRight = {
  flex:1,
  textAlign:'right'
}

const MenuBar = ({onAddFaqt}) => <div style={styleContainer}>
  <div id='toolbar' style={styleToolbar}>
    <div style={styleRight}>
      <button onClick={onAddFaqt}>Add Faqt</button>
    </div>
  </div>
</div>

export default connect()(MenuBar)
