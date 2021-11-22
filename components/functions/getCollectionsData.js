import collections from "./collectionRankings.json"
import { calculateDay, calculatePreviousDay, calculatePreviousWeek, calculateTime,calculateWeek } from "./functions"

let badGrandma=[]


export const addAOneOrNot = async () => 
{
    for(let object in collections){
        const data = await (await fetch(`https://api.x.immutable.com/v1/assets/${object}/0`)).json()
            console.log(collections[object].name,collections[object].ranksArray.map(element=>element-1))
    }



}
export const getSevenDaysOrder = async () => {
    const data = await (await fetch("https://api.x.immutable.com/v1/orders?status=filled&buy_token_type=ETH") ).json()
    let cursor= "&cursor=" + data.cursor
    for (let i=0;i<=2500;i++){
        const newData = await (await fetch("https://api.x.immutable.com/v1/orders?status=filled&buy_token_type=ETH"+cursor)).json()
        cursor= "&cursor=" + newData.cursor
        data.result.push(...newData.result)
        console.log(i)
    }
    console.log(data)
    console.log(calculateTime(data.result[data.result.length-1].timestamp))
    parseOrders(data.result)
    return data
}


export const getAllTimeOrder = async() =>{
    const data = await (await fetch("https://api.x.immutable.com/v1/orders?status=filled&buy_token_type=ETH") ).json()
    let cursor= "&cursor=" + data.cursor
    let newData = {}
    newData.cursor="start"
    let i =0
    
    while (newData.cursor!==""){
    try{
        newData = await (await fetch("https://api.x.immutable.com/v1/orders?status=filled&buy_token_type=ETH"+cursor)).json()
        cursor= "&cursor=" + newData.cursor
        data.result.push(...newData.result)
        console.log(i++)
        if (i===5000) console.log(data.result)
    }catch(err){
        console.log(err)
    }
    }
    console.log(data.result[data.result[0]])
    console.log(calculateTime(data.result[data.result.length-1].updated_timestamp))
    parseOrders(data.result)
    return data



}
const parseOrders = (orders)=> {
    const dayOrders = orders.filter(element=>calculateDay(element.timestamp))
    const pastDayOrders = orders.filter(element=>calculatePreviousDay(element.timestamp))
    const weekOrders=orders.filter(element=>calculateWeek(element.timestamp))
    const pastWeekOrders=orders.filter(element=>calculatePreviousWeek(element.timestamp))
    const allOrders = orders
   const orderedArrayDay = dayOrders.map(element=>{return ({"price":element.buy.data.quantity,"collection":element.sell.data.token_address,"timeStamp":element.updated_timestamp,"collectionName":element.sell.data.properties.collection.name})})
   const orderedArrayPreviousDay = pastDayOrders.map(element=>{return ({"price":element.buy.data.quantity,"collection":element.sell.data.token_address,"timeStamp":element.updated_timestamp,"collectionName":element.sell.data.properties.collection.name})})
   const orderedArrayWeek = weekOrders.map(element=>{return ({"price":element.buy.data.quantity,"collection":element.sell.data.token_address,"timeStamp":element.updated_timestamp,"collectionName":element.sell.data.properties.collection.name})})
   const orderedArrayPreviousWeek = pastWeekOrders.map(element=>{return ({"price":element.buy.data.quantity,"collection":element.sell.data.token_address,"timeStamp":element.updated_timestamp,"collectionName":element.sell.data.properties.collection.name})})
    
   const orderedAllOrders = allOrders.map(element=>{return ({"price":element.buy.data.quantity,"collection":element.sell.data.token_address,"timeStamp":element.updated_timestamp,"collectionName":element.sell.data.properties.collection.name})})

   let objectDay={}
   orderedArrayDay.map(element=>{
    if (objectDay[element.collectionName]){
        objectDay[element.collectionName] += Number(element.price)/10**18
    }else{
        objectDay[element.collectionName] = Number(element.price)/10**18

    }
})
let objectWeek={}
orderedArrayWeek.map(element=>{
    if (objectWeek[element.collectionName]){
        objectWeek[element.collectionName] += Number(element.price)/10**18
    }else{
        objectWeek[element.collectionName] = Number(element.price)/10**18

    }

})
let objectAll = {}
orderedAllOrders.map(element=>{
    if (objectAll[element.collectionName]){
        objectAll[element.collectionName] += Number(element.price)/10**18
    }else{
        objectAll[element.collectionName] = Number(element.price)/10**18

    }

})

let objectPreviousDay= {}
orderedArrayPreviousDay.map(element=>{
    if (objectPreviousDay[element.collectionName]){
        objectPreviousDay[element.collectionName] += Number(element.price)/10**18
    }else{
        objectPreviousDay[element.collectionName] = Number(element.price)/10**18

    }
})
let objectPreviousWeek={}
orderedArrayPreviousWeek.map(element=>{
    if (objectPreviousWeek[element.collectionName]){
        objectPreviousWeek[element.collectionName] += Number(element.price)/10**18
    }else{
        objectPreviousWeek[element.collectionName] = Number(element.price)/10**18

    }
})


console.log(objectPreviousDay,objectPreviousWeek)
let changeDay ={}
for(let element in objectPreviousDay){
    console.log()
let change = (objectDay[element]*100/objectPreviousDay[element]) -100

changeDay[element] = change

}
let changeWeek={}
for(let element in objectPreviousWeek){
    let change = (objectWeek[element]*100/objectPreviousWeek[element]) -100
    
    changeWeek[element] = change
    
    }


let result = {day:objectDay,week:objectWeek,all:objectAll,changeDay,changeWeek}

   console.log(result)
}

