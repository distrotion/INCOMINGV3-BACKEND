const express = require("express");
const router = express.Router();
var mssql = require('./../../function/mssql');
var mongodb = require('./../../function/mongodb');
var mssqlREPORT = require('../../function/mssqlR');

let DBNAME = "IncommingData_GAS12";
let COLECTIONNAME = "main_data_GAS12";
var request = require('request');
// var b64toBlob = require('b64-to-blob');

function _base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function objectIdWithTimestamp(timestamp) {
    /* Convert string date to Date object (otherwise assume timestamp is a date) */
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    /* Convert date object to hex seconds since Unix epoch */
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    /* Create an ObjectId with that hex timestamp */
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId
}

router.post('/tblSAPGoodReceive_get', async (req, res) => {
    console.log("-------- tblSAPGoodReceive_get --------");
    // console.log(req.body);
    let input = req.body;
    //--------------------------------->



    // let output_data = [
    //     {
    //     MATNR: "24000001",
    //     CHARG: "12345678A",
    //     MBLNR: "f3",
    //     BWART: "f4",
    //     MENGE: "f5",
    //     MEINS: "f6",
    //     MAT_FG: "f7",
    //     KUNNR: "f8",
    //     SORTL: "f9",
    //     NAME1: "f10",
    //     CUST_LOT: "f11",
    //     PART_NM: "f12",
    //     PART_NO: "f13",
    //     PROCESS: "f14",
    //     OLDMAT_CP: "f15",
    //     STATUS: "F",
    //     },
    //     {
    //         MATNR: "24000002",
    //         CHARG: "f2-2",
    //         MBLNR: "f3-2",
    //         BWART: "f4-2",
    //         MENGE: "f5-2",
    //         MEINS: "f6-2",
    //         MAT_FG: "f7-2",
    //         KUNNR: "f8-2",
    //         SORTL: "f9-2",
    //         NAME1: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    //         CUST_LOT: "f11-2",
    //         PART_NM: "f12-2",
    //         PART_NO: "f13-2",
    //         PROCESS: "f14-2",
    //         OLDMAT_CP: "f15-2",
    //         STATUS: "F",
    //         }
    // ];

    let querystring  = `SELECT  *
    FROM [SAPData_BP_GAS].[dbo].[tblSAPGoodReceive] `;
    let query = await mssql.qurey(querystring);

    let queryposting = `SELECT  * FROM [SAPData_BP_GAS].[dbo].[tblSAPPostIncoming]`;

    let querypost = await mssql.qurey(queryposting);
    let querypostdata = querypost[`recordsets`][0]
    // let data
    let output_data = query[`recordsets`][0]
    // let data = await mongodb.find(DBNAME, COLECTIONNAME, { $and: [ { MATNR: output_data[0]['MATNR'] }, { CHARG: output_data[0]['CHARG'] } ] });
    

    let output_data_fil = [];
    let output_data_fil_uni = [];
    let output_data_fil_NOuni = [];
    var sl = output_data;
    var out = [];

    for (i = 0, l = sl.length; i < l; i++) {
        var unique = true;
        for (j=0;j<output_data_fil_uni.length;j++) {
            if ((output_data[i]['MATNR']===output_data_fil_uni[j]['MATNR'])&&(output_data[i]['CHARG']===output_data_fil_uni[j]['CHARG'])) {
                unique = false;
            }
        }
        if (unique) {
            output_data_fil_uni.push(sl[i]);
        }else{
            output_data_fil_NOuni.push(sl[i]);
        }
    }

    for (i = 0, l = output_data_fil_uni.length; i < l; i++) {
        var unique = true;
        for (j=0;j<output_data_fil_NOuni.length;j++) {
            if ((output_data_fil_uni[i]['MATNR']===output_data_fil_NOuni[j]['MATNR'])&&(output_data_fil_uni[i]['CHARG']===output_data_fil_NOuni[j]['CHARG'])) {
                if((output_data_fil_uni[i]['BWART']==='504')||(output_data_fil_NOuni[j]['BWART']==='504')){
                    console.log(output_data_fil_uni[i]['MATNR']);
                    unique = false;

                    break;
                }
                
            }
        }
        if (unique) {
            output_data_fil.push(output_data_fil_uni[i]);
        }
    }



    output_data = output_data_fil;
    let data = [];
    //created_at: {$gte: ISODate("2010-04-29T00:00:00.000Z"),$lt: ISODate("2010-05-01T00:00:00.000Z")}
    data = await mongodb.find(DBNAME, COLECTIONNAME, {});
 
    
    // console.log(data[0]["MATNR"]);
    // console.log(output_data_fil[0]["MATNR"]);
    // console.log(output_data[0]['MATNR']);
    // console.log(output_data[0]['CHARG'] );
    if(data.length>0){
    for(i=0;i<output_data.length;i++){
        indata = [];
        for(j=0;j<data.length;j++){
            if((data[j]["MATNR"].toString()===output_data[i]["MATNR"].toString())&&(data[j]["CHARG"].toString()===output_data[i]["CHARG"].toString())){
                indata[0]=data[j];
               
            }

        }

        if(indata[0]===undefined){
            indata[0] = [];
        }
      
        // data = await mongodb.find(DBNAME, COLECTIONNAME, { $and: [ { MATNR: `${output_data[i]['MATNR']}` }, { CHARG: output_data[i]['CHARG'] } ] });
        if(indata.length >0){

            // if(arr.some(item => item.name === 'Blofeld')){

            // }

            // console.log("Appearance for rust" in indata[0]);
            // console.log("Appearance for scratch" in indata[0]);

            // console.log( indata)

            if("Appearance for rust" in indata[0]){
                output_data[i]["Appearance for rust_status"] = indata[0]['Appearance for rust']['status']
            }else{
                output_data[i]["Appearance for rust_status"] ='-'
            }
            if("Appearance for scratch" in indata[0]){
                output_data[i]["Appearance for scratch_status"] = indata[0]['Appearance for scratch']['status']
            }else{
                output_data[i]["Appearance for scratch_status"] ='-'
            }
          
        }else{
            output_data[i]["Appearance for rust_status"] ='-'
            output_data[i]["Appearance for scratch_status"] ='-'
            
        }
    }
}

    kj=0
    output_data_kj = [];

    for(i=0;i<output_data_fil.length;i++){
        if(output_data_fil[i]["Appearance for rust_status"] === 'GOOD' && output_data_fil[i]["Appearance for scratch_status"] === 'GOOD'){

        }else{
            output_data_kj[kj]=  output_data_fil[i];
            kj++
        }

    }

    let output_data_fil2 = [];
    
    for(i=0;i<output_data_kj.length;i++){
        let have = '';
        for(j=0;j<querypostdata.length;j++){
            if((output_data_kj[i]['MATNR']===querypostdata[j]['MATNR'])&&(output_data_kj[i]['CHARG']===querypostdata[j]['CHARG'])){
                have = 'ok'
                break;
            }
        }
        if(have !== 'ok'){
            output_data_fil2.push(output_data_kj[i]);
        }
    }
    //console.log(output_data_kj.length);
    //console.log(output_data_fil.length);
    //console.log(output_data_fil2.length);
    //---  BWART  !== 504 (clean)
    let output_data_fil3 = [];
    for(i=0;i<output_data_fil2.length;i++){
        // console.log(output_data_fil2[i]['CHARG']);
        // console.log(output_data_fil2[i]['BWART']);
        if(output_data_fil2[i]['BWART']==='504'){
            
        }else{
            output_data_fil3.push(output_data_fil2[i]);
        }
    }

    console.log(output_data_kj.length);
    console.log(output_data_fil.length);
    console.log(output_data_fil2.length);
    console.log(output_data_fil3);
    //<---------------------------------
    let output = [{ "status": "ok", "output": output_data_fil3 }];
    res.json(output)
})








module.exports = router;