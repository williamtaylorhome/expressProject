var  fs=  require('fs');
module.exports={
    readfile:function(path){          //Asynchronous execution
        fs.readFile(path,  function  (err,  data)  {
            if  (err)  {
              console.log(err);
            }else{
              console.log(data.toString());
            }
        });
        console.log("Asynchronous method execution completed");
    },
    readfileSync:function(path){      //Synchronous reading
        var  data  =  fs.readFileSync(path,'utf-8');
        //Console.log(data);
        console.log("Synchronous method execution completed");
        return  data;                
    },
    writefile:function(path,data){    //asynchronous mode
        fs.writeFile(path,  data,  function  (err)  {
            if  (err)  {
                throw  err;
            }
            console.log('It\'s  saved!');  //File is saved
          });
    },
    writeFileSync:function(path,data){  //Synchronously
        fs.writeFileSync(path,  data);
        console.log("Synchronous file writing completed");
    }
}