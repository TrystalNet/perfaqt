import { connect } from 'react-redux'
import Answer from './Answer'

function mapStateToProps(state, ownProps) {
  const {isActive, id, text} = ownProps
  return {
    isActive,
    id,
    text
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const {onSetBest, onChange, onActivate, onDeactivate} = ownProps
  return {
    onSetBest, onChange, onActivate, onDeactivate
  }
}

const container = connect(mapStateToProps, mapDispatchToProps)(Answer)

export default container

