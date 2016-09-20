import React, { Component } from 'react';
import {
  Editor, EditorState, 
  convertFromRaw,
  Entity, Modifier,
  CompositeDecorator
} from 'draft-js'

const s1a = {padding:10, backgroundColor:'whitesmoke'}
const s1b = Object.assign({}, s1a, { border:'lightgrey 1px solid' })

function buildBlock(text) {
  return {
    type:'unstyled',
    text:text
  }
}
function buildRawDraftContentState(text) {
  const block = buildBlock(text)
  return {
    blocks:[block],
    entityMap:{}
  }
}
function buildContentState(text) {
  const rawState = buildRawDraftContentState(text)
  return convertFromRaw(rawState)
}
function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    character => {
      const entityKey = character.getEntity();
      return entityKey !== null && Entity.get(entityKey).getType() === 'LINK'
    },
    callback
  );
}

const styles = {
  link: {
    color: '#3b5998',
    textDecoration: 'underline'
  }
}
const Link = props => {
  const {href} = Entity.get(props.entityKey).getData();
  return <a href={href} style={styles.link} onClick={()=>window.open(href, '_blank')}>{props.children}</a>
}

class   EditorRO extends Component {
  constructor(props) {
    super(props)
    let contentState = buildContentState(props.text)
    if(props.draftjs) {
      const draftjs = props.draftjs;
      if(!draftjs.blocks) draftjs.blocks = [{type:'unstyled',text:props.text}];
      if(!draftjs.entityMap) draftjs.entityMap = {}
      contentState = convertFromRaw(draftjs)
    }
    const decorator = new CompositeDecorator([{strategy:findLinkEntities, component:Link}])
    const editorState = EditorState.createWithContent(contentState, decorator)
    this.state = {editorState}
  }
  render() {
    return <Editor style={s1a} editorState={this.state.editorState} readOnly={true} />
  }  
}
export default EditorRO
