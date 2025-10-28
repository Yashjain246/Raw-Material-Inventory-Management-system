var jpdbBaseUrl = "http://api.login2explore.com:5577"
var jpdbIML = "/api/iml"
var jpdbIRL = "/api/irl"
var conToken = "90934558|-31949210423118502|90959067"
var DB = "inventory"
var Rel = "item"

function resetForm(){
    $('#itemID').val('') 
    $('#itemName').val('') 
    $('#openingStock').val('') 
    $('#uom').val('')
    $('#itemID').prop('disabled',false) 
    $('#save').prop('disabled',false) 
    $('#update').prop('disabled',true) 
    $('#reset').prop('disabled',true) 
    
    $('#itemID').focus();
}

function saveToLocalStore(jsonObj){
    var data = JSON.parse(jsonObj.data)
    localStorage.setItem('item_rec',data.rec_no)
}

function getItemId(){
    var rid = $('#itemID').val()
    var jsonStr = {
        itemID:rid
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    if(jsonObj.status === 400){
        return;
    }
    saveToLocalStore(jsonObj)
    var data = JSON.parse(jsonObj.data).record; 
    $('#itemID').val(data.itemID)
    $('#itemName').val(data.itemName) 
    $('#openingStock').val(data.openingStock) 
    $('#uom').val(data.uom)
}

function checkItemId(){
    
    var rid = getItemId()
    var getreq = createGET_BY_KEYRequest(conToken,DB,Rel,rid)
    
    $.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getreq,jpdbBaseUrl,jpdbIRL)
    $.ajaxSetup({async:true});

    if(resJsonObj.status === 400){ 
        $('#save').prop('disabled',false)
        $('#update').prop('disabled',true)
        $('#reset').prop('disabled',false)
        $('#itemName').focus()
    }
    else if(resJsonObj.status === 200){ 
        $('#itemID').prop('disabled',true) 
        fillData(resJsonObj)
        $('#save').prop('disabled',true)
        $('#update').prop('disabled',false)
        $('#reset').prop('disabled',false)
        $('#itemName').focus()
    }
}

function validateData(){
    var itemID,itemName,openingStock,uom;
    itemID = $('#itemID').val()
    itemName = $('#itemName').val()
    openingStock = $('#openingStock').val()
    uom = $('#uom').val()

    if(itemID === ""){
        alert("please provide itemID")
        $('#itemID').focus()
        return "";
    }
    if(itemName === ""){
        alert("please provide itemName")
        $('#itemName').focus()
        return "";
    }
    if(openingStock === ""){
        alert("please provide openingStock")
        $('#openingStock').focus()
        return "";
    }
    if(uom === ""){
        alert("please provide uom")
        $('#uom').focus()
        return "";
    }

    jsonObj = {
        itemID:itemID,
        itemName:itemName,
        openingStock:openingStock,
        uom:uom,
        itemsReceived:openingStock,
        itemsIssued:0
    }
    return JSON.stringify(jsonObj)
}

function saveData(){
    jsonStr = validateData();
    if(jsonStr===""){
        return 
    }

    var putreq = createPUTRequest(conToken,jsonStr,DB,Rel);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommandAtGivenBaseUrl(putreq,jpdbBaseUrl,jpdbIML)
    $.ajaxSetup({async:true});
    resetForm()
    $("#itemID").focus()
}
function updateData(){
    var jsonchange = validateData()
    if(jsonchange===""){
        return 
    }
    var updreq = createUPDATERecordRequest(conToken,jsonchange,DB,Rel,localStorage.getItem('item_rec'))
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

    $('#itemID').prop('disabled',true);
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

    $('#itemID').prop('disabled',true);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',false);
    $('#reset').prop('disabled',false);

    $('#lastItem').prop('disabled',true)
    $('#nextItem').prop('disabled',true)
    $('#firstItem').prop('disabled',false)
    $('#prevItem').prop('disabled',false)
}
function getPrev(){
    var item_no = localStorage.getItem('item_rec')
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

    $('#itemID').prop('disabled',true);
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
    var item_no = localStorage.getItem('item_rec')
    
    var nextItemReq = createNEXT_RECORDRequest(conToken,DB,Rel,item_no);
    $.ajaxSetup({async:false});
    var resjsonobj = executeCommand(nextItemReq,jpdbIRL);
    fillData(resjsonobj);
    $.ajaxSetup({async:true});

    $('#itemID').prop('disabled',true);
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
