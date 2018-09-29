module.exports = (query, connection, next) => {
  connection.query(query, (err, results, fields) => {
    if(err) {
      // console.log('query error');
      // if error in sql query return the sql error message
      return next(formatSyntaxErrorMessage(err.sqlMessage));
    }

    // console.log('query `' + query + '` executed successfully');

    if(!fields) {
      // if single line output, return the output
      var output = `Query OK. ${results.affectedRows} rows affected`;
      return next(null, null, output);
    }
    
    // if here, the output is table. return table properties

    // extrcat the only field names
    fields = fields.map(field => field.name);
    return next(null, fields, results);
  });
};

const formatSyntaxErrorMessage = message => {
  if(!message.includes('You have an error in your SQL syntax')) {
    return message;
  } else {
    var firstQuoteIndex = message.indexOf("'");
    var lastQuoteIndex = message.lastIndexOf("'");
    var indexOfLineNumber = message.lastIndexOf(' line ');

    return 'You have an error in your SQL syntax near ' + message.slice(firstQuoteIndex, lastQuoteIndex + 1) + ' at ' + message.slice(indexOfLineNumber);
  }
};
