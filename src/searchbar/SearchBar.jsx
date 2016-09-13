import React, { Component } from 'react';
import LogoutButton from './LogoutButton'
import BroadcastView from './BroadcastView'
import Logo from './Logo'
import SearchBox from './SearchBox'

const S0 = {
  backgroundColor:'#f2f2f2', 
  display:'flex', 
  paddingTop:20, paddingBottom:20,
  alignItems:'center', 
  borderBottom: 'lightgray 1px solid'
}
const S1 = {
  flex:1,
  textAlign:'right', 
  marginRight:10
}

export default function SearchBar() {
  return <div id='searchesContainer' style={S0}>
    <Logo />
    <SearchBox />
    <div style={S1}></div>
    <BroadcastView />
    <LogoutButton />
  </div>
}

