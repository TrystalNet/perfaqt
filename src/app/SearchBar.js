import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest'
// import IsolatedScroll from 'react-isolated-scroll'

import {COL0WIDTH} from '../constants'

function getSuggestions(value, searches) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  return inputLength === 0 ? [] : searches.filter(search => search.text.toLowerCase().slice(0, inputLength) === inputValue)
}

const styleSearchBar = {
  backgroundColor:'#f2f2f2', 
  display:'flex', 
  paddingTop:20, paddingBottom:20, 
  borderBottom: 'lightgray 1px solid'
}
const stylePerfaqt = {
  width:COL0WIDTH,
  fontSize:35,
  textAlign: 'center',
  border:'lightgray 0px solid'
}
const styleSearchField = {
  fontSize:18,
  paddingLeft:10,
  width:550
}
const styleKeepButton = {
  marginRight:20
}
const styleSearchOption = {
  border: 'purple 3px solid',
  backgroundColor:'orange'
}
const styleRight = {
  flex:1,
  textAlign:'right', 
  marginRight:10
}

// function renderSuggestionsContainer(props) {
//   console.log('no way')
//   const { ref }  = props 
//   const callRef = isolatedScroll => {
//     if (isolatedScroll !== null) {
//       ref(isolatedScroll.component);
//     }
//   };
//  return <IsolatedScroll {...props} ref={callRef} />
// }
export default class SearchBar extends Component {
  constructor(props) {
    super()
    this.state = {
       value: '',
       suggestions: getSuggestions('', props.searches)
    }
  }
  onSuggestionsUpdateRequested = ({value, reason}) => {
    this.setState({suggestions: getSuggestions(value, this.props.searches)})
    this.props.onAsk(value)
  }

  onSearchChange(e) {
    this.props.onAsk(this.refs.fldSearch.value)
  }
  onSaveSearch(e) {
    const search = this.refs.fldSearch.value
    if(!search || !search.length) return
    this.props.onSaveSearch(search)
  }
  onChange = (event, {newValue}) => {
    this.setState({value: newValue})
  }
  onKeyDown(e) {
    switch(e.keyCode) {
      case 13:
        this.props.onSaveSearch(this.state.value)
        break
      default: return      
    }
    e.preventDefault()
    e.stopPropagation()
  }
  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: 'Type a search',
      value,
      onKeyDown: this.onKeyDown.bind(this),
      onChange:this.onChange
    }
    const {search, searches} = this.props
    return (
      <div id='searchesContainer' style={styleSearchBar}>
        <div id='perfaqt' style={stylePerfaqt}>per<span style={{color:'blue'}}>faq</span>t</div>
        <Autosuggest 
          suggestions={suggestions} 
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={search => search.text}
          renderSuggestion={search => <span>{search.text}</span>}
          inputProps={inputProps}/>
        <div style={styleRight}></div>
      </div>
    )
  }
}
//           renderSuggestionsContainer={renderSuggestionsContainer}

// <button key='btnSaveSearch' style={styleKeepButton} onClick={this.onSaveSearch.bind(this)}>keep</button>
// <input key='f1' ref='fldSearch' style={styleSearchField} list='dl1' type='text'
//   onKeyDown={this.onKeyDown.bind(this)} 
//   onChange={this.onSearchChange.bind(this)}></input>
