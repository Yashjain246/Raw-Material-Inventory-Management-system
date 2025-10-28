var jpdbBaseUrl = "http://api.login2explore.com:5577"
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl"
var conToken = "90934558|-31949210423118502|90959067"
var DB = "inventory"
var Rel = "inward"

function resetForm(){
    $('#receiptNo').val('') 
    $('#receiptDate').val('') 
    $('#itemID').val('') 
    $('#quantityReceived').val('')
    $('#receiptNo').prop('disabled',false) 
    $('#save').prop('disabled',false) 
    $('#update').prop('disabled',true) 
    $('#reset').prop('disabled',true) 
    
    $('#receiptNo').focus();
}

function saveToLocalStore(jsonObj){
    var data = JSON.parse(jsonObj.data)
    localStorage.setItem('rec',data.rec_no)
}

function getReceiptId(){
    var rid = $('#receiptNo').val()
    var jsonStr = {
        receiptno:rid
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    saveToLocalStore(jsonObj)
    var data = JSON.parse(jsonObj.data).record; 
    $('#receiptNo').val(data.receiptno)
    $('#receiptDate').val(data.receiptdate) 
    $('#itemID').val(data.itemid) 
    $('#quantityReceived').val(data.quantityrecived)
}

function checkReceiptNo(){
    
    var rid = getReceiptId()
    var getreq = createGET_BY_KEYRequest(conToken,DB,Rel,rid)
    $.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getreq,jpdbBaseUrl,jpdbIRL)
    $.ajaxSetup({async:true});

    if(resJsonObj.status === 400){ 
        $('#save').prop('disabled',false)
        $('#update').prop('disabled',true)
        $('#reset').prop('disabled',false)
        $('#receiptDate').focus()
    }
    else if(resJsonObj.status === 200){ 
        $('#receiptNo').prop('disabled',true)
        fillData(resJsonObj)
        $('#save').prop('disabled',true)
        $('#update').prop('disabled',false)
        $('#reset').prop('disabled',false)
        $('#receiptDate').focus()
    }
}

function validateData(){
    var receiptno,receiptdate,itemid,quantityrecived;
    receiptno = $('#receiptNo').val()
    receiptdate = $('#receiptDate').val()
    itemid = $('#itemID').val()
    quantityrecived = $('#quantityReceived').val()

    if(receiptno === ""){
        alert("please provide receiptno")
        $('#receiptNo').focus()
        return "";
    }
    if(receiptdate === ""){
        alert("please provide receiptDate")
        $('#receiptDate').focus()
        return "";
    }
    if(itemid === ""){
        alert("please provide itemid")
        $('#itemid').focus()
        return "";
    }
    if(quantityrecived === ""){
        alert("please provide quantityrecived")
        $('#quantityReceived').focus()
        return "";
    }

    jsonObj = {
        receiptno:receiptno,
        receiptdate:receiptdate,
        itemid:itemid,
        quantityrecived:quantityrecived
    }
    return JSON.stringify(jsonObj)
}

function saveData(){
    jsonStr = validateData();
    if(jsonStr===""){
        return 
    }
    var rid = $('#itemID').val()
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
        
        var putreq = createPUTRequest(conToken,jsonStr,DB,Rel);
        $.ajaxSetup({async:false});
        var resjsonobj = executeCommandAtGivenBaseUrl(putreq,jpdbBaseUrl,jpdbIML)
        $.ajaxSetup({async:true});

        var prevval = parseInt(JSON.parse(getresJsonObj.data).record.itemsReceived,10)
        var currval = parseInt($('#quantityReceived').val(),10)
        
        var itemUpdatereq = {
            "token": conToken,
            "cmd": "UPDATE",
            "dbName": DB,
            "rel": "item",
            "jsonStr": {
                [recno] :{
                "itemsReceived":prevval+currval
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
    $("#receiptNo").focus()
}
function updateData(){
    var jsonchange = validateData()
    if(jsonchange===""){
        return 
    }
    var updreq = createUPDATERecordRequest(conToken,jsonchange,DB,Rel,localStorage.getItem('rec'))
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(updreq,jpdbBaseUrl,jpdbIML)
    $.ajaxSetup({async:true});
    resetForm()
    $('#update').prop('disabled',true)
    $('#reset').prop('disabled',true)
    $("#receiptNo").focus()
}
function getFirst(){
    var firstItemReq = createFIRST_RECORDRequest(conToken,DB,Rel);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(firstItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#receiptNo').prop('disabled',true);
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

    $('#receiptNo').prop('disabled',true);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',false);
    $('#reset').prop('disabled',false);

    $('#lastItem').prop('disabled',true)
    $('#nextItem').prop('disabled',true)
    $('#firstItem').prop('disabled',false)
    $('#prevItem').prop('disabled',false)
}
function getPrev(){
    var item_no = localStorage.getItem('rec')
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

    $('#receiptNo').prop('disabled',true);
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
    var item_no = localStorage.getItem('rec')
    
    var nextItemReq = createNEXT_RECORDRequest(conToken,DB,Rel,item_no);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(nextItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#receiptNo').prop('disabled',true);
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