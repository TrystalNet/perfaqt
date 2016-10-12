import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as THUNK  from '../thunks'
import * as SELECT from '../select'
import Autosuggest from 'react-autosuggest'
import {updateUI} from '../reducer'
import {setActiveField, updateActiveField, saveActiveField} from '../tmpField'

class SearchBox extends React.Component {
  onKeyDown = e => {
    switch(e.keyCode) {
      case 13: this.props.dispatch(saveActiveField()); break
      default: return      
    }
    e.preventDefault()
    e.stopPropagation()
  }
  onChange = (e, f) => {
    const {newValue, method} = f
    //if(method !== 'type') return
    e.preventDefault()
    this.props.dispatch(updateActiveField(newValue))
  }
  onSuggestionsFetchRequested = ({value}) => {
    this.props.dispatch(THUNK.getSuggestionsFromIDB(value))
  }
  onSuggestionsClearRequested = () => {
    this.props.dispatch(updateUI({searchSuggestions:[]}))
  }
  onFocus= e => this.props.dispatch(setActiveField({fldName:'fldSearch', objectId:null}))

  componentDidUpdate(prevProps) {
    if(prevProps.isFocus || !this.props.isFocus || !this.fldSearch) return
    const {input} = this.fldSearch
    input.focus()
    input.select()
  }

  render()  {
    const {suggestions, text} = this.props
    const inputProps = {
      placeholder: 'Type a search',
      value:text || '',
      onKeyDown: this.onKeyDown,
      onChange:this.onChange,
      onFocus:this.onFocus
    }
    return <Autosuggest  
       ref={fld => this.fldSearch = fld}
       suggestions={suggestions} 
       alwaysRenderSuggestions={true}
       onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
       onSuggestionsClearRequested={this.onSuggestionsClearRequested}
       getSuggestionValue={text => text}
       renderSuggestion={text => <span>{text}</span>}
       inputProps={inputProps}
    />
  }
}

function mapStateToProps(state) {
  const { searchSuggestions:suggestions, search, focused, activeField } = state.ui
  const {fldName, objectId, tmpValue} = activeField
  const text = fldName === 'fldSearch' ? tmpValue : search.text 
  const searches = SELECT.getSearches(state)
  const isFocus = focused === 'SEARCH'
  return {suggestions, text, searches, isFocus}
}
export default connect(mapStateToProps)(SearchBox)


// get the best button going, and i think we are good to go