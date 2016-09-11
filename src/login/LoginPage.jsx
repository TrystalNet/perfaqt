import React, { Component } from 'react'

import LoginButton from './LoginButton'
import SignupButton from './SignupButton'
import EmailField from './EmailField'
import PasswordField from './PasswordField'

const S0 = { display:'flex', flexDirection:'column', height:'100%' }
const S1 = { flex:1, textAlign:'center' }
const S2 = { display:'flex' }
const S3 = { flex:1 }
const S4 = { backgroundColor:'transparent', display:'flex', flexDirection:'column' }
const S5 = { padding:10, textAlign:'center' }

class LoginPage extends Component {
  render() {
    return <div style={S0}>
      <div style={S1}></div>
      <div style={S2}>
        <div style={S3}></div>
        <div style={S4}>
          <EmailField />
          <PasswordField />
          <div style={S5}>
            <LoginButton />
            <SignupButton />
          </div>
        </div>
        <div style={S3}></div>
      </div>
      <div style={S3}></div>
    </div>
  }
}
export default LoginPage