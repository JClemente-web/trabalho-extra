import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #121212;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    text-decoration: none;
  }

  button {
    font-family: inherit;
  }
`

export const Page = styled.div`
  min-height: 100vh;
  background-color: #121212;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px 80px;
`

export const Card = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
`

export const LogoWrap = styled.div`
  margin-bottom: 32px;
`

export const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  letter-spacing: -0.5px;
  margin-bottom: 32px;
  line-height: 1.2;
`

export const Subtitle = styled.p`
  color: #b3b3b3;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 24px;
`

export const Green = styled.strong`
  color: #1db954;
`

export const SuccessIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 24px;
`

export const Socials = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0;
`

export const BtnSocial = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 28px;
  border-radius: 500px;
  border: 1px solid #727272;
  background: transparent;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.1s;
  position: relative;
  margin-bottom: 0;

  &:hover {
    border-color: #ffffff;
    transform: scale(1.02);
  }

  span {
    flex: 1;
    text-align: center;
    margin-right: 20px;
  }
`

export const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0;

  span {
    flex: 1;
    height: 1px;
    background-color: #292929;
  }

  p {
    color: #ffffff;
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;
  }
`

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Label = styled.label`
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
`

export const ForgotLink = styled.a`
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: underline;
  transition: color 0.15s;

  &:hover {
    color: #1db954;
  }
`

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$hasError ? '#e91429' : '#727272')};
  background-color: #121212;
  color: #ffffff;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.15s;
  outline: none;

  &:hover {
    border-color: ${(props) => (props.$hasError ? '#e91429' : '#ffffff')};
  }

  &:focus {
    border-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: #6a6a6a;
  }
`

export const PasswordWrap = styled.div`
  position: relative;
`

export const PasswordInput = styled(Input)`
  padding-right: 52px;
`

export const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
`

export const ErroBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background-color: rgba(233, 20, 41, 0.12);
  border: 1px solid #e91429;
  border-radius: 4px;
`

export const ErroIcon = styled.span`
  color: #e91429;
  font-size: 1rem;
  flex-shrink: 0;
`

export const ErroText = styled.p`
  color: #e91429;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
`

export const BtnPrimary = styled.button`
  width: 100%;
  padding: 15px 32px;
  border-radius: 500px;
  background-color: #1db954;
  color: #000000;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  border: none;
  cursor: pointer;
  letter-spacing: 1px;
  transition: background-color 0.15s, transform 0.1s;
  margin-top: 4px;

  &:hover:not(:disabled) {
    background-color: #1ed760;
    transform: scale(1.03);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const Hint = styled.p`
  color: #6a6a6a;
  font-size: 0.75rem;
  text-align: center;
  margin-top: 16px;
`

export const Footer = styled.div`
  width: 100%;
  border-top: 1px solid #292929;
  margin-top: 28px;
  padding-top: 28px;
  text-align: center;

  p {
    color: #b3b3b3;
    font-size: 0.9375rem;
  }
`

export const SignupLink = styled.a`
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
  transition: color 0.15s;

  &:hover {
    color: #1db954;
  }
`
