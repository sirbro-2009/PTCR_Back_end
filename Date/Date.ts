const Checker = (sentedDate:string):boolean=>{
let  theDate = new Date(Date.now())
const SendedDate = new Date(sentedDate) 
const def:number = Math.round((theDate.getTime() - SendedDate.getTime())/1000/60/60/24/365) 
if(def >=5){
    return true
}
else{
    return false
}
}
export default Checker