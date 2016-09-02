import React, { Component } from 'react';
import SearchBar from '../searchbar/container'
import MenuBar from './MenuBar'
import FaqtsArea from './FaqtsArea'
import LoginPage from './LoginPage'

const COL0WIDTH = 130

const s1 = {padding:10 }
const s2 = {padding:10, border:'gray 1px solid', overflowY:'auto' }

const styleSearchBar = {
  backgroundColor:'#f2f2f2', display:'flex', paddingTop:20, paddingBottom:20, borderBottom: 'lightgray 1px solid'
}
const stylePerfaqt = {
  width:COL0WIDTH,
  fontSize:35,
  textAlign: 'center',
  border:'lightgray 0px solid'
}
const styleToolbar = {
  height:40,
  borderBottom: 'lightgray 1px solid'
}

const styleSearchField = {
  fontSize:18,
  paddingLeft:10,
  flex:1
}
const styleKeepButton = {
  marginRight:20
}

const styleSearchOption = {
  border: 'purple 3px solid',
  backgroundColor:'orange'
}

export default class App extends Component {
  onSearchChange(e) {
    this.props.onAsk(this.refs.fldSearch.value)
  }
  onSaveSearch(e) {
    const search = this.refs.fldSearch.value
    if(!search || !search.length) return
    this.props.onSaveSearch(search)
  }
  onSetBest(faqtId, e) {
    const search = this.refs.fldSearch.value
    if(!search || !search.length) return
    this.props.onSetBestFaqt(search, faqtId)    
  }
  onAddFaqt(e) {
    const value = this.refs.fldNewFaqt.value
    if(value && value.length) {
      this.props.onAddFaqt(value)
      this.refs.fldNewFaqt.value = ''
    }
  }
  onSave(e) {
    this.props.onSave()
  }
  onLoad(e) {
    this.props.onLoad()
  }
  onUpdateFaqt(faqtId, e) {
    this.props.onUpdateFaqt(faqtId, e.target.value)
  }
  render() {
    const {search, searches, faqts, faqtId, connected, broadcast} = this.props
    const {
      onAsk, onSaveSearch, onSetBestFaqt, onAddFaqt, onUpdateFaqt,
      onActivate, onLogout, onLogin, onSignup
    } = this.props
    if(!connected) return (<LoginPage {...{onLogin, onSignup}} />)
    return (
      <div id='app'>
        <SearchBar />
        <MenuBar   {...{ onAddFaqt }}/>
        <FaqtsArea {...{ faqts, faqtId, onSetBestFaqt }} />
      </div>
    );
  }
}