export const getCollectionsMeta =async  (collection,id) => {
    console.log(collections[0])
const allData = []

for(let i = 0;i<=10000; i++){ //always start i at 0 to not get decale
const data = await (await fetch(`https://api.x.immutable.com/v1/assets/0x1a7f16c514e6f57f7092e19ff6d1c5d75e5f093d/${i}`)).json()
data.metadata? allData.push(data):i===0?allData.push(data):""

console.log(i)
}

console.log(allData)


}
let usersArray
let collectionsArray=["0x82b1ce6e5d0f870c453cec0ce1b1f177e8fe50f8"]
let allResults={}
//at the end, after pushing in the object, move the array by one
export const getCollectionsMetaByList = async () =>{
    //collectionArray[0]
    let collection = collectionsArray[0]
    let data = await (await fetch(`https://api.x.immutable.com/v1/assets?collection=${collection}`)).json()
    let cursor = data.cursor
    let results = []
    let i= 0
    while(cursor !==""){ //always start i at 0 to not get decale
        results.push(...data.result)
        data = await (await fetch(`https://api.x.immutable.com/v1/assets?cursor=${cursor}&collection=${collection}`)).json()
    cursor=data.cursor

     if (i>10000) cursor=""
    i++
    console.log(i)
    }
    results = results.sort((a,b)=>a.token_id-b.token_id)
    console.log(results)
    badGrandma=results
    getTraitsRarity(badGrandma)
   
}
let  numberOfOccurencesArray
const getTraitsRarity= (array) => {
  
const allArray = []
 usersArray = array.map(item=>item.user)
usersArray= Array.from(new Set(usersArray))
const filteredArray = array.map(item=>{
    if(item.metadata){
    delete item.metadata.name
    delete item.metadata.description
    delete item.metadata.Description
    delete item.metadata.image
    delete item.metadata.external_url
    delete item.metadata.image_url
    delete item.metadata.attributes
    delete item.metadata.edition
   delete item.metadata.dna
   delete item.metadata.date
   delete item.metadata.avatar
   delete item.metadata.cutout
   delete item.metadata.full_image
    return item.metadata}
    else{}
     } )

let i = 0
    filteredArray.forEach(item=>{
        
        for (const object in item){
            allArray.push([object+"~"+item[object]])
            i++
        }
    } ) 
    getArrayOccurences(allArray)
}
const getArrayOccurences = (array) => {
const occDic = {}
array.forEach(item=>{
    if (occDic[item[0]] !==undefined) {
        occDic[item[0]] ++
    }else{
        occDic[item[0]] = 1
    }

})

const traitsArray = []
for (let  item in occDic){
    traitsArray.push([item, occDic[item]])
}

traitsArray.sort((a,b) => a[1] - b[1]);

 numberOfOccurencesArray = Array.from(new Set(traitsArray.map(element=>element[1])))



    
    createTraitsList(traitsArray)
}





