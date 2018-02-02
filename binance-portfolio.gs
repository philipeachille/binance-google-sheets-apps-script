// This file deals with pulling the data from Binance and Coinmarketcap for analysis

function executePortfolio() {
  
      var binance = getBinanceData(),
          cmc = addCMCData(binance);


  var active = SpreadsheetApp.getActiveSpreadsheet();

  active.getSheetByName("Portfolio").getRange(10,35,cmc.length,cmc[0].length).setValues(cmc);
   
}

function addCMCData(binance) {
  
  var cmc_ticker = JSON.parse(UrlFetchApp.fetch('https://api.coinmarketcap.com/v1/ticker?limit=0'));

  var binance_data = binance.slice(),
      added_cmc_data = [];
  
     for (i = 0; i < binance_data.length; i++) {
       
       var found = false;

       for (j = 0; j < cmc_ticker.length; j++) {

         if (binance_data[i][0] === cmc_ticker[j].symbol) {
          added_cmc_data.push([
            cmc_ticker[j].name, 
            binance_data[i][0], 
            binance_data[i][1], 
            binance_data[i][2], 
            binance_data[i][3], 
            cmc_ticker[j].price_usd, 
            cmc_ticker[j].market_cap_usd, 
            cmc_ticker[j].rank
          ]);
          found = true;
          break;
         };
      }
       
      if (!found) {
        added_cmc_data.push([
            'no cmc data', 
            binance_data[i][0], 
            binance_data[i][1], 
            binance_data[i][2],
            binance_data[i][3], 
            '', 
            '', 
            ''
          ]);
	  }
       

     }

  return added_cmc_data;

}




function getBinanceData() {
// get new ticker data

      var binance_ticker = JSON.parse(UrlFetchApp.fetch('https://api.binance.com/api/v1/ticker/24hr')),
          new_ticker = [],
          new_ticker_eth = [];
                    
        for (i = 0; i < binance_ticker.length; i++) {
             
          var symbol = binance_ticker[i]['symbol'], //.replace(/ETH/gi,'').replace(/BTC/gi,'').replace(/BNB/gi,'').replace(/USDT/gi,'').replace(/\s/gi,'')
              price = binance_ticker[i]['lastPrice'];
          
          if (symbol.indexOf('BTC') != -1 && symbol.indexOf('BTCUSDT') == -1) {

            new_ticker.push([symbol.replace(/BTC/gi,'').replace(/IOTA/gi,'MIOTA').replace(/YOYO/gi,'YOYOW'),symbol, price]); 
        
          }
                    
          if (symbol.indexOf('ETH') != -1 && symbol.indexOf('ETHUSDT') == -1) {

            new_ticker_eth.push([symbol.replace(/ETH/gi,'').replace(/IOTA/gi,'MIOTA').replace(/YOYO/gi,'YOYOW'),symbol, price]); 
        
          }
        }
  
  // match and prepare a new set of data  
  var splice_eth = [];
  
  // Loop active_pairs
  for (var i = 0; i < new_ticker.length; i++) {
    
    var found = false;
    // For every loop of active_symbols, also loop new_ticker
    for (var j = 0; j < new_ticker_eth.length; j++) {
      
      // If we have a match operate on this pair
      if (new_ticker[i][0] === new_ticker_eth[j][0]) {

        new_ticker[i].push(new_ticker_eth[j][2]);
		// remove the element from new_ticker
		new_ticker_eth.splice(j,1);
 
        // We found our matching pair, so break out of the inner loop
        found = true;
        break;
        
      } 
    }

	if (!found) {

      new_ticker[i].push('no update');
	}
  }
      
  Logger.log(new_ticker);
  
// get active pairs from sheet
      var sheet = SpreadsheetApp.getActiveSpreadsheet(),
          active = sheet.getSheetByName("Portfolio").getRange(10,37,sheet.getLastRow()-9,1).getValues(),
          active_pairs = [];
  
      for (i = 0; i < active.length; i++) {
         active_pairs.push(active[i][0]);
      }
  
  
  
  /** testing material   var new_ticker = [['ETH', 'ETHBTC', 0.10710700], ['LTC', 'LTCBTC', 0.01646400], ['BNB', 'BNBBTC', 0.00112990], ['NEO', 'NEOBTC', 0.01400600], ['BCC', 'BCCBTC', 0.14890000]],
                    active_pairs = ['ADABTC', 'ETHBTC', 'LTCBTC', 'NEOBTC']; **/
  

  
// match and prepare a new set of data  
  var write_new = [];
  
  // Loop active_pairs
  for (var i = 0; i < active_pairs.length; i++) {
    
    var found = false;
    // For every loop of active_symbols, also loop new_ticker
    for (var j = 0; j < new_ticker.length; j++) {
      
      // If we have a match operate on this pair
      if (active_pairs[i] == new_ticker[j][1]) {

        write_new.push(new_ticker[j]);
		// remove the element from new_ticker
		new_ticker.splice(j,1);
 
        // We found our matching pair, so break out of the inner loop
        found = true;
        break;
        
      } 
    }

	if (!found) {

      write_new.push([active_pairs[i].replace(/BTC/gi,''),active_pairs[i],'no update','no update']);
	}
  }


  // At this point the remaining elements in new_ticker are those that haven't been matched with active_pairs
  for (var k = 0; k<new_ticker.length; k++) {
    write_new.push(new_ticker[k]);
  } 
  
 return write_new;  

} 




