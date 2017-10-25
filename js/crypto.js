//Special thanks to Xeth147 for providing this!!

var key = [0xa7ca9f33,
0x66d892c2,
0xf0bef417,
0x341ca971,
0xb69ae9f7,
0xbacccffc,
0xf43c62d1,
0xd7d021f9];

var iv = sjcl.codec.hex.toBits('7475383967656A693334307438397532');

var vaultData = {};

sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."]();

function handleFileSelect(evt) {
    try {
        evt.stopPropagation();
        evt.preventDefault();

        var f = evt.target.files[0];
        var fileName = f.name;

        if (f.size > 10000000) {
            throw ('File exceeds maximum size of 10MB');
        }

        if (f) {
            var reader = new FileReader();

            if (evt.target.id == 'sav_file') {
                reader.onload = function (evt2) {
                    try {
                        decrypt(evt2, fileName, reader.result);
                    } catch (e) {
                        alert("Error: " + e)
                    }
                };
                reader.readAsText(f);
            } else if (evt.target.id == 'json_file') {
                reader.onload = function (evt2) {
                    try {
                        processJSON(jsonStr);
                    } catch (e) {
                        alert("Error: " + e)
                    }
                }
                reader.readAsText(f);
            }
        }
    } catch (e) {
        alert("Error: " + e)
    } finally {
        evt.target.value = null;
    }
}

function decrypt(evt, fileName, base64Str) {
    var cipherBits = sjcl.codec.base64.toBits(base64Str);
    var prp = new sjcl.cipher.aes(key);
    var plainBits = sjcl.mode.cbc.decrypt(prp, cipherBits, iv);
    var jsonStr = sjcl.codec.utf8String.fromBits(plainBits);

    try {
      processJSON();
    } catch (e) {
        throw ('Decrypted file does not contain valid JSON: ' + e);
    }

}

function encrypt(evt, fileName, jsonStr) {
    try {
        JSON.parse(jsonStr);
    } catch (e) {
        throw ('File does not contain valid JSON: ' + e);
    }

    var compactJsonStr = JSON.stringify(JSON.parse(jsonStr));

    var plainBits = sjcl.codec.utf8String.toBits(compactJsonStr);
    var prp = new sjcl.cipher.aes(key);
    var cipherBits = sjcl.mode.cbc.encrypt(prp, plainBits, iv);
    var base64Str = sjcl.codec.base64.fromBits(cipherBits);

    var blob = new Blob([base64Str], {
        type: 'text/plain'
    });
    saveAs(blob, fileName.replace('.txt', '.sav').replace('.json', '.sav'));
}

function processJSON(jsonStr){
      vaultData = JSON.parse(jsonStr);
      reloadTables();
}

function fossdLoad() {
    try {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
            throw ('Your browser does not support HTML5 File APIs');
        }
        if (!new Blob) {
            throw ('Your browser does not support HTML5 Blob type');
        }
        //document.getElementById('json_file').addEventListener('change', handleFileSelect, false);
    } catch (e) {
        alert("Error: " + e)
    }
}

function reloadTables(){
  google.charts.setOnLoadCallback(drawFistTable);
  google.charts.setOnLoadCallback(drawHealthChart);
}

//Create Unarmed Table
function drawFistTable() {
  function getFistTableData(){
    fistTableData = [];
    for(var i=0; i<vaultData.dwellers.dwellers.length; i++){
        if(vaultData.dwellers.dwellers[i].equipedWeapon.id.toLowerCase() === "fist"){
          fistTableData.push(
            [
              vaultData.dwellers.dwellers[i].name+" "+vaultData.dwellers.dwellers[i].lastName
            ]
          )
        }
    }
    return fistTableData;
  }
  fistTableData = getFistTableData();
  if(fistTableData.length > 0){
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addRows(fistTableData);

    var table = new google.visualization.Table(document.getElementById("fist_table_div"));

    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
  } else {
    $("#fist_table_div").text("All Dwellers are armed")
  }
}

function drawHealthChart(){
  function getHealthChartData(){
    healthChartData = [];
    for(var i=0; i<vaultData.dwellers.dwellers.length; i++){
      healthChartData.push(
        [
          vaultData.dwellers.dwellers[i].experience.currentLevel,
          vaultData.dwellers.dwellers[i].health.maxHealth,
          vaultData.dwellers.dwellers[i].name+" "+vaultData.dwellers.dwellers[i].lastName
        ]
      )
    }
    return healthChartData;
  }

  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Level');
  data.addColumn('number', 'Health');
  data.addColumn({type: 'string', role: 'tooltip'});

  data.addRows(getHealthChartData());
  var options = {
    width: 800,
    height: 500
  };

  var chart = new google.charts.Scatter(document.getElementById('health_chart_div'));
  chart.draw(data, google.charts.Scatter.convertOptions(options));
}
