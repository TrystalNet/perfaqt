import React, { Component } from 'react';

class LoginPage extends Component {
  onLogin() {
    const email = this.refs.fldEmail.value
    const password = this.refs.fldPassword.value
    if(email && email.length && password && password.length) this.props.onLogin(email, password)
  }
  onSignup() {
    const email = this.refs.fldEmail.value
    const password = this.refs.fldPassword.value
    if(email && email.length && password && password.length) this.props.onSignup(email, password)
  }
  render() {
    return <div style={{display:'flex', flexDirection:'column', height:'100%'}}>
      <div style={{flex:1, textAlign:'center'}}></div>
      <div style={{display:'flex'}}>
        <div style={{flex:1}}></div>
        <div style={{backgroundColor:'transparent', display:'flex', flexDirection:'column'}}>
          <div style={{display:'flex', padding:10, textAlign:'right'}}><div style={{flex:1, marginRight:10}}>email:</div><input ref='fldEmail' type='text'></input></div>
          <div style={{display:'flex', padding:10}}><div style={{flex:1, marginRight:10}}>password:</div><input ref='fldPassword' type='password'></input></div>
          <div style={{padding:10, textAlign:'center'}}>
            <button style={{fontSize:20, paddingLeft:20, paddingRight:20}} onClick={this.onLogin.bind(this)}>Log in</button>
            <button style={{fontSize:20, paddingLeft:20, paddingRight:20}} onClick={this.onSignup.bind(this)}>Sign Up</button>
          </div>
        </div>
        <div style={{flex:1}}></div>
      </div>
      <div style={{flex:1}}></div>
    </div>
  }
}
export default LoginPage