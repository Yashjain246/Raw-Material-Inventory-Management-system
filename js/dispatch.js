var jpdbBaseUrl = "http://api.login2explore.com:5577"
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl"
var conToken = "90934558|-31949210423118502|90959067"
var DB = "inventory"
var Rel = "outward"

function resetForm(){
    $('#issueNo').val('') 
    $('#issueDate').val('') 
    $('#itemIDOut').val('') 
    $('#quantityIssued').val('')
    $('#issueNo').prop('disabled',false) 
    $('#save').prop('disabled',false) 
    $('#update').prop('disabled',true) 
    $('#reset').prop('disabled',true) 
    
    $('#issueNo').focus();
}

function saveToLocalStore(jsonObj){
    var data = JSON.parse(jsonObj.data)
    localStorage.setItem('out_rec',data.rec_no)
}

function getIssueNo(){
    var rid = $('#issueNo').val()
    var jsonStr = {
        issueNo:rid
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    saveToLocalStore(jsonObj)
    var data = JSON.parse(jsonObj.data).record;
    $('#issueNo').val(data.issueNo) 
    $('#issueDate').val(data.issueDate) 
    $('#itemIDOut').val(data.itemIDOut) 
    $('#quantityIssued').val(data.quantityIssued)
}

function checkIssueNo(){
    
    var rid = getIssueNo()
    var getreq = createGET_BY_KEYRequest(conToken,DB,Rel,rid)
    $.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getreq,jpdbBaseUrl,jpdbIRL)
    $.ajaxSetup({async:true});
    
    if(resJsonObj.status === 400){ 
        $('#save').prop('disabled',false)
        $('#update').prop('disabled',true)
        $('#reset').prop('disabled',false)
        $('#issueDate').focus() 
    }
    else if(resJsonObj.status === 200){ 
        $('#issueNo').prop('disabled',true)
        fillData(resJsonObj)
        $('#save').prop('disabled',true)
        $('#update').prop('disabled',false)
        $('#reset').prop('disabled',false)
        $('#issueDate').focus()
    }
}

function validateData(){
    var issueNo,issueDate,itemIDOut,quantityIssued;
    issueNo = $('#issueNo').val()
    issueDate = $('#issueDate').val()
    itemIDOut = $('#itemIDOut').val()
    quantityIssued = $('#quantityIssued').val()

    if(issueNo === ""){
        alert("please provide issueNo")
        $('#issueNo').focus()
        return "";
    }
    if(issueDate === ""){
        alert("please provide issueDate")
        $('#issueDate').focus()
        return "";
    }
    if(itemIDOut === ""){
        alert("please provide itemIDOut")
        $('#itemIDOut').focus()
        return "";
    }
    if(quantityIssued === ""){
        alert("please provide quantityIssued")
        $('#quantityIssued').focus()
        return "";
    }

    jsonObj = {
        issueNo:issueNo,
        issueDate:issueDate,
        itemIDOut:itemIDOut,
        quantityIssued:quantityIssued
    }
    return JSON.stringify(jsonObj)
}

