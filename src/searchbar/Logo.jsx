import React, { Component } from 'react';
import {COL0WIDTH} from '../constants'

const S1 = {
  width:COL0WIDTH,
  fontSize:35,
  textAlign: 'center',
  border:'lightgray 0px solid'
}
const S2 = {color:'blue'}

const Logo = () => {
  return <div id='perfaqt' style={S1}>per<span style={S2}>faq</span>t</div>
}

export default Logo 