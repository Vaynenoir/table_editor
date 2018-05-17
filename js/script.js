$(document).on("ready", function(){

var json_data = JSON.parse(localStorage.getItem('json_data')) || [{name:"name1", value:"value1"},{name:"name2", value:"value2"}];

function create_table_from_json(json){

		var row_counter = 0;
		for(var key in json){
			$("#table__body").append("<tr id='row_"+key+"'>");
			var char = 0;
			var row_id = "#row_" + key;

			for(var key2 in json[key]){
				var id = key + '_' + char;
				var cell_class = key + 'class' + char;
				$(row_id).append("<td class='name_cell'><input type='text' id='"+id+"'/><span>"+json[key][key2]+"</span></td>");
				$('input[type = text]').addClass("hidden_input");
				char++;			
			}
			
			$(row_id).append("<td><a class='delete_class' id='delete_row_"+row_counter+"'><i class='material-icons'>cancel</i></a></td>");
			$("#table__body").append("</tr>");
			row_counter+=1;
			console.log(row_counter);
			
			remove_ability();

		}
		localStorage.setItem('json_data', JSON.stringify(json));
}

function change_table_cell(json, obj_index1, obj_index2, edited_cell){
	for(var key in json){
		var char = 0;
		for(var key2 in json[key]){
			if (char == parseInt(obj_index2) && parseInt(obj_index1) == parseInt(key)) {
				json[key][key2] = edited_cell;
				localStorage.setItem('json_data', JSON.stringify(json));
				return;
			}
			char++;
		}
	}
}

		function remove_ability(){
			$(".delete_class").on('click', function() {
				var tr_children = $(this).closest("tr").children();
				var name_cell = tr_children[0];
				var name_to_delete = $(name_cell).find('span').text();
				    for(var i = 0; i < json_data.length; i++){
				      if(name_to_delete == json_data[i].name){
				        json_data.splice(i, 1);
				      }
				    }
				    localStorage.setItem('json_data', JSON.stringify(json_data));
				    if(json_data.length == 0){
				    	localStorage.clear();
				    }

				    $(this).closest('tr').fadeOut(200);
				    if(json_data.length == 0){
				      $('#data_table').fadeOut(200);
				    }
			});
		}

function sort(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

$("#sort_by_name").on("click", function(){
	sort(json_data, "name");
	localStorage.setItem('json_data', JSON.stringify(json_data));

	$("#data_table").fadeOut(100);
	$('#table__body').children().remove();
	create_table_from_json(json_data);
	$("#data_table").fadeIn(100);
});
$("#sort_by_value").on("click", function(){
	sort(json_data, "value");
	localStorage.setItem('json_data', JSON.stringify(json_data));
	$("#data_table").fadeOut(100);
	$('#table__body').children().remove();
	create_table_from_json(json_data);
	$("#data_table").fadeIn(100);	
});

  function refresh(){
    $('#add_name').val("");
    $('#add_value').val("");
    $("#textarea1").val("");
    $("#textarea2").val("");
  }

 $("table .name_cell").on('click',function(e){
    e.preventDefault();
    console.log(e);
}); 
 $("#data_table").on('click','.name_cell',function(e){
    e.preventDefault();
    var cell_children = $(this).children();
    var cell_input = cell_children[0];
    var cell_span = cell_children[1];
    $(cell_input).val($(cell_span).text());
    $(cell_span).fadeOut();
    $(cell_input).fadeIn(200);

    $(cell_input).keydown(function(event){
      if(event.keyCode == 13){
      	var edited_text = $(cell_input).val();
  		id_key = ($(cell_input).attr("id"));
  		id_key = id_key.substring(0, id_key.indexOf('_'));
  		id_key_2 = ($(cell_input).attr("id"));
  		id_key_2 = id_key_2.substring(id_key_2.indexOf('_') + 1, id_key_2.length);
  		if($.trim(edited_text) != ""){
  		console.log("priFFki!");
		change_table_cell(json_data, id_key, id_key_2, edited_text);
	    $(cell_span).text(edited_text);
        $(cell_input).fadeOut();
        $(cell_span).fadeIn();
        }else{
        	alert("error message!");
        }
        return false;
    }      
});
    $(cell_input).on("focusout", function(){
    	$(this).fadeOut();
    	$(cell_span).fadeIn();
    });
}); 

$("#add_to_table").on("click", function(){
	var valid = 1;
	var name_text = $("#add_name").val();
	var value_text = $("#add_value").val();
    if($.trim(name_text) == "" || $.trim(value_text) == "" ){
    	alert("please enter text");
    	valid = 0;
    } 
    if(valid){
	var obj_to_add = {name: name_text, value: value_text};
	json_data.push(obj_to_add);
	localStorage.setItem('json_data', JSON.stringify(json_data));
	refresh();
	}else{

	}
	$("#data_table").fadeOut(100);
	$('#table__body').children().remove();
	create_table_from_json(json_data);
	$("#data_table").fadeIn(100);
});

$("#add_json_data").on("click", function(){
	var json_to_table = $("#textarea1").val();
	try{
		var parsed_json = JSON.parse(json_to_table);
	}catch(e){
		alert("invalid json file");
		return;
	}
	for(var i=0; i < parsed_json.length; i++){
		json_data.push(parsed_json[i]);
	}
	localStorage.setItem('json_data', JSON.stringify(json_data));
	$("#data_table").fadeOut(100);
	$('#table__body').children().remove();
	create_table_from_json(json_data);
	$("#data_table").fadeIn(100);
	refresh();
});

$("#load_json_data").on("click", function(){
	var json_string = JSON.stringify(json_data);
	$("#textarea1").val(json_string);
	M.textareaAutoResize($('#textarea1'));
});


$("#add_csv_data").on("click", function(){
	var csv = $("#textarea2").val();
	var csv_splitted_arr = csv.split('\n');
	for(var i = 0; i < csv_splitted_arr.length; i++){
		var csv_splitted = csv_splitted_arr[i].split(',');
		if(csv_splitted.length == 2 && $.trim(csv_splitted[0]).length > 0 && $.trim(csv_splitted[1]).length > 0 ){
			var obj = {name: csv_splitted[0], value: csv_splitted[1]};
			json_data.push(obj);
		}else{
			alert("invalid csv data");
			return;
		}		
	}
	localStorage.setItem('json_data', JSON.stringify(json_data));
	$("#data_table").fadeOut(100);
	$('#table__body').children().remove();
	create_table_from_json(json_data);
	$("#data_table").fadeIn(100);

});
$("#load_csv_data").on("click", function(){
	var str = "";
	for(var key in json_data){
		for(var key2 in json_data[key]){
			str += json_data[key][key2] + ",";
		}
		str = str.slice(0,-1); 
		str += "\n";
	}
	$("#textarea2").val(str);
	M.textareaAutoResize($('#textarea2'));
});
$("#clear_json").on("click", function(){
	$("#textarea1").val("");
	M.textareaAutoResize($('#textarea1'));
});
$("#clear_csv").on("click", function(){
	$("#textarea2").val("");
	M.textareaAutoResize($('#textarea2'));
});
$("#file").on("change", function(){
	var file = $("#file").val();
	console.log(file);
});

function getExtension(path){
	var dotIndex = path.lastIndexOf('.');
	return path.substring(dotIndex+1, path.length);
}

( function ( $ ) {

	$( '#get_local_file' ).click( function () {
		if ( ! window.FileReader ) {
			return alert( 'FileReader is not supported by your browser.' );
		}
		var $i = $( '#file' ),
			input = $i[0];
		if ( input.files && input.files[0] ) {
			file = input.files[0]; 
			console.log(file.name);
			fr = new FileReader(); 
			fr.onload = function () {
				if(getExtension(file.name) == "json"){
					var json = $.trim((fr.result).replace(/(\r\n|\n|\r)/gm,""));
					var json_string = json.replace(/\s+/g," ");
					console.log(json_string);
					$("#textarea1").val(json_string);
					M.textareaAutoResize($('#textarea1'));
				}
				else if(getExtension(file.name) == "csv"){
					var csv = fr.result;
					$("#textarea2").val(csv);
					M.textareaAutoResize($('#textarea2'));
				}
				else{
					alert("non csv or json file");
				}
				console.log(getExtension(file.name))

			};
			fr.readAsText( file );
		} else {
			alert( "File not selected or browser incompatible." )
		}
	} );
} )( jQuery );



create_table_from_json(json_data);


});
