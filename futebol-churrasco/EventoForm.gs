/**
 * Cria o formulário de confirmação de presença para um evento específico.
 * Use o menu "Futebol e Churrasco > Criar formulário de novo evento" na
 * planilha, ou chame createEventoForm('dd/MM/yyyy') diretamente.
 *
 * Fluxo de páginas (com ramificações):
 *   [Nome, Futebol, Churrasco] -> Quantidade (se Churrasco=Sim) -> Contribuições
 *   -> Detalhe da contribuição (se item != Não) -> Pagamento (QR Pix + forma)
 *   -> Pix (upload) | Dinheiro (valor) | Pix+Dinheiro (valor pix, upload, valor dinheiro)
 *   -> Confirmação final
 */
function createEventoForm(dataEventoStr, observacoes) {
  if (!dataEventoStr) throw new Error('Informe a data do evento no formato dd/MM/yyyy.');

  var form = FormApp.create('Confirmação de Presença - Futebol e Churrasco - ' + dataEventoStr);
  form.setDescription(
    'Confirme sua presença no futebol e/ou churrasco do dia ' + dataEventoStr + '.\n' +
    'Leva menos de 2 minutos.'
  );
  form.setConfirmationMessage('Presença confirmada! Até o evento.');
  form.setCollectEmail(false);
  form.setRequireLogin(false);

  // ---- Identificação ----
  form.addTextItem().setTitle('Nome Completo').setRequired(true);

  // ---- Futebol ----
  var futebolItem = form.addMultipleChoiceItem();
  futebolItem.setTitle('Você participará do futebol?')
    .setHelpText('Valor do futebol: ' + formatMoneyBR_(CONFIG.VALOR_FUTEBOL))
    .setChoiceValues(['Sim', 'Não'])
    .setRequired(true);

  // ---- Churrasco ----
  var churrascoItem = form.addMultipleChoiceItem();
  churrascoItem.setTitle('Você participará do churrasco?')
    .setHelpText('Valor do churrasco: ' + formatMoneyBR_(CONFIG.VALOR_CHURRASCO) + ' por pessoa')
    .setRequired(true);

  // ---- Páginas seguintes (criadas em ordem; escolhas são ligadas depois) ----
  var pbQuantidade = form.addPageBreakItem().setTitle('Churrasco');
  var quantidadeItem = form.addMultipleChoiceItem();
  quantidadeItem.setTitle('Quantas pessoas participarão?')
    .setChoiceValues(['1', '2', '3', '4', '5+'])
    .setRequired(true);

  var pbContribuicao = form.addPageBreakItem().setTitle('Contribuições Extras');
  var contribuicaoItem = form.addListItem();
  contribuicaoItem.setTitle('Deseja contribuir levando algum item?').setRequired(true);

  var pbContribDetalhe = form.addPageBreakItem().setTitle('Detalhe da Contribuição');
  form.addTextItem()
    .setTitle('Descreva o que irá levar.')
    .setHelpText('Exemplos: 2 kg de linguiça, 3 refrigerantes, 1 saco de carvão, 2 sacos de gelo.')
    .setRequired(true);

  var pbPagamento = form.addPageBreakItem().setTitle('Pagamento');
  addPixQrCodeSection_(form);
  var formaPagamentoItem = form.addMultipleChoiceItem();
  formaPagamentoItem.setTitle('Como pretende realizar o pagamento?').setRequired(true);

  var pbPix = form.addPageBreakItem().setTitle('Pagamento via Pix');
  form.addFileUploadItem().setTitle('Upload do comprovante').setRequired(true);

  var pbDinheiro = form.addPageBreakItem().setTitle('Pagamento em Dinheiro');
  form.addTextItem().setTitle('Valor que será pago em dinheiro').setRequired(true);

  var pbPixDinheiro = form.addPageBreakItem().setTitle('Pagamento Pix + Dinheiro');
  form.addTextItem().setTitle('Valor pago via Pix').setRequired(true);
  form.addFileUploadItem().setTitle('Upload do comprovante').setRequired(true);
  form.addTextItem().setTitle('Valor que será pago em dinheiro').setRequired(true);

  var pbConfirmacao = form.addPageBreakItem().setTitle('Confirmação');
  form.addCheckboxItem()
    .setTitle('Confirmação final')
    .setChoiceValues(['Confirmo minha participação neste evento.'])
    .setRequired(true);

  // ---- Liga as ramificações agora que todas as páginas existem ----
  churrascoItem.setChoices([
    churrascoItem.createChoice('Sim', pbQuantidade),
    churrascoItem.createChoice('Não', pbContribuicao)
  ]);

  pbQuantidade.setGoToPage(pbContribuicao);

  var contribChoices = [contribuicaoItem.createChoice('Não', pbPagamento)];
  CONFIG.ITENS_CONTRIBUICAO.forEach(function (item) {
    contribChoices.push(contribuicaoItem.createChoice(item, pbContribDetalhe));
  });
  contribuicaoItem.setChoices(contribChoices);
  pbContribuicao.setGoToPage(pbPagamento);

  pbContribDetalhe.setGoToPage(pbPagamento);

  formaPagamentoItem.setChoices([
    formaPagamentoItem.createChoice('Pix', pbPix),
    formaPagamentoItem.createChoice('Dinheiro', pbDinheiro),
    formaPagamentoItem.createChoice('Pix + Dinheiro', pbPixDinheiro)
  ]);

  pbPix.setGoToPage(pbConfirmacao);
  pbDinheiro.setGoToPage(pbConfirmacao);
  pbPixDinheiro.setGoToPage(pbConfirmacao);

  linkEventoFormToSpreadsheet_(form, dataEventoStr);
  installEventoFormTrigger_(form, dataEventoStr);
  moveFileIntoFolder_(form.getId(), getEventosFolder_());

  ensureEventoRow_(dataEventoStr, observacoes || '');
  updateDashboard();

  return form;
}

