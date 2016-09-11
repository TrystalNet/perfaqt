import React, { Component } from 'react';
import { connect } from 'react-redux'

const S1 = {marginRight:15, color:'red', fontSize:'small'}

const BroadcastView = ({broadcast}) => {
  return <div style={S1}>{broadcast}</div>
}

const mapDispatchToProps = ({ui:{broadcast}}) => ({broadcast})
export default connect(mapDispatchToProps)(BroadcastView)