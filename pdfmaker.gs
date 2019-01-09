function mergeDocs(){
  
  var FILE_ID = "1qrfA6To0ywhKQpJZtoE2txclJww0RuG6upVitw3jBQE"; // contract
  var FOLDER_ID = "1EjEd7I_I8MoZJVBNt7spKF2gRxGM30h0"; // contract folder
  var FOLDER = DriveApp.getFolderById(FOLDER_ID);
  
  // Set up the sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rangeData = ss.getDataRange();
  var lastColumn = rangeData.getLastColumn();
  var lastRow = rangeData.getLastRow();
  
  // Get the doc
  var originalDoc = DriveApp.getFileById(FILE_ID);
  
  var columns = ["Band", "Fee", "Venue", "Venue Address", "Date", "Time"];
  
  for(i=2; i<lastRow+1; i++){
    // already done? check first
    var already = rangeData.getCell(i, 15).getValue();
    if(already === ""){
      
      var bandName = rangeData.getCell(i, 1).getValue(); Logger.log(bandName);
      var newDoc = originalDoc.makeCopy("2018 UMS Contract - " + bandName, FOLDER); // will put the file in the same folder. Creates a FileApp obj.
      var newDocId = newDoc.getId();
      var newDoc = DocumentApp.openById(newDocId); // get the DocumentApp obj;
      var newURL = newDoc.getUrl();
      var body = newDoc.getBody();
      // loop through each column
      
      for(j=1; j<lastColumn+1; j++){
        var columnName = rangeData.getCell(1,j).getValue(); // Can probably save some processing time here.
        if(columns.includes(columnName)) {
          var thisValue = rangeData.getCell(i,j).getValue();
          if(columnName === "Date"){
            thisValue = thisValue.toLocaleDateString("en-US");
          }
          if(columnName === "Time"){
            thisValue = thisValue.toLocaleTimeString('en-US', {hour: "2-digit", minute: "2-digit"});
          }
          if(columnName === "Fee"){
            thisValue = "$" + thisValue.formatMoney(2);
          }
  
          body.replaceText("<<" + columnName + ">>", thisValue);
        } // if contains
        
      } // column for loop
      ss.getRange(i, 15).setValue(newURL); // append link to file
      
      // create PDF
      newDoc.saveAndClose();
      var pdf = newDoc.getAs('application/pdf');
      pdf.setName(newDoc.getName() + ".pdf");
      var file = DriveApp.createFile(pdf); // move outside loop?
      file.makeCopy(FOLDER);
      file.setTrashed(true);
    } // if already done
  } // for
//  

  
}
//mergeDocs();

Number.prototype.formatMoney = function(c, d, t){
    var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };


// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1. 
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}
