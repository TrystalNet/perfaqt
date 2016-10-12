import React from 'react';
import { 
  EditorState, Entity, CompositeDecorator,
  convertToRaw, convertFromRaw,
  RichUtils 
} from 'draft-js'

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
const linkDecorator = () => new CompositeDecorator([{strategy:findLinkEntities, component:Link}]) 

function buildInitialContentState(draftjs, text='') {
  if(!draftjs) return convertFromRaw({ blocks:[{type:'unstyled', text}], entityMap:{}})
  if(!draftjs.blocks) draftjs.blocks = [{type:'unstyled',text}];
  if(!draftjs.entityMap) draftjs.entityMap = {}
  return convertFromRaw(draftjs)
}

export function faqtToEditorState(draftjs, text) {
  const contentState = buildInitialContentState(draftjs, text)
  return EditorState.createWithContent(contentState, linkDecorator())
}

export function addLinkToEditorState(editorState, href) {
  return (dispatch, getState) => {
    const selection = editorState.getSelection()
    if(selection.isCollapsed()) return null
    const key = Entity.create('LINK', 'MUTABLE', {href});
    return RichUtils.toggleLink(editorState, selection, key)
  }
}

export function editorStateToSaveState(editorState) {
  const rawContentState = convertToRaw(editorState.getCurrentContent())
  const text = rawContentState.blocks.map(block => block.text).join('\n')
  return {rawContentState, text}
}

export function getActiveLink(editorState) {
  if(!editorState) return ''
  const {focusKey, focusOffset} = editorState.getSelection()
  const block = editorState.getCurrentContent().blockMap.get(focusKey)
  const entityKey = block.getEntityAt(focusOffset)
  if(!entityKey) return ''
  const {type, mutability, data} = Entity.get(entityKey)
  return type === 'LINK' ? data.href : ''
}

