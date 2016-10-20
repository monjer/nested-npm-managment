
var fs = require('fs');
var spawnSync = require('child_process').spawnSync;
var path = require('path');
var dir = __dirname;

function runNpmInstall(path , cb){
  var args = ['install' , path];
  console.log('install package in : ' + path);
  spawnSync('npm' , args);
  console.log('install over');
  cb()
}


var tasks = [];

fs.readdir(dir , function(err , files){
  if(err){
    console.log(err);
    return ;
  }

  function filterFolder(file , cb){
    file = path.resolve(dir , file);
    fs.stat(file , function(err , stat){
      if(err){
        console.log(err);
        return;
      }
      if(stat.isDirectory()){
        var folder = file ;
        file = path.resolve(file , 'package.json');
        fs.stat(file , function(err , stat){
            if(err){
              cb(null);
            }else{
                cb(folder);
            }
        });
      }else{
        cb(null);
      }
    });
  }

  runQueue(files , filterFolder , function(folders){
    runQueue(folders ,  runNpmInstall , function(){
      console.log('All install over');
    })
  })

});

function runQueue(targets , task , cb ){
  var res = [];
  function run(){
    if(targets.length == 0){
      cb(res);
      return ;
    }
    var target = targets.shift();
    task(target , function(result){
      result && res.push(result);
      run();
    })
  }
  run();
}