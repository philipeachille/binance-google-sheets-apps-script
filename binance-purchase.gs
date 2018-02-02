// This file deals with executing BUY orders on Binance

function executePurchase() {
    var purchaseList = preparePurchaseList();
  
    for (i = 0; i < purchaseList.length; i++) {
     
      var purchase = purchaseBinance(purchaseList[i][0],purchaseList[i][1]);
      
      if (purchase[0] == 200) {
        writeToPurchaseLog(purchase[1]);
      }
     
      Utilities.sleep(3000);
    }
  
}

function purchaseBinance(pair,quantity) {
 
    var key = '3BNVHfXujYPU0BwU6XpJQMOJO8G2opXnTIdXHjlDffcGiCqzNEgggW7xnWPzYI0z', 
        secret = 'P0YVbG7qhyEJBGoMdYspaWUvVova5hLBGaw9IcDYCJzYfiqCAwVpeA7qCCiQLFEY',
    
        baseUrl = "https://api.binance.com",
        api = "/api/v3/order", 
  
        apiStrings = {
          'symbol' : pair,
          'side' : 'BUY',
          'type' : 'MARKET',
          'quantity' : quantity,
          'timestamp': Number(new Date().getTime()).toFixed(0)
        },
  
        params = {
          'method': 'post',
          'headers': {'X-MBX-APIKEY': key},
          'muteHttpExceptions': true
        };

    var active = SpreadsheetApp.getActiveSpreadsheet(),
        logs_sheet = active.getSheetByName("Execution Log");  

    var string = Object.keys(apiStrings).reduce(function(a,k){a.push(k+'='+encodeURIComponent(apiStrings[k]));return a},[]).join('&'),
        signature = Utilities.computeHmacSha256Signature(string, secret);
  
    signature = signature.map(function(e) {
        var v = (e < 0 ? e + 256 : e).toString(16);
        return v.length == 1 ? "0" + v : v;
    }).join("");
  
    var query = "?" + string + "&signature=" + signature;
  
    
 try {
  
  var counter = 1;

  while (counter < 4) {
    
//      var response = UrlFetchApp.fetch(baseUrl + api + query, params);
  //    var response_code = response.getResponseCode();
    //  var data = JSON.parse(response.getContentText());

      var response_code = testMaterial()[0];
      var data = testMaterial()[1];
    
    var scriptDate = new Date();
    
    if (response_code !== 200) {
      counter += 1;
      logs_sheet.appendRow([new Date(),"PURCHASE ORDER REQUEST FAILED","try again",response_code, data]);

      Utilities.sleep(20000);
    } else {
      counter += 99;

      var write = [];

        write.push([
          scriptDate,
          new Date(data.transactTime),
          data.type,
          data.side,
          data.status,
          data.symbol,
          data.origQty,
          data.executedQty,
          data.price,
          // averagePrice(data.fills),
          data.orderId,
          data.clientOrderId,
          data.timeInForce,
        ]);
        Logger.log(write); 
 
    }
  }

          
  if (counter === 100) {
    logs_sheet.appendRow([scriptDate,"PURCHASE ORDER REQUEST SUCCESSFUL",data.side,data.status,data.symbol,data.executedQty,data.price,data.orderId]);
    return [response_code, write];
  } else {
    logs_sheet.appendRow([scriptDate,"PURCHASE ORDER REQUEST FAILED","stopped trying",response_code, data]);
//    return [response_code, data];
  }  
    
  } catch (e) {
   logs_sheet.appendRow([new Date(),"PURCHASE ORDER EXECUTION ERROR","when dealing with response. Order may have executed still. Compare time stamps."]);
  // return [0,["Error when dealing with response. Order may have executed still. Compare time stamps."]];
  }  
}
  
  
  
  
/***************  HELPER FUNCTIONS  *******************/

  
function preparePurchaseList() {
    var active = SpreadsheetApp.getActiveSpreadsheet(),
        sheet = active.getSheetByName("Purchase List");
    
    var purchaseList = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
    
  return purchaseList;
}
  

