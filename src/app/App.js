import React, { Component } from 'react';
import SearchBar from '../searchbar/container'
import FaqtsArea from '../faqts/FaqtsArea'
import MenuBar   from './MenuBar'
import LoginPage from './LoginPage'

export default class App extends Component {
  render() {
    const { faqts, connected } = this.props
    const { onAddFaqt, onLogin, onSignup } = this.props
    if(!connected) return (<LoginPage {...{onLogin, onSignup}} />)
    return (
      <div id='app'>
        <SearchBar />
        <MenuBar   {...{ onAddFaqt }}/>
        <FaqtsArea {...{ faqts }} />
      </div>
    )
  }
}
