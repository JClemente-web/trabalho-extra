/**
 * Configuração central do sistema. Editar aqui em vez de espalhar
 * valores mágicos pelos demais arquivos.
 */

var CONFIG = {
  PIX_KEY: '21977269184',
  VALOR_FUTEBOL: 10,
  VALOR_CHURRASCO: 30,

  DRIVE_ROOT_FOLDER: 'Futebol e Churrasco',
  DRIVE_SUBFOLDERS: ['Comprovantes Pix', 'Relatórios', 'Eventos', 'Backup'],
  // Nome do arquivo de imagem do QR Code Pix que o administrador deve subir
  // uma única vez na pasta raiz do Drive antes de criar o primeiro formulário de evento.
  PIX_QRCODE_FILENAME: 'pix-qrcode.png',

  SPREADSHEET_NAME: 'Controle Futebol e Churrasco',

  SHEETS: {
    DASHBOARD: 'DASHBOARD',
    MEMBROS: 'MEMBROS',
    EVENTOS: 'EVENTOS',
    PARTICIPACOES: 'PARTICIPAÇÕES',
    PAGAMENTOS: 'PAGAMENTOS',
    CONTRIBUICOES: 'CONTRIBUIÇÕES',
    ANIVERSARIOS: 'ANIVERSÁRIOS',
    RESPOSTAS_CADASTRO: 'Respostas Cadastro'
  },

  HEADERS: {
    MEMBROS: ['ID', 'Nome', 'WhatsApp', 'Data de Nascimento', 'Data de Cadastro'],
    EVENTOS: ['ID Evento', 'Data do Evento', 'Observações'],
    PARTICIPACOES: ['Data do Evento', 'Nome', 'Participará do Futebol', 'Participará do Churrasco', 'Quantidade de Pessoas', 'Data da Resposta'],
    PAGAMENTOS: ['Data do Evento', 'Nome', 'Forma de Pagamento', 'Valor Previsto', 'Valor Recebido', 'Status'],
    CONTRIBUICOES: ['Data do Evento', 'Nome', 'Categoria', 'Descrição'],
    ANIVERSARIOS: ['Nome', 'Data de Nascimento', 'Próximo Aniversário']
  },

  ITENS_CONTRIBUICAO: ['Carne', 'Refrigerante', 'Cerveja', 'Carvão', 'Gelo', 'Sobremesa', 'Outros'],

  // Chave de propriedades do script usada para guardar IDs (pasta raiz, planilha, etc.)
  PROP_ROOT_FOLDER_ID: 'ROOT_FOLDER_ID',
  PROP_SPREADSHEET_ID: 'SPREADSHEET_ID',
  PROP_CADASTRO_FORM_ID: 'CADASTRO_FORM_ID'
};
