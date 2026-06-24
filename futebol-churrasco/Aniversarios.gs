/**
 * Mantém a aba ANIVERSÁRIOS sincronizada com MEMBROS e recalcula a
 * data do próximo aniversário de cada um, ordenando por proximidade.
 */
function updateAniversarios() {
  var membros = getSheet_(CONFIG.SHEETS.MEMBROS);
  var aniv = getSheet_(CONFIG.SHEETS.ANIVERSARIOS);

  var membrosRows = membros.getDataRange().getValues().slice(1);

  var linhas = membrosRows
    .filter(function (r) { return r[1] && r[3]; }) // Nome e Data de Nascimento presentes
    .map(function (r) {
      var nome = r[1];
      var nascimento = r[3];
      var proximo = nextBirthday_(nascimento);
      return [nome, nascimento, proximo];
    })
    .sort(function (a, b) { return a[2] - b[2]; });

  aniv.getRange(2, 1, Math.max(aniv.getLastRow() - 1, 1), 3).clearContent();
  if (linhas.length > 0) {
    aniv.getRange(2, 1, linhas.length, 3).setValues(linhas);
    aniv.getRange(2, 2, linhas.length, 2).setNumberFormat('dd/mm/yyyy');
  }
}

/** Adiciona ou atualiza um único membro na aba ANIVERSÁRIOS (usado pelo trigger de cadastro). */
function upsertAniversario_(nome, nascimento) {
  var aniv = getSheet_(CONFIG.SHEETS.ANIVERSARIOS);
  var row = findRowByColumnValue_(aniv, 1, function (v) { return normalizeName_(v) === normalizeName_(nome); });
  var proximo = nextBirthday_(nascimento);
  if (row > 0) {
    aniv.getRange(row, 1, 1, 3).setValues([[nome, nascimento, proximo]]);
  } else {
    aniv.appendRow([nome, nascimento, proximo]);
  }
}
