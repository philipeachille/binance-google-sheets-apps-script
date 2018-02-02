// This file deals with STOP LOSS orders, to be placed after BUY orders are filled.
// 


function executeStopLoss() {
    var purchaseList = preparePurchaseList();
  
    for (i = 0; i < purchaseList.length; i++) {
     
      var purchase = stopLossBinance(purchaseList[i][0],purchaseList[i][1]);
      
        Logger.log(purchase);
    }
}



function stopLossBinance(pair,quantity) {
    
  var stop_price = bookTickerBinance(pair);
  
  return stop_price;
 
  
  /** 
    var key = '3BNVHfXujYPU0BwU6XpJQMOJO8G2opXnTIdXHjlDffcGiCqzNEgggW7xnWPzYI0z', 
        secret = 'P0YVbG7qhyEJBGoMdYspaWUvVova5hLBGaw9IcDYCJzYfiqCAwVpeA7qCCiQLFEY',
    
        baseUrl = "https://api.binance.com",
        api = "/api/v3/order", 
  
        apiStrings = {
          'symbol' : pair,
          'side' : 'SELL',
          'type' : 'STOP_LOSS',
          'stopPrice' : stop_price,
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
    
      var response = UrlFetchApp.fetch(baseUrl + api + query, params);
      var response_code = response.getResponseCode();
      var data = JSON.parse(response.getContentText());
    
    var scriptDate = new Date();
    
    if (response_code !== 200) {
      counter += 1;
      logs_sheet.appendRow([new Date(),"PLACE STOP ORDER REQUEST FAILED","try again",response_code, data]);

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
          data.orderId,
          data.clientOrderId,
          data.timeInForce,
        ]);
        Logger.log(write); 
 
    }
  }

          
  if (counter === 100) {
    logs_sheet.appendRow([scriptDate,"PLACE STOP ORDER REQUEST SUCCESSFUL",data.side,data.status,data.symbol,data.executedQty,data.price,data.orderId]);
    return [response_code, write];
  } else {
    logs_sheet.appendRow([scriptDate,"PLACE STOP ORDER REQUEST FAILED","stopped trying",response_code, data]);
  }  
    
  } catch (e) {
   logs_sheet.appendRow([new Date(),"PLACE STOP ORDER EXECUTION ERROR","when dealing with response. Order may have executed still. Compare time stamps."]);
  }  **/
}
  
  
function bookTickerBinance(pair) {
    
    var baseUrl = "https://api.binance.com",
        api = "/api/v3/ticker/bookTicker", 
  
        apiStrings = {
          'symbol' : pair
        },
  
        params = {
          'method': 'get',
          'muteHttpExceptions': true
        };

    var active = SpreadsheetApp.getActiveSpreadsheet(),
        logs_sheet = active.getSheetByName("Execution Log");  

    var string = Object.keys(apiStrings).reduce(function(a,k){a.push(k+'='+encodeURIComponent(apiStrings[k]));return a},[]).join('&'),
        query = "?" + string;
  

 try {
  
  var counter = 1;

  while (counter < 4) {
    
      var response = UrlFetchApp.fetch(baseUrl + api + query, params);
      var response_code = response.getResponseCode();
      var data = JSON.parse(response.getContentText());
    
    var scriptDate = new Date();
    
    if (response_code !== 200) {
      counter += 1;
      logs_sheet.appendRow([new Date(),"GET TICKER REQUEST FAILED","try again",response_code, data]);

      Utilities.sleep(20000);
    } else {
      counter += 99;

      var write = [];

        write.push([
          scriptDate,
          data.symbol,
          data.bidPrice,
          data.askPrice,
          data.bidQty,
          data.askQty
        ]);
    }
  }

      
  if (counter === 100) {
    logs_sheet.appendRow([scriptDate,"GET TICKER REQUEST SUCCESSFUL",data.symbol,data.bidPrice,data.askPrice,data.bidQty,data.askQty]);
    return [response_code, write];
  } else {
    logs_sheet.appendRow([scriptDate,"GET TICKER REQUEST FAILED","stopped trying",response_code, data]);
  }
    
  } catch (e) {
   logs_sheet.appendRow([new Date(),"GET TICKER EXECUTION ERROR","when dealing with response. Order may have executed still. Compare time stamps."]);
  }
}
  
