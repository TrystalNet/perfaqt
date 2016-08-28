import React, { Component } from 'react';
import SearchBar from './SearchBar'
import MenuBar from './MenuBar'
import FaqtsArea from './FaqtsArea'

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
        <SearchBar {...{ search, searches, broadcast, onAsk, onSaveSearch, onLogout }} />
        <MenuBar   {...{ onAddFaqt }}/>
        <FaqtsArea {...{ faqts, faqtId, onSetBestFaqt, onUpdateFaqt, onActivate }} />
      </div>
    );
  }
}


class LoginPage extends Component {
  onLogin() {
    const email = this.refs.fldEmail.value
    const password = this.refs.fldPassword.value
    if(email && email.length && password && password.length) this.props.onLogin(email, password)
  }
  onSignup() {
    const email = this.refs.fldEmail.value
    const password = this.refs.fldPassword.value
    // if(email && email.length && password && password.length) this.props.onLogin(email, password)
  }
  render() {
    return <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div style={{flex:1, textAlign:'center'}}></div>
      <div style={{display:'flex'}}>
        <div style={{flex:1}}></div>
        <div style={{backgroundColor:'transparent', display:'flex', flexDirection:'column'}}>
          <div style={{display:'flex', padding:10, textAlign:'right'}}><div style={{flex:1, marginRight:10}}>email:</div><input ref='fldEmail' type='text'></input></div>
          <div style={{display:'flex', padding:10}}><div style={{flex:1, marginRight:10}}>password:</div><input ref='fldPassword' type='password'></input></div>
          <div style={{padding:10, textAlign:'center'}}>
            <button style={{fontSize:20, paddingLeft:20, paddingRight:20}} onClick={this.onLogin.bind(this)}>Log in</button>
            <button style={{fontSize:20, paddingLeft:20, paddingRight:20}} onClick={this.onSignup.bind(this)}>Sign Up</button>
          </div>
        </div>
        <div style={{flex:1}}></div>
      </div>
      <div style={{flex:1}}></div>
    </div>
  }
}