const SHEET_NAME = 'Issues';
const DRIVE_FOLDER_NAME = 'Demo Review Screenshots';

function testDrive() {
  getOrCreateFolder();
}

function getOrCreateFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function uploadImage(base64Data, filename) {
  try {
    const matches = base64Data.match(/^data:([^;]+);base64,([\s\S]+)$/);
    if (!matches) return '';
    const blob = Utilities.newBlob(Utilities.base64Decode(matches[2]), matches[1], filename);
    const file = getOrCreateFolder().createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return 'https://drive.google.com/uc?export=view&id=' + file.getId();
  } catch(e) {
    Logger.log('uploadImage error: ' + e.toString());
    return '';
  }
}

function doPost(e) {
  try {
    Logger.log('doPost body length: ' + (e.postData ? e.postData.contents.length : 0));
    const data = JSON.parse(e.postData.contents);
    Logger.log('rows received: ' + data.rows.length);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    sheet.clearContents();
    const headers = ['產品', '頁面／畫面', '問題類型', '問題描述', '嚴重程度', '狀態', '備註', '連結', '同步時間'];
    sheet.appendRow(headers);
    const hRange = sheet.getRange(1, 1, 1, headers.length);
    hRange.setBackground('#0f172a');
    hRange.setFontColor('#ffffff');
    hRange.setFontWeight('bold');

    data.rows.forEach((row, i) => {
      let linkValue = row.link || '';
      // 向下相容：若舊資料送的是 imageData，上傳後存 URL
      if (!linkValue && row.imageData && row.imageData.startsWith('data:')) {
        linkValue = uploadImage(row.imageData, 'screenshot-' + Date.now() + '-' + i);
      }
      sheet.appendRow([
        row.product, row.screen, row.type,
        row.description, row.severity, row.status,
        row.notes, linkValue, data.syncedAt,
      ]);
    });

    sheet.autoResizeColumns(1, headers.length);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return ContentService
    .createTextOutput(JSON.stringify({ rows: [] }))
    .setMimeType(ContentService.MimeType.JSON);
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter(r => r[0]).map(r => ({
    product: r[0], screen: r[1], type: r[2],
    description: r[3], severity: r[4], status: r[5],
    notes: r[6], link: r[7] || '',
  }));
  return ContentService
    .createTextOutput(JSON.stringify({ rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
