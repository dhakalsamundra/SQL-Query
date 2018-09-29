function executeQuery() {
  // trim the input
  var queryString = $("#query-string").val().trim();
  var output = $("#output");
  output.html('<p>Executing...</p>')

  // send ajax request to the server along with the input query string
  $.ajax({
    method: 'POST',
    url: '/query',
    data: { query: queryString },
    success: function(response) {
      // reset the output field
      if(response.type == 'error') {
        // if the query output is error print that
        output.html('<p>' + response.responseText + '</p>');
      } else if (response.type == 'single-output') {
        // if the query output is single-line output print that too
        output.html('<p>' + response.responseText + '</p>');              
      } else {
        // if the output is a table, design the table
        // extract fields and rows(data) first
        var fields = response.data.fields;
        var data = response.data.data;
        
        // calculate number of rows and columns
        var cols = fields.length;
        var rows = data.length;

        // start the html definition of the dynamic table
        var tableBody = '<table class="table table-hover table-bordered"><thead class="thead-dark"><tr>';

        // for every column create the table header
        for(var i = 0; i < cols; i++) {
          tableBody += '<th scope="col">' + fields[i] + '</th>';
        }

        // end the table header
        tableBody += '</tr></thead>'

        // start inserting rows into the table
        for(i = 0; i < rows; i++) {
          // start a table row
          tableBody += '<tr>';
          
          // for each row, insert every column data
          for(var j = 0; j < cols; j++) {
            tableBody += '<td>'+ data[i][fields[j]] +'</td>';
          }

          // end the table row
          tableBody += '</tr>';
        }

        // end table definition
        tableBody += '</table>'

        // print the table
        output.html(tableBody);
      }
    }
  });
}
