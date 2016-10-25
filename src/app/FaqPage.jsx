import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, FormControl } from 'react-bootstrap'
import { updateUI } from '../reducers/reducer-ui'

import * as THUNK from '../thunks'

const FaqPage = ({faqId, dispatch}) => {
  const faqIdChanged = e => {
    const editFaq = {faqId: e.target.value}
    dispatch(updateUI({editFaq}))    
  }
  return <div>
    <FormControl type='text' value={faqId} placeholder='faq name' onChange={faqIdChanged}/>
    <Button key='cancel' onClick={e => dispatch(THUNK.cancelFaqPage())}>Cancel</Button>
    <Button key='ok'     onClick={e => dispatch(THUNK.closeFaqPage())}>Ok</Button>
  </div>
} 

function mapStateToProps({ui}) {
  const {editFaq} = ui
  const {faqId} = editFaq
  return {faqId}
}
export default connect(mapStateToProps)(FaqPage)
