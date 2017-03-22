function getRelatedRecs(uid) {
	$.ajax({
		url: 'getRelatedRecords.php?uid='+uid,
		type: 'GET',
		dataType: "json",
		success:function(data) {
			console.log(data);
		}
	});
}

function resizeCenterDiv() {
	var centerWidth;
	var pageWidth = $( document ).width();
	if (pageWidth < 851) {
		centerWidth = pageWidth;
	} else {
		centerWidth = pageWidth - 280;
	}
	$('#cp_outer_center').width(centerWidth);
	
	if (map) {
		map.updateSize();
	}
}


function menuChange(item) {
	switch(item) {
		case 'legend':
			$('#visitsItem').addClass( "item-selected" );
			$('#searchItem').removeClass( "item-selected" );
			$('#layerItem').removeClass( "item-selected" );
			
			$('#visitsPanel').addClass( "panel-selected" );
			$('#searchPanel').removeClass( "panel-selected" );
			$('#layerPanel').removeClass( "panel-selected" );
			break;
		case 'about':
			$('#searchItem').addClass( "item-selected" );
			$('#layerItem').removeClass( "item-selected" );
			$('#visitsItem').removeClass( "item-selected" );
			
			$('#searchPanel').addClass( "panel-selected" );
			$('#layerPanel').removeClass( "panel-selected" );
			$('#visitsPanel').removeClass( "panel-selected" );
			break;
		case 'layers':
			$('#layerItem').addClass( "item-selected" );
			$('#visitsItem').removeClass( "item-selected" );
			$('#searchItem').removeClass( "item-selected" );
			
			$('#layerPanel').addClass( "panel-selected" );
			$('#visitsPanel').removeClass( "panel-selected" );
			$('#searchPanel').removeClass( "panel-selected" );
			break;
	}
	
}

function collapseDrawer() {
	if ($('#cp_outer_left').width() > 0) {
		$('#cp_outer_left').width(0);
		
		var divWidth = $( document ).width()				
		$( "#cp_outer_center" ).animate({
			left: "0px",
			width: divWidth
		}, 200);

		$('#hamburger_button').removeClass('toggle-grey-on');
		$('#hamburger_button').addClass('toggle-grey');
		
		setTimeout( function() { map.updateSize();}, 150);
	} else {
		$('#cp_outer_left').width(280);

		var divWidth = ($( document ).width() - 280);				
		$( "#cp_outer_center" ).animate({
			left: "280px",
			width: divWidth
		}, 200);
		
		$('#hamburger_button').removeClass('toggle-grey');
		$('#hamburger_button').addClass('toggle-grey-on');	
		
		setTimeout( function() { map.updateSize();}, 150);
	}
}

function createUpcomingVisits() {

	/*WORKFLOW:
		1. GET CURRENT DATE
		2. GET DATE 30 DAYS FROM CURRENT
		3. FILTER PERMIT LOCATION FEATURES THAT HAVE A 'NEXT_VISIT' IN DATE RANGE
		4. OUTPUT TO TABLE IN LEFT HAND NAV
			- HIGHLIGHT POINT WHEN USER HOVERS OVER TABLE ROW
			- ZOOM TO FEATURE AND OPEN WINDOW WHEN USER CLICKS ON TABLE ROW
	*/
	
}
function searchRecords() {
	clearSearchResults();	
		
	var fromDateObject = $('#fromDate').datepicker("getDate");
	var fromDateString = $.datepicker.formatDate("yy-mm-dd", fromDateObject);
	
	var toDateObject = $('#toDate').datepicker("getDate");
	var toDateString = $.datepicker.formatDate("yy-mm-dd", toDateObject);
	
	$.ajax({
		url: 'getRecordsByDate.php?fromDate=' + fromDateString + '&toDate=' + toDateString,
		type: 'GET',
		dataType: "json",
		success:function(data) {
			joinSearchResults(data);
		}
	});	
}

function joinSearchResults(result) {
	var features = result;
	
	finalSearchArray = [];
	var joinArray = [];
	var relatedRecords = [];
	
	if (features.length > 0) {
		for (var i = 0; i < features.length; i++) {
			relatedRecords.push(features[i]);
		}
		
		var permitSource = permitLayer.getSource();	
		var permitFeatures = permitSource.getFeatures();
		
		for (var r = 0; r < relatedRecords.length; r++) {
			for (var i = 0; i < permitFeatures.length; i++) {
				var attributes = permitFeatures[i].getProperties();
				
				if (attributes.UID === relatedRecords[r].pz_uid) {
					var tempFeature = {
						UID: relatedRecords[r].pz_uid,
						UID2: attributes.UID,
						TYPE: attributes.TYPE,
						STAFF: relatedRecords[r].pz_name,
						VISIT_DATE: relatedRecords[r].pz_date,
						FIELD_NOTES: relatedRecords[r].pz_notes,
						PARCEL_ID: attributes.PARCELID,
						CONDITIONS: attributes.CONDITIONS
					};						
					joinArray.push(tempFeature);
				}
			}
		}
	
		var recType = $('#recType').val();
			
		var filterType;
		switch (recType) {
			case 'CUP':
				filterType = 'CUP';
				break;
			case 'IUP':
				filterType = 'IUP';
				break;
			case 'VAR':
				filterType = 'VAR';
				break;
		}
		
		if (recType === 'ALL') {
			finalSearchArray = joinArray;
		} else {
			for (var f = 0; f < joinArray.length; f++) {
				if (joinArray[f].TYPE === filterType) {
					finalSearchArray.push(joinArray[f]);
				}
			}
		}

		createSearchResultsTable(finalSearchArray);	
		btnExport.disabled = false;
	} else {
		btnExport.disabled = true;
	}
}

