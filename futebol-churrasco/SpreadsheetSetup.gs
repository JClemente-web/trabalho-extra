/**
 * Cria a planilha mestre "Controle Futebol e Churrasco" dentro da pasta raiz
 * do Drive, com todas as abas e cabeçalhos definidos em CONFIG.HEADERS.
 * DASHBOARD é sempre a primeira aba.
 */
function setupMasterSpreadsheet() {
  var ss = getOrCreateMasterSpreadsheet_();
  moveFileIntoFolder_(ss.getId(), getRootFolder_());

  createOrUpdateSheet_(ss, CONFIG.SHEETS.DASHBOARD, ['DASHBOARD']);
  createOrUpdateSheet_(ss, CONFIG.SHEETS.MEMBROS, CONFIG.HEADERS.MEMBROS);
  createOrUpdateSheet_(ss, CONFIG.SHEETS.EVENTOS, CONFIG.HEADERS.EVENTOS);
  createOrUpdateSheet_(ss, CONFIG.SHEETS.PARTICIPACOES, CONFIG.HEADERS.PARTICIPACOES);
  createOrUpdateSheet_(ss, CONFIG.SHEETS.PAGAMENTOS, CONFIG.HEADERS.PAGAMENTOS);
  createOrUpdateSheet_(ss, CONFIG.SHEETS.CONTRIBUICOES, CONFIG.HEADERS.CONTRIBUICOES);
  createOrUpdateSheet_(ss, CONFIG.SHEETS.ANIVERSARIOS, CONFIG.HEADERS.ANIVERSARIOS);

  // Remove a aba "Sheet1" padrão se ainda existir e não for usada.
  var sheet1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('Página1');
  if (sheet1 && ss.getSheets().length > 1) ss.deleteSheet(sheet1);

  reorderDashboardFirst_(ss);
  setProp_(CONFIG.PROP_SPREADSHEET_ID, ss.getId());

  buildDashboardLayout_(ss.getSheetByName(CONFIG.SHEETS.DASHBOARD));
  updateDashboard();
  return ss;
}

function getOrCreateMasterSpreadsheet_() {
  var id = getProp_(CONFIG.PROP_SPREADSHEET_ID);
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      // planilha perdida; recria abaixo
    }
  }
  var root = getRootFolder_();
  var it = root.getFilesByName(CONFIG.SPREADSHEET_NAME);
  if (it.hasNext()) return SpreadsheetApp.open(it.next());
  return SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
}

function moveFileIntoFolder_(fileId, folder) {
  var file = DriveApp.getFileById(fileId);
  var parents = file.getParents();
  var alreadyThere = false;
  while (parents.hasNext()) {
    var p = parents.next();
    if (p.getId() === folder.getId()) alreadyThere = true;
    else p.removeFile(file);
  }
  if (!alreadyThere) folder.addFile(file);
}

function createOrUpdateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (headers && headers.length > 1) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#34a853').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    for (var c = 1; c <= headers.length; c++) sheet.autoResizeColumn(c);
  }
  return sheet;
}

function reorderDashboardFirst_(ss) {
  var dash = ss.getSheetByName(CONFIG.SHEETS.DASHBOARD);
  if (dash && ss.getSheets()[0].getSheetId() !== dash.getSheetId()) {
    ss.setActiveSheet(dash);
    ss.moveActiveSheet(1);
  }
}