// 3 arrays = > 1 array traits + number, 1 array number, 1 array of element. 
// first check element array, get number from traits+number, check position in number array
const checkRankings = (traitsList,numberArray,elementsArray,) =>{

   
    let metadataArray= elementsArray.map(item =>{

        let ranking = []
        let filteredArray = []
       for(const object in item.metadata){
             if (traitsList[object]) {
            filteredArray.push(...traitsList[object].filter(element =>element[0]===item.metadata[object]))
             
             }     
       }
      filteredArray =filteredArray.map(element=>element[1])
       return {metadata:filteredArray,token_id:item.token_id}
     })


 //metadataArray = 10000 arrays of 14 length, each index = id of token.

 //check each array for its value
 
let pointsArray = metadataArray.map((object,i) =>{
    let ranksArray = []
    object.metadata.map(
        (element,y) => {                
                //ranksArray.push(numberArray.length-1-numberArray.indexOf(element))
                ranksArray.push(1000/element/10000)
                
                 }
             )
     const points = ranksArray.length>0 ?ranksArray.reduce((a,b)=>a+b):[]
    
    return {metadata:points,token_id:object.token_id}
    }
)
let pointsArrayCopy = [...pointsArray]
const sortedPointsArray = pointsArrayCopy.sort((a,b)=>b.metadata-a.metadata)

// points array => array of all points, index = id of nft
//sortedpoints array => sorted array of all points  index = ranking of NFT

let idRankedArray = sortedPointsArray.map(element=>Number(element.token_id))
console.log(idRankedArray)
console.log(traitsList)
let result = {}
allResults[elementsArray[0].token_address] = {name:elementsArray[0].collection.name,ranksArray:idRankedArray,listOfTraits:traitsList,users:usersArray.length}
console.log(allResults)
collectionsArray.splice(0,1)
if (collectionsArray.length>0) getCollectionsMetaByList(collectionsArray[0])
return {idRankedArray,pointsArray}
}


const createTraitsList = (array)=>{
    let traitsArray = array.map(element=> [...element[0].split("~"),element[1]])
    let traitsSet = new Set (traitsArray.map(element=>element[0]))
    traitsSet = Array.from(traitsSet)
let traitsList = {}
    traitsArray.forEach(item=>{
        if (traitsList[item[0]])
        {
            traitsList[item[0]].push([item[1],item[2]])
        }else{
            
            traitsList[item[0]] = [[item[1], item[2]]]

        }

    })
const objectTest = {}

objectTest[traitsSet[3]] = traitsList[traitsSet[3]].map(element=> element[0])
  

    checkRankings(traitsList,numberOfOccurencesArray,badGrandma)

}



// {"Clothes":["Hoodie","Witch","Formal","Casual"],"Head":["Devil Horn"]}, split("~"), JSON.stringify(object)




export const turnArrayIntoStats =  (array)=> {

    let stepsArray = badGrandmaArray.map(item => item[1])
     let newStepsArray = [...new Set(stepsArray)]
    console.log(newStepsArray)
let traitsArray =  badGrandmaArray.map(item => item[2])
traitsArray = [...new Set(traitsArray)]
//give value to each trait -> index of newStepsArray
//check each grandma and give her points based on traits

const newArray = badGrandma.slice(0,2).map(item =>{
    const rarityArray = []
    traitsArray.forEach(trait=>{
        let rarity = ""
       const  characteristic = item.metadata[trait]
       badGrandmaArray.forEach(array =>{
           if (array[0]===characteristic)
           { rarityArray.push(stepsArray.indexOf(array[1]))
            console.log(characteristic, array)
           }

       })
       
    })
    console.log(traitsArray)
console.log(rarityArray)

})
}