# Trabalho Extra — Investigação: Tomar café (individual)

Entrega do exercício extra (1,0 ponto) baseado no projeto individual da **P1**: clone da página de login do Spotify, agora todo migrado para **styled-components**.

---

## ☕ Investigação: Tomar café

| Item | Status |
|---|---|
| Trabalho individual | ✅ |
| Mesmo projeto da P1 | ✅ (clone de login do Spotify) |
| Pacote `styled-components` instalado | ✅ (`package.json`) |
| Página migrada para usar styled-components | ✅ (`src/App.jsx` + `src/App.styles.js`) |

---

## 🎯 Objetivo do Projeto

Demonstrar o uso dos hooks fundamentais do React, agora com toda a estilização em CSS-in-JS:

- **`useState`** — gerenciamento de estado local (campos do formulário, erros, loading, visibilidade da senha)
- **`useEffect`** — efeito colateral que observa mudanças na variável `tentativa` para verificar as credenciais do usuário
- **styled-components** — estilização com CSS-in-JS, componentes estilizados (`App.styles.js`) e `createGlobalStyle` para o reset global

---

## ✨ Funcionalidades

- Tela de login fiel ao design do Spotify (fundo escuro, verde `#1DB954`, botões pill)
- Botões de login social (Google, Facebook, Apple) — estéticos
- Validação de campos vazios antes de submeter
- Verificação de credenciais via `useEffect` com delay simulado de 600ms
- Exibição de erro com destaque visual nos inputs e mensagem com ícone
- Toggle para mostrar/ocultar senha
- Botão "Entrar" desabilitado durante o loading
- Tela de sucesso com nome do usuário após login
- Botão "Sair" que reseta todos os estados

---

## 🛠️ Tecnologias

| Tecnologia | Versão |
|---|---|
| React | 18.2.0 |
| Vite | 5.2.0 |
| styled-components | 6.4.2 |

---

## 📁 Estrutura do Projeto

```
trabalho-extra/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── src/
    ├── main.jsx         # Ponto de entrada da aplicação
    ├── App.jsx          # Componente principal (toda a lógica)
    └── App.styles.js    # Estilos com styled-components + createGlobalStyle
```

---

## 🚀 Como Executar Localmente

**Pré-requisitos:** Node.js instalado (v18+)

```bash
# 1. Clone o repositório
git clone https://github.com/JClemente-web/trabalho-extra.git

# 2. Entre na pasta
cd trabalho-extra

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173** no navegador.

---

## 🔑 Credenciais de Teste

| Campo | Valor |
|---|---|
| E-mail | `usuario@spotify.com` |
| Senha | `1234` |

---

## 💡 Como o `useEffect` é Usado

O hook `useEffect` observa a variável `tentativa` (um contador incrementado a cada clique em "Entrar"). Sempre que `tentativa` muda, o efeito dispara e verifica as credenciais com um delay de 600ms para simular uma requisição:

```jsx
useEffect(() => {
  if (tentativa === 0) return   // ignora o estado inicial

  setLoading(true)

  const timer = setTimeout(() => {
    if (login === USUARIO_VALIDO && senha === SENHA_VALIDA) {
      setLogado(true)
    } else {
      setErro('Nome de usuário ou senha incorretos.')
    }
    setLoading(false)
  }, 600)

  return () => clearTimeout(timer)   // cleanup
}, [tentativa])
```

Essa abordagem garante que a verificação não ocorre no mount inicial — apenas quando o usuário tenta fazer login.

---

## 👤 Autor

**João Vitor Clemente Ferreira**
GitHub: [@JClemente-web](https://github.com/JClemente-web)
