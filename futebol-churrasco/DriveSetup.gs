/**
 * Cria a estrutura de pastas no Google Drive:
 *
 * Futebol e Churrasco
 * ├── Comprovantes Pix
 * ├── Relatórios
 * ├── Eventos
 * └── Backup
 */
function setupDriveStructure() {
  var root = getOrCreateRootFolder_();
  CONFIG.DRIVE_SUBFOLDERS.forEach(function (name) {
    getOrCreateChildFolder_(root, name);
  });
  setProp_(CONFIG.PROP_ROOT_FOLDER_ID, root.getId());
  return root;
}

function getOrCreateRootFolder_() {
  var existingId = getProp_(CONFIG.PROP_ROOT_FOLDER_ID);
  if (existingId) {
    try {
      return DriveApp.getFolderById(existingId);
    } catch (e) {
      // pasta foi removida/perdida; recria abaixo
    }
  }
  var it = DriveApp.getFoldersByName(CONFIG.DRIVE_ROOT_FOLDER);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(CONFIG.DRIVE_ROOT_FOLDER);
}

function getComprovantesFolder_() {
  return getOrCreateChildFolder_(getRootFolder_(), 'Comprovantes Pix');
}

function getRelatoriosFolder_() {
  return getOrCreateChildFolder_(getRootFolder_(), 'Relatórios');
}

function getEventosFolder_() {
  return getOrCreateChildFolder_(getRootFolder_(), 'Eventos');
}

function getBackupFolder_() {
  return getOrCreateChildFolder_(getRootFolder_(), 'Backup');
}
