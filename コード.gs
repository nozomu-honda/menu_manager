function doGet() {
  var html = HtmlService.createTemplateFromFile('menuInput');  
  html.title = "こんだて";
  return html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/*function doPost(e) {
  registerMenuToDB(e.parameter.date,e.parameter.cook_pad_url);
  
  //return HtmlService.createHtmlOutput(true);
}*/

function outputMenuData () {
  var spreadSheet = getSpreadSheet();
  var sheet = getSheetByNameOrCreateIfNothing( spreadSheet, "menu_sheet");
  sheet.clear();
  var data = getMenuQueryResult ();
  setQueryResultToSheet( sheet, data);
}

function getSpreadSheet () {
  var url = "https://docs.google.com/spreadsheets/d/1mZ9vJKu2ndCgIE5KgNXbQXOM4zDkSXpCCTKH1ifJaC4/edit#gid=0";
  return SpreadsheetApp.openByUrl(url);
}

function getSheetByNameOrCreateIfNothing ( spreadSheet, name ) {
  var sheets = spreadSheet.getSheets();
  for ( var i in sheets ){
    if ( sheets[i].getSheetName() == name ) {
      return sheets[i];
    }
  }
  return spreadSheet.insertSheet(name);
}

function getMenuQueryResult () {
  var docId = "1dI6fF8qCSgdMwFY3qhhowtb_jZbekKg28mlgNJi8"; //fusiontablesのurlに含まれるdocid;
  
  var sql = 'SELECT * FROM ' + docId + ' LIMIT 100';
  return FusionTables.Query.sql(sql);
}

function setQueryResultToSheet ( sheet, result) {
  sheet.getRange(2,1,result.rows.length, result.columns.length).setValues(result.rows);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function registerFromForm(form) {
  registerMenuToDB(form.date,form.cook_pad_url);
  return false;
}

function registerMenuToDB(date,cook_pad_url) {
  Logger.log(date);
  Logger.log(cook_pad_url);
  var docId = "1dI6fF8qCSgdMwFY3qhhowtb_jZbekKg28mlgNJi8"; //fusiontablesのurlに含まれるdocid;
  var sql = "INSERT INTO " + docId + " (Date, CookPadUrl) VALUES ( \'" + date + "\', \'"+ cook_pad_url + "\')";
  Logger.log(sql);
  FusionTables.Query.sql(sql);
}
