import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'
import Autosuggest from 'react-autosuggest'
import {updateUI} from '../reducer'

function getSuggestions(value, searches) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  if(!inputLength) return []
  return searches.filter(search => inputValue === (search.text || '').toLowerCase().slice(0, inputLength))
}

class SearchBox extends React.Component {
  onKeyDown = e => {
    const {dispatch, faqref, search} = this.props
    switch(e.keyCode) {
      case 13:
        dispatch(THUNK.saveSearch(faqref, search.text))
        break
      default: return      
    }
    e.preventDefault()
    e.stopPropagation()
  }
  onChange = (e, f) => {
    const {newValue, method} = f
    if(method !== 'type') return
    e.preventDefault()
    const {dispatch, faqref} = this.props
    dispatch(THUNK.setSearch(faqref, newValue))
  }
  onSuggestionsUpdateRequested = ({value, reason}) => {
    const {dispatch, searches} = this.props
    const searchSuggestions = getSuggestions(value, searches)
    dispatch(updateUI({searchSuggestions}))
  }
  onFocus= e => this.props.dispatch(THUNK.focusSearch())

  componentDidUpdate(prevProps) {
    if(prevProps.isFocus || !this.props.isFocus || !this.fldSearch) return
    const {input} = this.fldSearch
    input.focus()
    input.select()
  }
  render()  {
    const {suggestions, search} = this.props
    const inputProps = {
      placeholder: 'Type a search',
      value:search.text || '',
      onKeyDown: this.onKeyDown,
      onChange:this.onChange,
      onFocus:this.onFocus
    }
    return <Autosuggest  
       ref={fld => this.fldSearch = fld}
       suggestions={suggestions} 
       onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
       getSuggestionValue={search => search.text}
       renderSuggestion={search => <span>{search.text}</span>}
       inputProps={inputProps}
    />
  }
}

function mapStateToProps(state) {
  const { searchSuggestions:suggestions, search, faqref, focused } = state.ui
  const searches = SELECT.getSearchesByFaqref(state, faqref)
  const isFocus = focused === 'SEARCH'
  return {suggestions, faqref, search, searches, isFocus}
}
export default connect(mapStateToProps)(SearchBox)
