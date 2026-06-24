/**
 * Triggers de manutenção automática. Os triggers de onFormSubmit por
 * formulário são instalados individualmente em CadastroForm.gs e
 * EventoForm.gs no momento da criação de cada formulário.
 */
function installDailyMaintenanceTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'dailyMaintenance') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyMaintenance')
    .timeBased()
    .everyDays(1)
    .atHour(6)
    .create();
}

/** Recalcula aniversários e dashboard diariamente, independente de novos envios. */
function dailyMaintenance() {
  updateAniversarios();
  updateDashboard();
}

/**
 * Necessário apenas se este projeto Apps Script for standalone (não vinculado
 * diretamente à planilha). Instala um trigger "ao abrir" para que o menu
 * "Futebol e Churrasco" apareça automaticamente quando a planilha for aberta.
 * Rode esta função manualmente uma vez, pelo editor de script.
 */
function installOnOpenTrigger() {
  var ss = getMasterSpreadsheet_();
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onOpen') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onOpen')
    .forSpreadsheet(ss)
    .onOpen()
    .create();
}
