const mysql  = require('mysql');  //Call my sql module

function OptPool(){ 
  this.flag = true; //Have you connected
  this.pool = mysql.createPool({     
    host: 'localhost',       //Host
    user: 'root',            //Mysql authentication username
    password: 'root',        //Mysql authentication user password
    database: 'test', 
    port: '3306'             //The port number
  }); 
  
  this.getPool = function(){ 
    if(this.flag){ 
      //Listen for connection events
      this.pool.on('connection', function(connection) {  
        // console.log('Connection established')
// connection.query('SET SESSION auto_increment_increment=1');
        this.flag = false; 
      }); 
    } 
    return this.pool; 
  } 
}; 
module.exports = OptPool;