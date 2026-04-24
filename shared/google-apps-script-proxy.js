/**
 * Google Apps Script — UX Copy Review Proxy
 *
 * 部署步驟：
 * 1. 開啟 https://script.google.com → 新增專案
 * 2. 把這個檔案的內容貼進 Code.gs
 * 3. 點「部署」→「新增部署作業」→ 類型選「網頁應用程式」
 * 4. 「執行身份」選你自己，「誰可以存取」選「所有人」
 * 5. 點部署 → 複製 URL（格式：https://script.google.com/macros/s/XXXX/exec）
 * 6. 把這個 URL 貼到 ux-copy-teacher.html / ux-copy-student.html 的 REVIEW_JSON_URL 常數
 *
 * 使用方式：
 * - 讀取：GET https://script.google.com/macros/s/XXXX/exec?file=teacher-review.json
 * - 寫入：POST https://script.google.com/macros/s/XXXX/exec
 *         body: { file: "teacher-review.json", content: { changes: [...] } }
 */

var FOLDER_ID = '1YmImXHDiPpUY3ZXS-Htep4jqbxXmvXOQ';

// GET — 讀取 JSON 檔案
function doGet(e) {
  var fileName = (e && e.parameter && e.parameter.file) || 'teacher-review.json';
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var files = folder.getFilesByName(fileName);

  if (files.hasNext()) {
    var content = files.next().getBlob().getDataAsString();
    return ContentService.createTextOutput(content)
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput('{"changes":[]}')
    .setMimeType(ContentService.MimeType.JSON);
}

// POST — 寫入/更新 JSON 檔案
function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var fileName = body.file || 'teacher-review.json';
  var content = JSON.stringify(body.content, null, 2);
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var files = folder.getFilesByName(fileName);

  if (files.hasNext()) {
    // 更新現有檔案
    var file = files.next();
    file.setContent(content);
  } else {
    // 建立新檔案
    folder.createFile(fileName, content, 'application/json');
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true, file: fileName }))
    .setMimeType(ContentService.MimeType.JSON);
}