function writeToPurchaseLog(write) {
        
    var active = SpreadsheetApp.getActiveSpreadsheet(),
        sheet = active.getSheetByName("Binance Log");
    
    sheet.insertRowsBefore(10, write.length);
    sheet.getRange(10,3,write.length,write[0].length).setValues(write);
   
}

  
function averagePrice(fills) {

  var totalPrice = 0;
  var totalAmount = 0;
  
  for (i = 0; i < fills.length; i++) {
        
    var price = Number(fills[i].price),
        amount = Number(fills[i].qty),
        factor = price * amount;
    
    totalPrice += factor;
    totalAmount += amount
    
  }
  
  var averagePrice = totalPrice/totalAmount,
      averagePrice = averagePrice.toFixed(8);
  
  return averagePrice;
}
  
  
function checkOrder(pair,quantity) {
 
    var key = '3BNVHfXujYPU0BwU6XpJQMOJO8G2opXnTIdXHjlDffcGiCqzNEgggW7xnWPzYI0z', 
        secret = 'P0YVbG7qhyEJBGoMdYspaWUvVova5hLBGaw9IcDYCJzYfiqCAwVpeA7qCCiQLFEY',
    
        baseUrl = "https://api.binance.com",
        api = "/api/v3/order", 
  
        apiStrings = {
          'symbol' : 'FUNBTC',
          'orderId' : 6140503,
          'timestamp': Number(new Date().getTime()).toFixed(0)
        },
  
        params = {
          'method': 'get',
          'headers': {'X-MBX-APIKEY': key},
          'muteHttpExceptions': true
        };

    var active = SpreadsheetApp.getActiveSpreadsheet(),
        logs_sheet = active.getSheetByName("Execution Log");  

    var string = Object.keys(apiStrings).reduce(function(a,k){a.push(k+'='+encodeURIComponent(apiStrings[k]));return a},[]).join('&'),
        signature = Utilities.computeHmacSha256Signature(string, secret);
  
    signature = signature.map(function(e) {
        var v = (e < 0 ? e + 256 : e).toString(16);
        return v.length == 1 ? "0" + v : v;
    }).join("");
  
    var query = "?" + string + "&signature=" + signature;
  
    
 try {
  
  var counter = 1;

  while (counter < 4) {
    
      var response = UrlFetchApp.fetch(baseUrl + api + query, params);
      var response_code = response.getResponseCode();
      var data = JSON.parse(response.getContentText());

//      var response_code = testMaterial()[0];
  //    var data = testMaterial()[1];
    
    var scriptDate = new Date();
    
    if (response_code !== 200) {
      counter += 1;
      logs_sheet.appendRow([new Date(),"CHECK ORDER REQUEST FAILED","try again",response_code, data]);

      Utilities.sleep(20000);
    } else {
      counter += 99;

      var write = [];

        write.push([
          scriptDate,
          new Date(data.time),
          data.type,
          data.side,
          data.status,
          data.symbol,
          data.origQty,
          data.executedQty,
          data.price,
          // averagePrice(data.fills),
          data.stopPrice,
          data.icebergQty,
          data.orderId,
          data.clientOrderId,
          data.timeInForce,
          data.isWorking
        ]);
        Logger.log(write); 
 
    }
  }
          
  if (counter === 100) {
    logs_sheet.appendRow([scriptDate,"CHECK ORDER REQUEST SUCCESSFUL",data.side,data.status,data.symbol,data.executedQty,data.price,data.orderId]);
//    return [response_code, write];
  } else {
    logs_sheet.appendRow([scriptDate,"CHECK ORDER REQUEST FAILED","stopped trying",response_code, data]);
//    return [response_code, data];
  }  
    
  } catch (e) {
   logs_sheet.appendRow([new Date(),"CHECK ORDER EXECUTION ERROR","when dealing with response. Order may have executed still. Compare time stamps."]);
  // return [0,["Error when dealing with response. Order may have executed still. Compare time stamps."]];
  }  
}
  
