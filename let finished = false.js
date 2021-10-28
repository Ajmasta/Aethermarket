let finished = false
let timeStamp="max_timestamp="
let roll = 0
let mintData =[]
let length=0
while (!finished){
if (roll===0){
  mintData = await(await fetch("https://api.x.immutable.com/v1/mints?token_address=0xaa84c36e454e632c6880d2563986be75718fbc6f")).json()
}else{
  mintData = await(await fetch(`https://api.x.immutable.com/v1/mints?${timeStamp}token_address=0xaa84c36e454e632c6880d2563986be75718fbc6f`)).json()
}
0x1abb54698a3e7369b1943ed42f45207c1e3630dd'
console.log(mintData)
if(mintData.result){
if (mintData.result[mintData.result.length-1].timestamp) {
timeStamp = `max_timestamp=${mintData.result[mintData.result.length-1].timestamp}&`
} else{
  finished=true
}
}
length += mintData.result.length
roll++
console.log(timeStamp)
console.log(length)

}