function clearSearchResults() {
	while (resultsDiv.firstChild) {
		resultsDiv.removeChild(resultsDiv.firstChild);
	}
	finalSearchArray = null;
	btnExport.disabled = true;
}

function createSearchResultsTable(dataArray) {
	var container = document.getElementById('resultsDiv');
	
	var table = document.createElement("table");
	table.style.width = '100%'; 
	table.style.borderCollapse = 'collapse';
	table.style.padding = '3px';
	
	var tbody = document.createElement('tbody');
	
	for (var i = 0; i < dataArray.length; i++) {
		var tr = document.createElement('tr');
		tr.className = 'visitsTableRow';
		tr.id = 'row_' + dataArray[i].UID;
		
		var td1 = document.createElement('td');
		td1.innerHTML = dataArray[i].UID;
		td1.className = 'visitsTableCell';
		tr.appendChild(td1);
		
		var td2 = document.createElement('td');
		td2.innerHTML = dataArray[i].STAFF;
		td2.className = 'visitsTableCell';
		tr.appendChild(td2);
		
		var td3 = document.createElement('td');
		td3.innerHTML = dataArray[i].VISIT_DATE;
		td3.className = 'visitsTableCell';
		tr.appendChild(td3);
		
		tr.onmouseover = function() {
			var tempVals = this.id.split("_");
			var tempUID = tempVals[1];
			var permitSource = permitLayer.getSource();	
			var permitFeatures = permitSource.getFeatures();
		
			for (var f = 0; f < permitFeatures.length; f++) {
				var attributes = permitFeatures[f].getProperties();	
				if (attributes.UID === tempUID) {
					var highlightPointSource = pointLayer.getSource();	
					highlightPointSource.addFeature( permitFeatures[f] );
					
				}
			}
			
		}
		tr.onmouseout = function() {
			var highlightPointSource = pointLayer.getSource();
			highlightPointSource.clear()
		}
		tr.click = function() {
		/*	var permitSource = permitLayer.getSource();	
			var permitFeatures = permitSource.getFeatures();
		
			for (var t = 0; t < permitFeatures.length; t++) {
				var attributes = permitFeatures[t].getProperties();	
				if (attributes.UID === dataArray[i].UID) {				
					// Hide existing popup and reset it's offset
					popup.hide();
					popup.setOffset([0, 0]);
				
					var coord = permitFeatures[t].getGeometry().getCoordinates();
					var info = "<h2>" + attributes.UID + "</h2>";
						info += "<p>" + attributes.PARCELID + "</p>";
						info += "<p>Conditions: " + attributes.CONDITIONS +"</p>";
					// Offset the popup so it points at the middle of the marker not the tip
					popup.setOffset([0, -5]);
					popup.show(coord, info);
					
					getRelatedRecs(attributes.UID);	
				}
			}
		*/
		}
		tbody.appendChild(tr);
	}

	table.appendChild(tbody);
	container.appendChild(table);
}

function exportCSV() {
	var csvData = new Array();					
	csvData.push('"UID","TYPE","STAFFNAME","NOTES","VISIT_DATE","PARCEL_ID","CONDITIONS"');
	
	for (var i = 0; i < finalSearchArray.length; i++) {
		csvData.push('"' + finalSearchArray[i].UID + '","' + finalSearchArray[i].TYPE + '","' + 
				finalSearchArray[i].STAFF + '","' + finalSearchArray[i].FIELD_NOTES + '","' +
				finalSearchArray[i].VISIT_DATE + '","' + finalSearchArray[i].PARCEL_ID + '","' +
				finalSearchArray[i].CONDITIONS + '"');
	}
	
	var buffer = csvData.join("\n");
	var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
	var fileName = "PermitSearchResults.csv"
	
	var link = document.createElement('a');
	if (link.download !== undefined) {
		link.setAttribute("href", uri);
		link.setAttribute("download", fileName);
	} else if (navigator.msSaveBlob) {
		link.addEventListener("click", function(event) {
			var blob = new blob([buffer], {
				"type": "text/csv;charset=utf-8;"
			});
			navigator.msSaveBlob(blob, fileName);
		}, false);
	} else {
		var oWin = window.open();
		oWin.document.write(csvData);
		oWin.document.execCommand('SaveAs', true, fileName);
		oWin.close();
	}
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}