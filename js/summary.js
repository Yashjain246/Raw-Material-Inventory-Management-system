var jpdbBaseUrl = "http://api.login2explore.com:5577"
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl"
var conToken = "90934558|-31949210423118502|90959067"
var DB = "inventory"
var Rel = "item"

function loadReport() {
    let request = {
        token: '90934558|-31949210423118502|90959067',
        select: { "cols": "*" },
        from: "inventory|item",
        createTime: true,
        updateTime: true
    };

    let getreq = JSON.stringify(request);

    $.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getreq, jpdbBaseUrl, jpdbIRL);
    $.ajaxSetup({async:true});

    let tbody = $('#reportTable tbody');
    tbody.empty();

    if(resJsonObj.status != 200){
        tbody.append('<tr><td colspan="5">Error loading report.</td></tr>');
        return;
    }
    
    let records = resJsonObj.data[1].Records;
    
    if (!records || records.length === 0) {
        tbody.append('<tr><td colspan="5">No items found in inventory.</td></tr>');
        return;
    }

    records.forEach(record => {
        var currstock = record[4] - record[3];
        let row = `<tr>
                        <td>${record[1]}</td> 
                        <td>${record[2]}</td> 
                        <td>${currstock}</td> 
                        <td>${record[5]}</td> 
                        <td>${record[6]}</td> 
                   </tr>`;
        
        tbody.append(row);
    });
}

$(document).ready(function() {
    loadReport();
});