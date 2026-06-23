import { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  GlobalStyle,
  Page,
  Card,
  LogoWrap,
  Title,
  Subtitle,
  Green,
  SuccessIcon,
  Socials,
  BtnSocial,
  Divider,
  Form,
  Field,
  LabelRow,
  Label,
  ForgotLink,
  Input,
  PasswordWrap,
  PasswordInput,
  EyeBtn,
  ErroBox,
  ErroIcon,
  ErroText,
  BtnPrimary,
  Hint,
  Footer,
  SignupLink,
} from './App.styles'

// Credenciais válidas para o clone
const USUARIO_VALIDO = 'usuario@spotify.com'
const SENHA_VALIDA = '1234'

const SpotifyLogoIcon = ({ className }) => (
  <svg viewBox="0 0 167.2 167.2" className={className} aria-label="Spotify">
    <path
      fill="#ffffff"
      d="M83.6 0C37.4 0 0 37.4 0 83.6s37.4 83.6 83.6 83.6 83.6-37.4 83.6-83.6S129.8 0 83.6 0zm38.4 120.5c-1.5 2.5-4.7 3.2-7.1 1.7C95.1 112 75 110 51.6 115c-2.9.6-5.8-1.2-6.4-4.1-.6-2.9 1.2-5.8 4.1-6.4 25.7-5.5 47.8-3.1 65.5 8.9 2.4 1.5 3.2 4.7 1.7 7.1zm10.2-22.7c-1.9 3.1-5.9 4-9 2.1-16.2-9.9-40.8-12.8-59.9-7-2.5.8-5.1-.6-5.9-3.1-.8-2.5.6-5.1 3.1-5.9 21.9-6.6 49.1-3.4 67.8 8 3 1.9 4 5.9 2.1 9h-.2zm.9-23.6c-19.4-11.5-51.4-12.6-69.9-7-3 .9-6.1-.7-7-3.7-.9-3 .7-6.1 3.7-7 21.3-6.4 56.7-5.2 79.1 8.1 2.7 1.6 3.6 5.1 2 7.8-1.6 2.7-5.1 3.6-7.8 2h-.1z"
    />
  </svg>
)

const SpotifyLogo = styled(SpotifyLogoIcon)`
  width: 48px;
  height: 48px;
  display: block;
`

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
)

function App() {
  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [logado, setLogado] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [loading, setLoading] = useState(false)

  // useEffect observa "tentativa" e verifica as credenciais sempre que ela muda
  useEffect(() => {
    if (tentativa === 0) return

    setLoading(true)

    const timer = setTimeout(() => {
      if (login === USUARIO_VALIDO && senha === SENHA_VALIDA) {
        setErro('')
        setLogado(true)
      } else {
        setErro('Nome de usuário ou senha incorretos.')
        setLogado(false)
      }
      setLoading(false)
    }, 600)

    return () => clearTimeout(timer)
  }, [tentativa])

  function handleSubmit(e) {
    e.preventDefault()
    if (!login.trim() || !senha.trim()) {
      setErro('Preencha o e-mail e a senha.')
      return
    }
    setErro('')
    setTentativa(prev => prev + 1)
  }

  function handleLogout() {
    setLogado(false)
    setLogin('')
    setSenha('')
    setTentativa(0)
    setErro('')
    setSenhaVisivel(false)
  }

  if (logado) {
    return (
      <>
        <GlobalStyle />
        <Page>
          <Card>
            <SpotifyLogo />
            <Title>Logado com sucesso!</Title>
            <Subtitle>
              Bem-vindo de volta, <Green>{login}</Green>
            </Subtitle>
            <SuccessIcon>🎵</SuccessIcon>
            <BtnPrimary onClick={handleLogout}>
              Sair
            </BtnPrimary>
          </Card>
        </Page>
      </>
    )
  }

  return (
    <>
      <GlobalStyle />
      <Page>
        <Card>
          {/* Logo */}
          <LogoWrap>
            <SpotifyLogo />
          </LogoWrap>

          <Title>Entrar no Spotify</Title>

          {/* Botões sociais */}
          <Socials>
            <BtnSocial type="button">
              <GoogleIcon />
              <span>Continuar com o Google</span>
            </BtnSocial>
            <BtnSocial type="button">
              <FacebookIcon />
              <span>Continuar com o Facebook</span>
            </BtnSocial>
            <BtnSocial type="button">
              <AppleIcon />
              <span>Continuar com a Apple</span>
            </BtnSocial>
          </Socials>

          {/* Divider */}
          <Divider>
            <span />
            <p>ou</p>
            <span />
          </Divider>

          {/* Formulário */}
          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="login">
                E-mail ou nome de usuário
              </Label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={e => { setLogin(e.target.value); setErro('') }}
                $hasError={!!erro}
                placeholder="E-mail ou nome de usuário"
                autoComplete="username"
              />
            </Field>

            <Field>
              <LabelRow>
                <Label htmlFor="senha">Senha</Label>
                <ForgotLink href="#">Esqueceu a senha?</ForgotLink>
              </LabelRow>
              <PasswordWrap>
                <PasswordInput
                  id="senha"
                  type={senhaVisivel ? 'text' : 'password'}
                  value={senha}
                  onChange={e => { setSenha(e.target.value); setErro('') }}
                  $hasError={!!erro}
                  placeholder="Senha"
                  autoComplete="current-password"
                />
                <EyeBtn
                  type="button"
                  onClick={() => setSenhaVisivel(v => !v)}
                  aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {senhaVisivel ? '🙈' : '👁️'}
                </EyeBtn>
              </PasswordWrap>
            </Field>

            {erro && (
              <ErroBox>
                <ErroIcon>⚠</ErroIcon>
                <ErroText>{erro}</ErroText>
              </ErroBox>
            )}

            <BtnPrimary
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </BtnPrimary>
          </Form>

          <Hint>
            credenciais de teste: usuario@spotify.com / 1234
          </Hint>

          <Footer>
            <p>
              Não tem uma conta?{' '}
              <SignupLink href="#">Cadastre-se no Spotify</SignupLink>
            </p>
          </Footer>
        </Card>
      </Page>
    </>
  )
}

export default App
