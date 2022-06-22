const { now, sleep } = require('./utils')
class Gueue{
    constructor(time=1000,max=10,id=getUuid()){
        this.list=[]
        this.dtime=[]
        this.timer=null
        this.time=time
        this.max=max
        this.id=id
        this.isloop=true
    }
    start(){
     setImmediate(async ()=>{
       while(this.isloop){
        this.loop()
        await sleep(this.time)
       }
     })
    }
   async  loop(){
      const action=this.list.shift()
      if(action){
       action().catch(e=>{})
      }
    }
    push(action){
       if(this.max==-1){
        this.list.push(action)
       }
       else{
        if(this.list.length<this.max){
          this.list.push(action)
        }
       }
    }
    stop(){
     this.isloop=false
    }
}
function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
module.exports=Gueue
