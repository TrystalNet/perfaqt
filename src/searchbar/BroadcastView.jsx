import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNKS from '../thunks'

const S1 = {marginRight:15, color:'red', fontSize:'small'}

const BroadcastView = ({broadcast,dispatch}) => {
  const onClick = e => console.log('clicked') // dispatch(THUNKS.logState())
  return <div style={S1} onClick={onClick}>{broadcast}</div>
}

const mapStateToProps = ({ui:{broadcast}}) => ({broadcast})
export default connect(mapStateToProps)(BroadcastView)