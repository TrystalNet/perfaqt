import React, { Component } from 'react';
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import LogoutButton from './LogoutButton'
import BroadcastView from './BroadcastView'
import Logo from './Logo'
import * as SELECT from '../select'
import * as THUNK  from '../thunks'

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

function getSuggestions(value, searches) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  if(!inputLength) return []
  return searches.filter(search => inputValue === (search.text || '').toLowerCase().slice(0, inputLength))
}

class SearchBar extends Component {
  constructor(props) {
    super()
    this.state = {
       value: '',
       suggestions: getSuggestions('', props.searches)
    }
  }
  onSuggestionsUpdateRequested({value, reason}) {
    const suggestions = getSuggestions(value, this.props.searches)
    this.setState({suggestions})
  }
  onSaveSearch(e) {
    const {faqref, dispatch} = this.props
    dispatch(THUNK.saveSearch(faqref, this.refs.fldSearch.value))
  }
  onChange(event, {newValue}) {
    const {faqref, dispatch} = this.props
    this.setState({value: newValue})
    dispatch(THUNK.setSearch(faqref, newValue))
  }
  onKeyDown(e) {
    switch(e.keyCode) {
      case 13:
        const FUCK = this.props.faqref
        const SHIT = this.state.value
        const BULLSHIT = THUNK.saveSearch(FUCK, SHIT)
        this.props.dispatch(BULLSHIT)
        break
      default: return      
    }
    e.preventDefault()
    e.stopPropagation()
  }
  componentDidUpdate(prevProps) {
    if(prevProps.isFocus || !this.props.isFocus) return
    const input = this.refs.fldSearch.input
    input.focus()
    input.select()
  }
  render() {
    const { value, suggestions } = this.state
    const { dispatch } = this.props
    const inputProps = {
      placeholder: 'Type a search',
      value,
      onKeyDown: this.onKeyDown.bind(this),
      onChange:this.onChange.bind(this)
    }
    return <div id='searchesContainer' style={S0} onFocus={e => dispatch(THUNK.focusSearch())}>
      <Logo />
      <Autosuggest 
        ref='fldSearch'
        suggestions={suggestions} 
        onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested.bind(this)}
        getSuggestionValue={search => search.text}
        renderSuggestion={search => <span>{search.text}</span>}
        inputProps={inputProps}/>
      <div style={S1}></div>
      <BroadcastView />
      <LogoutButton />
    </div>
  }
}

function mapStateToProps(state) {
  const { faqref, focused, search } = state.ui
  const searches = SELECT.getSearchesByFaqref(state, faqref)
  const isFocus = focused === 'SEARCH'
  return { faqref, searches, search, isFocus,  }
}
export default connect(mapStateToProps)(SearchBar)