function allAccountOrders(pair,quantity) {
 
    var key = '3BNVHfXujYPU0BwU6XpJQMOJO8G2opXnTIdXHjlDffcGiCqzNEgggW7xnWPzYI0z', 
        secret = 'P0YVbG7qhyEJBGoMdYspaWUvVova5hLBGaw9IcDYCJzYfiqCAwVpeA7qCCiQLFEY',
    
        baseUrl = "https://api.binance.com",
        api = "/api/v3/allOrders", 
  
        apiStrings = {
          'symbol' : 'FUNBTC',
          'timestamp': Number(new Date().getTime()).toFixed(0)
        },
  
        params = {
          'method': 'get',
          'headers': {'X-MBX-APIKEY': key},
          'muteHttpExceptions': true
        };

    var active = SpreadsheetApp.getActiveSpreadsheet(),
        logs_sheet = active.getSheetByName("Execution Log");  

    var string = Object.keys(apiStrings).reduce(function(a,k){a.push(k+'='+encodeURIComponent(apiStrings[k]));return a},[]).join('&'),
        signature = Utilities.computeHmacSha256Signature(string, secret);
  
    signature = signature.map(function(e) {
        var v = (e < 0 ? e + 256 : e).toString(16);
        return v.length == 1 ? "0" + v : v;
    }).join("");
  
    var query = "?" + string + "&signature=" + signature;
  
    
 try {
  
  var counter = 1;

  while (counter < 4) {
    
      var response = UrlFetchApp.fetch(baseUrl + api + query, params);
      var response_code = response.getResponseCode();
      var data = JSON.parse(response.getContentText());
    
    var scriptDate = new Date();
    
    if (response_code !== 200) {
      counter += 1;
      logs_sheet.appendRow([new Date(),"ALL ORDERS REQUEST FAILED","try again",response_code, data]);

      Utilities.sleep(20000);
    } else {
      counter += 99;

      var write = [];

        write.push([
          scriptDate,
          new Date(data.time),
          data.type,
          data.side,
          data.symbol,
          data.origQty,
          data.executedQty,
          data.price,
          data.stopPrice,
          data.icebergQty,
          data.orderId,
          data.clientOrderId,
          data.timeInForce,
          data.isWorking
        ]);
 
    }
  }
   
   
  if (counter === 100) {
    logs_sheet.appendRow([scriptDate,"ALL ORDERS REQUEST SUCCESSFUL",data.side,data.status,data.symbol,data.executedQty,data.price,data.orderId]);
  } else {
    logs_sheet.appendRow([scriptDate,"ALL ORDERS REQUEST FAILED","stopped trying",response_code, data]);
  }  
    
  } catch (e) {
   logs_sheet.appendRow([new Date(),"ALL ORDERS EXECUTION ERROR","when dealing with response. Order may have executed still. Compare time stamps."]);
  }  
}
  
  

function testMaterial() {
  
  
    return [200, {"symbol": "BTCUSDT",
  "orderId": 28,
  "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",
  "transactTime": 1507725176595,
  "price": "0.00000000",
  "origQty": "10.00000000",
  "executedQty": "10.00000000",
  "status": "FILLED",
  "timeInForce": "GTC",
  "type": "MARKET",
  "side": "SELL",
  "fills": [
    {
      "price": "4000.00000000",
      "qty": "1.00000000",
      "commission": "4.00000000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3999.00000000",
      "qty": "5.00000000",
      "commission": "19.99500000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3998.00000000",
      "qty": "2.00000000",
      "commission": "7.99600000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3997.00000000",
      "qty": "1.00000000",
      "commission": "3.99700000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3995.00000000",
      "qty": "1.00000000",
      "commission": "3.99500000",
      "commissionAsset": "USDT"
    }
  ]}];  

}
  
 
  
  
/***************  RESOURES USED *******************


https://gist.github.com/tanaikech/175067567819577fd8eba9b82eabd1a6

Thanks @tanaikech !
****************/


  
  
