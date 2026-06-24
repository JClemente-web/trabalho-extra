/**
 * Menu administrativo na planilha mestre. Roda no contexto da planilha
 * (precisa estar vinculada a um projeto Apps Script ligado a ela, ou ser
 * acionado manualmente pelo editor de script — ver README).
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Futebol e Churrasco')
    .addItem('Configurar tudo (1ª vez)', 'setupAll')
    .addSeparator()
    .addItem('Criar formulário de novo evento', 'menuCriarFormularioEvento')
    .addItem('Atualizar Dashboard', 'updateDashboard')
    .addItem('Atualizar Aniversários', 'updateAniversarios')
    .addItem('Gerar relatório do evento...', 'menuGerarRelatorio')
    .addToUi();
}

/**
 * Cria toda a estrutura (Drive + Planilha + Formulário de cadastro + triggers).
 * Execute uma única vez, no início.
 */
function setupAll() {
  setupDriveStructure();
  setupMasterSpreadsheet();
  setupCadastroForm();
  installDailyMaintenanceTrigger();
  SpreadsheetApp.getUi().alert(
    'Configuração concluída!\n\n' +
    'Antes de criar o primeiro evento, suba a imagem do QR Code Pix (' +
    CONFIG.PIX_QRCODE_FILENAME + ') na pasta "' + CONFIG.DRIVE_ROOT_FOLDER + '" do Drive.'
  );
}

function menuCriarFormularioEvento() {
  var ui = SpreadsheetApp.getUi();
  var dataResp = ui.prompt('Novo Evento', 'Data do evento (dd/MM/yyyy):', ui.ButtonSet.OK_CANCEL);
  if (dataResp.getSelectedButton() !== ui.Button.OK) return;

  var obsResp = ui.prompt('Novo Evento', 'Observações (opcional):', ui.ButtonSet.OK_CANCEL);
  var observacoes = obsResp.getSelectedButton() === ui.Button.OK ? obsResp.getResponseText() : '';

  var form = createEventoForm(dataResp.getResponseText().trim(), observacoes);
  ui.alert('Formulário criado!\n\nLink para compartilhar:\n' + form.getPublishedUrl());
}

function menuGerarRelatorio() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt('Gerar Relatório', 'Data do evento (dd/MM/yyyy):', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  var url = gerarRelatorioEvento(resp.getResponseText().trim());
  ui.alert('Relatório gerado!\n\n' + url);
}
