/**
 * Painel gerencial. buildDashboardLayout_ desenha os rótulos uma única vez;
 * updateDashboard() recalcula apenas os valores e pode ser chamado a qualquer
 * momento (trigger de formulário, trigger diário ou pelo menu).
 */

var DASH_CELL = {
  TOTAL_FUTEBOL: 'C4',
  TOTAL_CHURRASCO: 'C5',
  TOTAL_GERAL: 'C6',

  VALOR_PREVISTO: 'C10',
  VALOR_RECEBIDO: 'C11',
  VALOR_PENDENTE: 'C12',

  CONTRIB_CARNE: 'C17',
  CONTRIB_BEBIDAS: 'C18',
  CONTRIB_GELO: 'C19',
  CONTRIB_CARVAO: 'C20',
  CONTRIB_SOBREMESAS: 'C21',
  CONTRIB_OUTROS: 'C22',

  ANIVERSARIOS_START_ROW: 26
};

function buildDashboardLayout_(sheet) {
  sheet.clear();
  sheet.setColumnWidths(1, 4, 220);

  setSectionTitle_(sheet, 'A1', 'DASHBOARD — Futebol e Churrasco');
  sheet.getRange('A1').setFontSize(16);

  setSectionTitle_(sheet, 'A3', 'Participação');
  sheet.getRange('A4').setValue('Total de jogadores confirmados');
  sheet.getRange('A5').setValue('Total de participantes do churrasco');
  sheet.getRange('A6').setValue('Total geral de pessoas');

  setSectionTitle_(sheet, 'A9', 'Financeiro');
  sheet.getRange('A10').setValue('Valor previsto');
  sheet.getRange('A11').setValue('Valor recebido');
  sheet.getRange('A12').setValue('Valor pendente');

  setSectionTitle_(sheet, 'A16', 'Contribuições');
  sheet.getRange('A17').setValue('Carne');
  sheet.getRange('A18').setValue('Bebidas (Refrigerante + Cerveja)');
  sheet.getRange('A19').setValue('Gelo');
  sheet.getRange('A20').setValue('Carvão');
  sheet.getRange('A21').setValue('Sobremesas');
  sheet.getRange('A22').setValue('Outros');

  setSectionTitle_(sheet, 'A25', 'Próximos Aniversários');
  sheet.getRange('A25').offset(0, 1).setValue('Data do Aniversário');
  sheet.getRange(25, 1, 1, 2).setFontWeight('bold');
}

function setSectionTitle_(sheet, cell, text) {
  var range = sheet.getRange(cell);
  range.setValue(text);
  range.setFontWeight('bold');
  range.setBackground('#e8f0fe');
}

function updateDashboard() {
  var ss = getMasterSpreadsheet_();
  var dash = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  if (!dash) return;

  updateParticipacaoSummary_(dash);
  updateFinanceiroSummary_(dash);
  updateContribuicoesSummary_(dash);
  updateAniversariosSummary_(dash);
}

function updateParticipacaoSummary_(dash) {
  var part = getSheet_(CONFIG.SHEETS.PARTICIPACOES);
  var rows = part.getDataRange().getValues().slice(1);

  var totalFutebol = 0, totalChurrasco = 0, totalPessoasChurrasco = 0;
  rows.forEach(function (r) {
    var futebol = String(r[2]).trim().toLowerCase() === 'sim';
    var churrasco = String(r[3]).trim().toLowerCase() === 'sim';
    if (futebol) totalFutebol++;
    if (churrasco) {
      totalChurrasco++;
      totalPessoasChurrasco += parseQuantidadePessoas_(r[4]);
    }
  });

  dash.getRange(DASH_CELL.TOTAL_FUTEBOL).setValue(totalFutebol);
  dash.getRange(DASH_CELL.TOTAL_CHURRASCO).setValue(totalChurrasco);
  dash.getRange(DASH_CELL.TOTAL_GERAL).setValue(totalPessoasChurrasco + totalFutebol === 0 ? 0 : Math.max(totalPessoasChurrasco, totalChurrasco) + totalFutebol);
}

/** Converte "1".."4" em número e "5+" em 5 (mínimo) para fins de soma. */
function parseQuantidadePessoas_(value) {
  var s = String(value || '').trim();
  if (s.indexOf('5+') > -1) return 5;
  var n = parseInt(s, 10);
  return isNaN(n) ? 0 : n;
}

function updateFinanceiroSummary_(dash) {
  var pag = getSheet_(CONFIG.SHEETS.PAGAMENTOS);
  var rows = pag.getDataRange().getValues().slice(1);

  var previsto = 0, recebido = 0;
  rows.forEach(function (r) {
    previsto += parseMoneyBR_(r[3]);
    recebido += parseMoneyBR_(r[4]);
  });

  dash.getRange(DASH_CELL.VALOR_PREVISTO).setValue(formatMoneyBR_(previsto));
  dash.getRange(DASH_CELL.VALOR_RECEBIDO).setValue(formatMoneyBR_(recebido));
  dash.getRange(DASH_CELL.VALOR_PENDENTE).setValue(formatMoneyBR_(previsto - recebido));
}

function updateContribuicoesSummary_(dash) {
  var contrib = getSheet_(CONFIG.SHEETS.CONTRIBUICOES);
  var rows = contrib.getDataRange().getValues().slice(1);

  var totals = { Carne: 0, Bebidas: 0, Gelo: 0, Carvão: 0, Sobremesa: 0, Outros: 0 };
  rows.forEach(function (r) {
    var categoria = String(r[2] || '').trim();
    if (categoria === 'Refrigerante' || categoria === 'Cerveja') totals.Bebidas++;
    else if (totals.hasOwnProperty(categoria)) totals[categoria]++;
    else if (categoria && categoria !== 'Não') totals.Outros++;
  });

  dash.getRange(DASH_CELL.CONTRIB_CARNE).setValue(totals.Carne);
  dash.getRange(DASH_CELL.CONTRIB_BEBIDAS).setValue(totals.Bebidas);
  dash.getRange(DASH_CELL.CONTRIB_GELO).setValue(totals.Gelo);
  dash.getRange(DASH_CELL.CONTRIB_CARVAO).setValue(totals['Carvão']);
  dash.getRange(DASH_CELL.CONTRIB_SOBREMESAS).setValue(totals.Sobremesa);
  dash.getRange(DASH_CELL.CONTRIB_OUTROS).setValue(totals.Outros);
}

function updateAniversariosSummary_(dash) {
  var anivSheet = getSheet_(CONFIG.SHEETS.ANIVERSARIOS);
  var rows = anivSheet.getDataRange().getValues().slice(1);

  var startRow = DASH_CELL.ANIVERSARIOS_START_ROW;
  var maxRows = 10;

  // Limpa a área anterior antes de reescrever.
  dash.getRange(startRow, 1, maxRows, 2).clearContent();

  var proximos = rows
    .filter(function (r) { return r[2]; })
    .sort(function (a, b) { return new Date(a[2]) - new Date(b[2]); })
    .slice(0, maxRows);

  proximos.forEach(function (r, i) {
    dash.getRange(startRow + i, 1).setValue(r[0]);
    dash.getRange(startRow + i, 2).setValue(formatDateBR_(r[2]));
  });
}
