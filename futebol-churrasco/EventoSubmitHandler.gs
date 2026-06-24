/**
 * Disparado a cada envio de um formulário de evento. Distribui a resposta
 * entre as abas PARTICIPAÇÕES, PAGAMENTOS e CONTRIBUIÇÕES.
 */
function onEventoSubmit(e) {
  var dataEvento = PropertiesService.getScriptProperties().getProperty('FORM_' + e.source.getId());
  if (!dataEvento) return; // segurança: formulário não reconhecido

  var v = e.namedValues;
  var nome = firstValue_(v, 'Nome Completo');
  if (!nome) return;

  var futebolSim = firstValue_(v, 'Você participará do futebol?') === 'Sim';
  var churrascoSim = firstValue_(v, 'Você participará do churrasco?') === 'Sim';
  var quantidade = firstValue_(v, 'Quantas pessoas participarão?');
  var contribuicao = firstValue_(v, 'Deseja contribuir levando algum item?');
  var descricaoContribuicao = firstValue_(v, 'Descreva o que irá levar.');
  var formaPagamento = firstValue_(v, 'Como pretende realizar o pagamento?');
  var valorDinheiro = parseMoneyBR_(firstValue_(v, 'Valor que será pago em dinheiro'));
  var valorPix = parseMoneyBR_(firstValue_(v, 'Valor pago via Pix'));
  var comprovanteId = firstFileId_(firstValue_(v, 'Upload do comprovante'));

  registrarParticipacao_(dataEvento, nome, futebolSim, churrascoSim, quantidade);
  registrarPagamento_(dataEvento, nome, formaPagamento, futebolSim, churrascoSim, quantidade, valorDinheiro, valorPix);
  registrarContribuicao_(dataEvento, nome, contribuicao, descricaoContribuicao);

  if (comprovanteId) arquivarComprovante_(comprovanteId);

  updateDashboard();
}

function firstValue_(namedValues, title) {
  var arr = namedValues[title];
  return arr && arr.length ? String(arr[0]).trim() : '';
}

/** Itens de upload chegam como ID (ou texto contendo o ID) do arquivo no Drive. */
function firstFileId_(rawValue) {
  if (!rawValue) return null;
  var match = rawValue.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

function registrarParticipacao_(dataEvento, nome, futebolSim, churrascoSim, quantidade) {
  var sheet = getSheet_(CONFIG.SHEETS.PARTICIPACOES);
  sheet.appendRow([
    dataEvento,
    nome,
    futebolSim ? 'Sim' : 'Não',
    churrascoSim ? 'Sim' : 'Não',
    churrascoSim ? quantidade : '',
    new Date()
  ]);
}

function registrarPagamento_(dataEvento, nome, formaPagamento, futebolSim, churrascoSim, quantidade, valorDinheiro, valorPix) {
  var sheet = getSheet_(CONFIG.SHEETS.PAGAMENTOS);

  var valorPrevisto = (futebolSim ? CONFIG.VALOR_FUTEBOL : 0) +
    (churrascoSim ? CONFIG.VALOR_CHURRASCO * parseQuantidadePessoas_(quantidade) : 0);

  var valorRecebido;
  if (formaPagamento === 'Pix') {
    valorRecebido = valorPrevisto; // comprovante anexado; confirmação final é manual pelo admin
  } else if (formaPagamento === 'Dinheiro') {
    valorRecebido = valorDinheiro;
  } else {
    valorRecebido = valorPix + valorDinheiro;
  }

  var status = 'Pendente';
  if (valorRecebido >= valorPrevisto && valorPrevisto > 0) status = 'Pago';
  else if (valorRecebido > 0) status = 'Parcial';

  sheet.appendRow([dataEvento, nome, formaPagamento, valorPrevisto, valorRecebido, status]);
}

function registrarContribuicao_(dataEvento, nome, contribuicao, descricao) {
  if (!contribuicao || contribuicao === 'Não') return;
  var sheet = getSheet_(CONFIG.SHEETS.CONTRIBUICOES);
  sheet.appendRow([dataEvento, nome, contribuicao, descricao || '']);
}

function arquivarComprovante_(fileId) {
  try {
    var file = DriveApp.getFileById(fileId);
    var destino = getComprovantesFolder_();
    var parents = file.getParents();
    while (parents.hasNext()) parents.next().removeFile(file);
    destino.addFile(file);
  } catch (err) {
    // Arquivo pode já ter sido movido; não é crítico para o fluxo principal.
  }
}
