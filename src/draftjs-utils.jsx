import React from 'react';
import { 
  EditorState, Entity, CompositeDecorator,
  convertToRaw, convertFromRaw, getEntitySelectionState,
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
  const selection = editorState.getSelection()
  const {focusKey, focusOffset} = selection
  const block = editorState.getCurrentContent().blockMap.get(focusKey)
  const entityKey = block.getEntityAt(focusOffset)

  function newEntity() {
    if(!href) return null
    if(selection.isCollapsed()) return null
    const key = Entity.create('LINK', 'MUTABLE', {href});
    return RichUtils.toggleLink(editorState, selection, key)
  }
  if(!entityKey) return newEntity()

  const {type, mutability, data} = Entity.get(entityKey)
  if(type !== 'LINK') return

  if(!href) {
    let newEditorState
    block.findEntityRanges((value)=> value.entity === entityKey, (start, end ) => {
      const updatedSelection = selection.merge({
          anchorOffset: start,
          focusOffset: end
      });
      newEditorState = RichUtils.toggleLink(editorState, updatedSelection, null)
    })
    return newEditorState 
  }

  Entity.mergeData(entityKey, {href})
  return editorState
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