function saveData(){
    jsonStr = validateData();
    if(jsonStr===""){
        return 
    }

    var rid = $('#itemIDOut').val()
    var jsonStrid = {
        itemID:rid
    }
    rid = JSON.stringify(jsonStrid)

    var getreq = createGET_BY_KEYRequest(conToken,DB,"item",rid)
    
    $.ajaxSetup({async:false});
    var getresJsonObj = executeCommandAtGivenBaseUrl(getreq,jpdbBaseUrl,jpdbIRL)
    $.ajaxSetup({async:true});

    if(getresJsonObj.status === 400){
        alert('Item does not exist');
        $('#itemID').focus();
        return;
    }
    else if(getresJsonObj.status === 200){
        var recno = JSON.parse(getresJsonObj.data).rec_no;
        
        var prevval = parseInt(JSON.parse(getresJsonObj.data).record.itemsIssued,10)
        var currval = parseInt($('#quantityIssued').val(),10)

        var totalstock = parseFloat(JSON.parse(getresJsonObj.data).record.itemsReceived,10)

        if(totalstock-prevval-currval < 0){
            alert("Not enought quantity");
            $('#quantityIssued').focus();
            return;
        }
        
        var putreq = createPUTRequest(conToken,jsonStr,DB,Rel);
        $.ajaxSetup({async:false});
        var resjsonobj = executeCommandAtGivenBaseUrl(putreq,jpdbBaseUrl,jpdbIML)
        $.ajaxSetup({async:true});

        var itemUpdatereq = {
            "token": conToken,
            "cmd": "UPDATE",
            "dbName": DB,
            "rel": "item",
            "jsonStr": {
                [recno] :{
                "itemsIssued":prevval+currval
              }
           }
        }   
        itemUpdatereq = JSON.stringify(itemUpdatereq);
        
        $.ajaxSetup({async:false});
        var upresjsonobj = executeCommandAtGivenBaseUrl(itemUpdatereq,jpdbBaseUrl,jpdbIML)
        $.ajaxSetup({async:true});
        
        if(upresjsonobj.status === 200) {
            alert("Success");
        }else {
            alert("failure");
        }
        
    }
    resetForm()
    $("#issueNo").focus()
    
}
function updateData(){
    var jsonchange = validateData()
    if(jsonchange===""){
        return 
    }
    var updreq = createUPDATERecordRequest(conToken,jsonchange,DB,Rel,localStorage.getItem('out_rec'))
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(updreq,jpdbBaseUrl,jpdbIML)
    $.ajaxSetup({async:true});
    resetForm()
    $('#update').prop('disabled',true)
    $('#reset').prop('disabled',true)   
}

function getFirst(){
    var firstItemReq = createFIRST_RECORDRequest(conToken,DB,Rel);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(firstItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#issueNo').prop('disabled',true);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',false);
    $('#reset').prop('disabled',false);

    $('#firstItem').prop('disabled',true)
    $('#prevItem').prop('disabled',true)
    $('#lastItem').prop('disabled',false)
    $('#nextItem').prop('disabled',false)
}
function getLast(){
    var lastItemReq = createLAST_RECORDRequest(conToken,DB,Rel);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(lastItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#issueNo').prop('disabled',true);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',false);
    $('#reset').prop('disabled',false);

    $('#lastItem').prop('disabled',true)
    $('#nextItem').prop('disabled',true)
    $('#firstItem').prop('disabled',false)
    $('#prevItem').prop('disabled',false)
}
function getPrev(){
    var item_no = localStorage.getItem('out_rec')
    if(item_no === 1){
        $('#firstItem').prop('disabled',true)
        $('#prevItem').prop('disabled',true)
        return;
    }
    var prevItemReq = createPREV_RECORDRequest(conToken,DB,Rel,item_no);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(prevItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#issueNo').prop('disabled',true);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',false);
    $('#reset').prop('disabled',false);

    item_no = JSON.parse(resjsonobj.data).rec_no;
    if(item_no === 1){
        $('#firstItem').prop('disabled',true)
        $('#prevItem').prop('disabled',true)
    }

    $('#lastItem').prop('disabled',false)
    $('#nextItem').prop('disabled',false)
}
function getNext(){
    var item_no = localStorage.getItem('out_rec')
    
    var nextItemReq = createNEXT_RECORDRequest(conToken,DB,Rel,item_no);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(nextItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#issueNo').prop('disabled',true);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',false);
    $('#reset').prop('disabled',false);

    var lastItemReq = createLAST_RECORDRequest(conToken,DB,Rel);
    $.ajaxSetup({async:false});
    var lastresjsonobj = executeCommand(lastItemReq,jpdbIRL);
    $.ajaxSetup({async:true});

    var lastno = JSON.parse(lastresjsonobj.data).rec_no;
    var nextno = JSON.parse(resjsonobj.data).rec_no;
    if(lastno == nextno){
        $('#lastItem').prop('disabled',true)
        $('#nextItem').prop('disabled',true)
    }
    $('#firstItem').prop('disabled',false)
    $('#prevItem').prop('disabled',false)
}