# Sistema de Gestão de Futebol e Churrasco (Google Apps Script)

Solução 100% dentro do ecossistema Google (Forms, Sheets, Drive, Docs) para
organizar o grupo recorrente de futebol e churrasco: cadastro de membros,
confirmação de presença por evento, controle financeiro, contribuições,
aniversários, dashboard gerencial e relatório automático em Google Docs.

Não usa nenhuma ferramenta externa (sem Supabase, Notion, Make, Zapier, n8n,
Airtable, bancos SQL externos etc.) — tudo roda em Google Apps Script.

## Estrutura do projeto

| Arquivo | Responsabilidade |
|---|---|
| `Config.gs` | Constantes do sistema (valores, nomes de abas/pastas, chave Pix) |
| `Util.gs` | Funções auxiliares (datas, dinheiro, busca de linhas, propriedades) |
| `DriveSetup.gs` | Cria a estrutura de pastas no Drive |
| `SpreadsheetSetup.gs` | Cria a planilha mestre e todas as abas |
| `CadastroForm.gs` | Formulário permanente de cadastro de membros |
| `EventoForm.gs` | Gera um formulário de confirmação de presença por evento, com as ramificações condicionais |
| `EventoSubmitHandler.gs` | Processa cada resposta do formulário de evento e distribui nas abas |
| `Dashboard.gs` | Recalcula o painel gerencial (DASHBOARD) |
| `Aniversarios.gs` | Recalcula a aba ANIVERSÁRIOS e o próximo aniversário de cada membro |
| `Relatorio.gs` | Gera o relatório consolidado de um evento em Google Docs |
| `Triggers.gs` | Triggers automáticos (manutenção diária, on-open) |
| `Menu.gs` | Menu administrativo dentro da planilha + `setupAll()` |

## Como implantar

1. Acesse [script.google.com](https://script.google.com) e crie um novo projeto
   (ou use o [clasp](https://github.com/google/clasp) para subir os arquivos
   desta pasta via `clasp push`).
2. Copie o conteúdo de cada arquivo `.gs` para o editor (mantendo os nomes dos
   arquivos) e o `appsscript.json` nas configurações do projeto (ative
   "Mostrar arquivo de manifesto" em Configurações do projeto).
3. Na primeira execução, o Google solicitará autorização de escopos (Forms,
   Sheets, Drive, Docs). Autorize com a conta Google que será a "dona" do
   sistema (administradora do grupo).
4. No editor do Apps Script, selecione a função `setupAll` e clique em
   **Executar**. Isso cria:
   - A pasta `Futebol e Churrasco` no Drive, com as subpastas
     `Comprovantes Pix`, `Relatórios`, `Eventos`, `Backup`.
   - A planilha `Controle Futebol e Churrasco` (já movida para dentro da
     pasta), com as abas `DASHBOARD`, `MEMBROS`, `EVENTOS`,
     `PARTICIPAÇÕES`, `PAGAMENTOS`, `CONTRIBUIÇÕES`, `ANIVERSÁRIOS`.
   - O formulário permanente de **Cadastro de Membros**.
   - O trigger diário de manutenção (recalcula aniversários/dashboard).
5. **Suba a imagem do QR Code Pix** manualmente: gere o QR Code da chave Pix
   `21977269184` (no seu próprio app do banco, ou em qualquer gerador) e
   salve o arquivo como `pix-qrcode.png` na pasta `Futebol e Churrasco` do
   Drive. Os formulários de evento criados depois disso incluirão essa
   imagem automaticamente. Esse passo é manual porque a geração de QR Code
   Pix exige uma API externa ao Google, fora do escopo permitido.
6. Rode a função `installOnOpenTrigger` uma única vez para que o menu
   **"Futebol e Churrasco"** apareça automaticamente sempre que a planilha
   for aberta (necessário porque este é um projeto standalone, não vinculado
   diretamente à planilha).

## Uso no dia a dia

- **Cadastro de membros**: compartilhe o link do formulário de cadastro uma
  única vez no grupo. Quem responder de novo com o mesmo nome ou WhatsApp
  apenas atualiza o cadastro existente (sem duplicar).
- **Criar evento**: na planilha, menu **Futebol e Churrasco → Criar
  formulário de novo evento**, informe a data (`dd/MM/yyyy`) e observações
  opcionais. O formulário é criado na pasta `Eventos` e o link é exibido em
  um alerta para você compartilhar no grupo.
- **Acompanhar em tempo real**: a aba `DASHBOARD` (primeira aba da planilha)
  é atualizada automaticamente a cada resposta de formulário, mostrando
  participação, financeiro, contribuições e próximos aniversários.
- **Gerar relatório do evento**: menu **Futebol e Churrasco → Gerar
  relatório do evento...**, informe a data do evento. Um Google Docs
  consolidado é criado na pasta `Relatórios`.
- **Atualizações manuais**: os itens de menu "Atualizar Dashboard" e
  "Atualizar Aniversários" recalculam tudo a qualquer momento.

## Fluxo do formulário de evento

```
Nome → Futebol (Sim/Não) → Churrasco (Sim/Não)
  Sim → Quantas pessoas? (1/2/3/4/5+) ──┐
  Não ───────────────────────────────────┤
                                          ▼
                          Deseja contribuir com algum item?
                            Não ─────────────────────┐
                            Carne/Bebida/... → Descreva o que irá levar ─┐
                                                                          ▼
                                                    Pagamento (QR Pix + chave)
                                              Como pretende pagar?
                                                Pix → Upload do comprovante ──┐
                                                Dinheiro → Valor em dinheiro ──┤
                                                Pix + Dinheiro → Valor Pix +   │
                                                  Upload + Valor em dinheiro ──┤
                                                                                ▼
                                                          Confirmação final (obrigatória)
```

## Observações de design

- Tudo foi implementado apenas com `FormApp`, `SpreadsheetApp`, `DriveApp` e
  `DocumentApp` — APIs nativas do Google Apps Script.
- Não há ranking de jogadores, controle disciplinar, estatísticas esportivas
  ou times automáticos — fora do escopo solicitado.
- O cálculo de "valor previsto" por resposta considera R$ 10 (futebol) e
  R$ 30 por pessoa (churrasco, multiplicado pela quantidade informada).
- O status de pagamento (`Pago`/`Parcial`/`Pendente`) é calculado
  automaticamente comparando valor previsto e valor recebido informado; para
  pagamentos via Pix, o valor é considerado recebido após o envio do
  comprovante, mas a conciliação final do comprovante é manual pelo
  administrador.