/************** HELPER FUNCTIONS *****************/

function getBinanceDataFirstTime () {
  
      var binance_ticker = JSON.parse(UrlFetchApp.fetch('https://api.binance.com/api/v1/ticker/24hr')),
          ticker_array = [];

      for (i = 0; i < binance_ticker.length; i++) {
      
        var symbol = binance_ticker[i]['symbol'], //.replace(/ETH/gi,'').replace(/BTC/gi,'').replace(/BNB/gi,'').replace(/USDT/gi,'').replace(/\s/gi,'')
            price = binance_ticker[i]['lastPrice'];
  
        if (symbol.indexOf('BTC') != -1 && symbol.indexOf('BTCUSDT') == -1) {
          
           ticker_array.push([symbol.replace(/BTC/gi,''),symbol, price]);
        } 
      }
  
  var active = SpreadsheetApp.getActiveSpreadsheet();

  active.getSheetByName("Portfolio").getRange(10,36,ticker_array.length,ticker_array[0].length).setValues(ticker_array.sort()); // a.sort(function(a,b) {return a[1] - b[1];})  
  
}

function isInArray(array, symbol) { 
    return array.symbol === symbol;
}


function contains(arr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === value) return true;
    }
    return false;
}

function sortArray(a, b) {
    var x = a[1].toLowerCase();
    var y = b[1].toLowerCase();
    return x - y;
}
   

function removeDuplicates(arr){
    var unique_array = []
    for(i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}



function writeDataToSheets(a) {
  
    var active = SpreadsheetApp.getActiveSpreadsheet();

  active.getSheetByName("Portfolio").getRange(10,36,a.length,a[0].length).setValues(a.sort()); // a.sort(function(a,b) {return a[1] - b[1];})  
  
}

function constructCompare(src) {
  
    var active = SpreadsheetApp.getActiveSpreadsheet(),
        compare_sheet = active.getSheetByName("Snapshot 3rd Dec"),
        obj = compare_sheet.getRange(2,1,1273,5).getValues();
  

  
    	var combine = src.slice();

  
  // Loop the src
  for (var i = 0; i < src.length; i++) {
    
    var found = false;
    // For every loop of src, also loop obj
    for (var j = 0; j < obj.length; j++) {
      
      // If we have matching names AND symbols operate on this pair
      if (combine[i][1] == obj[j][2]) {

   	combine[i].push(obj[j][0]);
   	combine[i].push(obj[j][3]);
           	combine[i].push(obj[j][4]);

		// remove the element from obj
		obj.splice(j,1);
 
        // We found our matching pair, so break out of the inner loop
        found = true;
        break;
        
      } 
    }

	if (!found) {
	   	combine[i].push('N/A');
   	combine[i].push(0);
           	combine[i].push(0);

	}
  }
/**
  // At this point the remaining elements in obj are those that haven't been matched with src
  for (var k = 0; k<obj.length; k++) {
    new_arr.push(updateObj(src[0],obj[k]));

 //   logs_sheet.appendRow(["","OBJ ADDED",date,obj[k][0],obj[k][1],obj[k][2]]);
  } **/

  
  return combine;

}
