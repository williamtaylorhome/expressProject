const events = require("events");    
const http = require('http');    

function UserBean(){    
  this.eventEmit = new events.EventEmitter(); 
  this.zhuce = function(req,res){ 
    console.log("register"); 
    req['uname'] = "aa"; 
    req['pwd'] = "bb"; 
    this.eventEmit.emit('zhuceSuc','aa','bb');  //Throw event message
  }, 
  this.login = function(req,res){ 
    console.log("Log in"); 
    res.write("username:" + req['uname']); 
    res.write("password:" + req['pwd']); 
    res.write("Log in"); 
  }    
}

module.exports = UserBean;