/**
 * Funções utilitárias compartilhadas entre os módulos do sistema.
 */

function getProp_(key) {
  return PropertiesService.getScriptProperties().getProperty(key);
}

function setProp_(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, value);
}

function getRootFolder_() {
  var id = getProp_(CONFIG.PROP_ROOT_FOLDER_ID);
  if (!id) {
    throw new Error('Estrutura do Drive ainda não foi criada. Execute "Configurar tudo" no menu primeiro.');
  }
  return DriveApp.getFolderById(id);
}

function getOrCreateChildFolder_(parentFolder, name) {
  var it = parentFolder.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parentFolder.createFolder(name);
}

function getMasterSpreadsheet_() {
  var id = getProp_(CONFIG.PROP_SPREADSHEET_ID);
  if (!id) {
    throw new Error('Planilha mestre ainda não foi criada. Execute "Configurar tudo" no menu primeiro.');
  }
  return SpreadsheetApp.openById(id);
}

function getSheet_(name) {
  var ss = getMasterSpreadsheet_();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error('Aba "' + name + '" não encontrada na planilha mestre.');
  }
  return sheet;
}

/** Normaliza WhatsApp mantendo apenas dígitos, para comparação de duplicidade. */
function normalizePhone_(phone) {
  return String(phone || '').replace(/\D/g, '');
}

/** Normaliza nome para comparação (sem acentos, minúsculo, espaços simples). */
function normalizeName_(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

function formatDateBR_(date) {
  if (!date) return '';
  if (!(date instanceof Date)) date = new Date(date);
  return Utilities.formatDate(date, CONFIG.TIMEZONE || Session.getScriptTimeZone(), 'dd/MM/yyyy');
}

function parseMoneyBR_(value) {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  var s = String(value).trim().replace(/[^\d,.-]/g, '');
  // Trata formatos "30,00" e "30.00" e "1.234,56"
  if (s.indexOf(',') > -1) {
    s = s.replace(/\./g, '').replace(',', '.');
  }
  var n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function formatMoneyBR_(value) {
  var n = Number(value) || 0;
  return 'R$ ' + n.toFixed(2).replace('.', ',');
}

/** Retorna a próxima ocorrência (a partir de hoje) de uma data de nascimento. */
function nextBirthday_(birthDate) {
  if (!birthDate) return null;
  if (!(birthDate instanceof Date)) birthDate = new Date(birthDate);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var next = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
  }
  return next;
}

/** Procura, dentro de uma aba, a linha cujo valor na coluna indicada (1-based) bate com o critério. Retorna o índice da linha (1-based) ou -1. */
function findRowByColumnValue_(sheet, columnIndex, matchFn) {
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (matchFn(values[i][columnIndex - 1])) return i + 1;
  }
  return -1;
}

function nextId_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 1;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map(function (r) { return Number(r[0]) || 0; });
  return Math.max.apply(null, ids) + 1;
}

function findImageFileInRoot_(filename) {
  var root = getRootFolder_();
  var it = root.getFilesByName(filename);
  return it.hasNext() ? it.next() : null;
}
