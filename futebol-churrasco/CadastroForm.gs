/**
 * Formulário permanente de cadastro de membros.
 * Nome Completo, WhatsApp e Data de Nascimento, com confirmação automática
 * para a aba MEMBROS e deduplicação por nome+WhatsApp normalizados.
 */
function setupCadastroForm() {
  var form = getOrCreateCadastroForm_();

  form.setTitle('Cadastro de Membros - Futebol e Churrasco');
  form.setDescription('Cadastre-se uma única vez para participar dos eventos do grupo. Leva menos de 1 minuto.');
  form.setConfirmationMessage('Cadastro recebido! Você já pode confirmar presença nos próximos eventos.');
  form.setCollectEmail(false);

  clearFormItems_(form);

  form.addTextItem()
    .setTitle('Nome Completo')
    .setRequired(true);

  form.addTextItem()
    .setTitle('WhatsApp')
    .setHelpText('Apenas números, com DDD. Exemplo: 21977269184')
    .setRequired(true);

  form.addDateItem()
    .setTitle('Data de Nascimento')
    .setRequired(true);

  linkFormToSpreadsheet_(form, CONFIG.SHEETS.RESPOSTAS_CADASTRO);
  installFormSubmitTrigger_(form, 'onCadastroSubmit');

  setProp_(CONFIG.PROP_CADASTRO_FORM_ID, form.getId());
  moveFileIntoFolder_(form.getId(), getRootFolder_());
  return form;
}

function getOrCreateCadastroForm_() {
  var id = getProp_(CONFIG.PROP_CADASTRO_FORM_ID);
  if (id) {
    try {
      return FormApp.openById(id);
    } catch (e) {
      // formulário perdido; recria abaixo
    }
  }
  return FormApp.create('Cadastro de Membros - Futebol e Churrasco');
}

function clearFormItems_(form) {
  form.getItems().forEach(function (item) { form.deleteItem(item); });
}

function linkFormToSpreadsheet_(form, responseSheetName) {
  var ss = getMasterSpreadsheet_();
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  // O Forms cria a aba de respostas com o título do form; renomeamos para algo previsível.
  Utilities.sleep(1000);
  var sheets = ss.getSheets();
  var respostas = sheets.filter(function (s) {
    return s.getName().toLowerCase().indexOf('respostas') > -1 || s.getName() === form.getTitle();
  });
  if (respostas.length > 0 && respostas[0].getName() !== responseSheetName) {
    var existing = ss.getSheetByName(responseSheetName);
    if (existing) ss.deleteSheet(existing);
    respostas[0].setName(responseSheetName);
  }
}

function installFormSubmitTrigger_(form, handlerFunctionName) {
  // Remove triggers antigos do mesmo formulário/handler para não duplicar.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === handlerFunctionName) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger(handlerFunctionName)
    .forForm(form)
    .onFormSubmit()
    .create();
}

/**
 * Disparado a cada envio do formulário de cadastro.
 * e.namedValues vem do FormApp na ordem dos títulos das perguntas.
 */
function onCadastroSubmit(e) {
  var values = e.namedValues;
  var nome = (values['Nome Completo'] || [''])[0].trim();
  var whatsapp = (values['WhatsApp'] || [''])[0].trim();
  var nascimento = (values['Data de Nascimento'] || [''])[0];

  if (!nome || !whatsapp) return;

  var membros = getSheet_(CONFIG.SHEETS.MEMBROS);
  var nomeNorm = normalizeName_(nome);
  var foneNorm = normalizePhone_(whatsapp);

  var rowIndex = findRowByColumnValue_(membros, 2, function (v) { return normalizeName_(v) === nomeNorm; });
  if (rowIndex < 0) {
    rowIndex = findRowByColumnValue_(membros, 3, function (v) { return normalizePhone_(v) === foneNorm; });
  }

  var dataNascimento = nascimento ? new Date(nascimento) : '';
  var agora = new Date();

  if (rowIndex > 0) {
    // Membro já cadastrado: apenas atualiza os dados (evita duplicidade).
    membros.getRange(rowIndex, 2, 1, 4).setValues([[nome, whatsapp, dataNascimento, agora]]);
  } else {
    var id = nextId_(membros);
    membros.appendRow([id, nome, whatsapp, dataNascimento, agora]);
  }

  if (dataNascimento) upsertAniversario_(nome, dataNascimento);
  updateDashboard();
}