function addPixQrCodeSection_(form) {
  form.addSectionHeaderItem()
    .setTitle('Pagamento via Pix')
    .setHelpText(
      'Chave Pix (telefone): ' + CONFIG.PIX_KEY + '\n' +
      'Use o QR Code abaixo (se disponível) ou a chave acima no seu app do banco.'
    );

  var qrFile = findImageFileInRoot_(CONFIG.PIX_QRCODE_FILENAME);
  if (qrFile) {
    form.addImageItem()
      .setTitle('QR Code Pix')
      .setImage(qrFile.getBlob());
  }
}

function linkEventoFormToSpreadsheet_(form, dataEventoStr) {
  var ss = getMasterSpreadsheet_();
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  Utilities.sleep(1000);
  var responseSheetName = 'Respostas Evento ' + dataEventoStr.replace(/\//g, '-');
  var sheets = ss.getSheets();
  var candidato = sheets.filter(function (s) {
    return s.getName() === form.getTitle() || s.getName().toLowerCase().indexOf('confirmação de presença') > -1;
  })[0];
  if (candidato && candidato.getName() !== responseSheetName) {
    var existing = ss.getSheetByName(responseSheetName);
    if (existing) ss.deleteSheet(existing);
    candidato.setName(responseSheetName);
  }
}

function installEventoFormTrigger_(form, dataEventoStr) {
  ScriptApp.newTrigger('onEventoSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
  // Guarda a data do evento associada a este formulário para o handler.
  PropertiesService.getScriptProperties().setProperty('FORM_' + form.getId(), dataEventoStr);
}

function ensureEventoRow_(dataEventoStr, observacoes) {
  var eventos = getSheet_(CONFIG.SHEETS.EVENTOS);
  var row = findRowByColumnValue_(eventos, 2, function (v) { return String(v).trim() === dataEventoStr; });
  if (row > 0) return;
  var id = nextId_(eventos);
  eventos.appendRow([id, dataEventoStr, observacoes]);
}
