class Gueue{
    constructor(time=1000,max=10,id=getUuid()){
        this.list=[]
        this.dtime=[]
        this.timer=null
        this.time=time
        this.max=max
        this.id=id
    }
    start(){
      this.timer=setInterval(this.loop.bind(this),this.time)
    }
    loop(){
      const action=this.list.shift()
      if(action)action()
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
        clearInterval(this.time)
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
