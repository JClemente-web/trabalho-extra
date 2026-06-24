/**
 * Gera o relatório consolidado de um evento em Google Docs e salva na
 * pasta "Relatórios" do Drive. Chamado pelo menu da planilha.
 */
function gerarRelatorioEvento(dataEventoStr) {
  var participacoes = getSheet_(CONFIG.SHEETS.PARTICIPACOES).getDataRange().getValues().slice(1)
    .filter(function (r) { return String(r[0]).trim() === dataEventoStr; });
  var pagamentos = getSheet_(CONFIG.SHEETS.PAGAMENTOS).getDataRange().getValues().slice(1)
    .filter(function (r) { return String(r[0]).trim() === dataEventoStr; });
  var contribuicoes = getSheet_(CONFIG.SHEETS.CONTRIBUICOES).getDataRange().getValues().slice(1)
    .filter(function (r) { return String(r[0]).trim() === dataEventoStr; });
  var aniversarios = getSheet_(CONFIG.SHEETS.ANIVERSARIOS).getDataRange().getValues().slice(1)
    .filter(function (r) { return r[2]; })
    .sort(function (a, b) { return new Date(a[2]) - new Date(b[2]); })
    .slice(0, 5);

  var jogadores = participacoes.filter(function (r) { return String(r[2]).trim() === 'Sim'; });
  var churrasqueiros = participacoes.filter(function (r) { return String(r[3]).trim() === 'Sim'; });

  var valorPrevisto = pagamentos.reduce(function (s, r) { return s + parseMoneyBR_(r[3]); }, 0);
  var valorRecebido = pagamentos.reduce(function (s, r) { return s + parseMoneyBR_(r[4]); }, 0);
  var pendencias = pagamentos.filter(function (r) { return r[5] === 'Pendente' || r[5] === 'Parcial'; });

  var doc = DocumentApp.create('Relatório do Evento - ' + dataEventoStr);
  var body = doc.getBody();

  body.appendParagraph('Relatório do Evento').setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph('Data do Evento: ' + dataEventoStr);

  body.appendParagraph('Futebol').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Quantidade de jogadores: ' + jogadores.length);
  appendListaNomes_(body, jogadores.map(function (r) { return r[1]; }));

  body.appendParagraph('Churrasco').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  var totalPessoasChurrasco = churrasqueiros.reduce(function (s, r) { return s + parseQuantidadePessoas_(r[4]); }, 0);
  body.appendParagraph('Quantidade total de participantes: ' + totalPessoasChurrasco);
  appendListaNomes_(body, churrasqueiros.map(function (r) { return r[1] + ' (' + r[4] + ' pessoa(s))'; }));

  body.appendParagraph('Financeiro').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph('Valor esperado: ' + formatMoneyBR_(valorPrevisto));
  body.appendParagraph('Valor recebido: ' + formatMoneyBR_(valorRecebido));
  body.appendParagraph('Valor pendente: ' + formatMoneyBR_(valorPrevisto - valorRecebido));

  body.appendParagraph('Pendências').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  if (pendencias.length === 0) {
    body.appendParagraph('Nenhuma pendência registrada.');
  } else {
    appendListaNomes_(body, pendencias.map(function (r) {
      return r[1] + ' — ' + r[5] + ' (previsto ' + formatMoneyBR_(r[3]) + ', recebido ' + formatMoneyBR_(r[4]) + ')';
    }));
  }

  body.appendParagraph('Contribuições').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  if (contribuicoes.length === 0) {
    body.appendParagraph('Nenhuma contribuição registrada.');
  } else {
    appendListaNomes_(body, contribuicoes.map(function (r) {
      return r[1] + ' — ' + r[2] + (r[3] ? ': ' + r[3] : '');
    }));
  }

  body.appendParagraph('Próximos Aniversários').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  if (aniversarios.length === 0) {
    body.appendParagraph('Nenhum aniversário cadastrado.');
  } else {
    appendListaNomes_(body, aniversarios.map(function (r) { return r[0] + ' — ' + formatDateBR_(r[2]); }));
  }

  doc.saveAndClose();
  moveFileIntoFolder_(doc.getId(), getRelatoriosFolder_());
  return doc.getUrl();
}

function appendListaNomes_(body, nomes) {
  if (nomes.length === 0) {
    body.appendParagraph('Nenhum registro.');
    return;
  }
  nomes.forEach(function (nome) {
    body.appendListItem(nome).setGlyphType(DocumentApp.GlyphType.BULLET);
  });
}
