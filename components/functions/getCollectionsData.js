import badGrandma from "./badGrandma.json"
import collections from "./collectionRankings.json"
export const addAOneOrNot = async () => 
{
    for(let object in collections){
        const data = await (await fetch(`https://api.x.immutable.com/v1/assets/${object}/0`)).json()
            console.log(collections[object].name,collections[object].ranksArray.map(element=>element-1))
    }



}



export const getCollectionsMeta =async  (collection,id) => {
    console.log(collections[0])
const allData = []

for(let i = 0;i<=0; i++){ //always start i at 0 to not get decale
const data = await (await fetch(`https://api.x.immutable.com/v1/assets/0xdc0fb8b27daadcd897cc2a2facf6416f430b08a7/${i}`)).json()
allData.push(data)

console.log(i)
}

console.log(allData)
getTraitsRarity(badGrandma)

}
let  numberOfOccurencesArray
const getTraitsRarity= (array) => {
  
const allArray = []
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

console.log(filteredArray.length)
let i = 0
    filteredArray.forEach(item=>{
        
        for (const object in item){
            allArray.push([object+"~"+item[object]])
            i++
        }
    } ) 
    console.log(i,"I")
    getArrayOccurences(allArray)
}
const getArrayOccurences = (array) => {
console.log(array)
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
console.log(traitsArray)

console.log(traitsArray.reduce((a,b)=>{
    
    
    return a+b[1]},49))

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
       return filteredArray
     })
metadataArray = metadataArray.map(element => element.map(array=>array[1]))
 //metadataArray = 10000 arrays of 14 length, each index = id of token.

 //check each array for its value
console.log(metadataArray)
 
let pointsArray = metadataArray.map(array =>{
    const ranksArray = []
    array.map(
        element => {                
                //ranksArray.push(numberArray.length-1-numberArray.indexOf(element))
                ranksArray.push(1000/element/10000)
                 }
             )
     const points = ranksArray.length>0 ?ranksArray.reduce((a,b)=>a+b):[]
    return points
    }
)
let pointsArrayCopy = [...pointsArray]
const sortedPointsArray = pointsArrayCopy.sort((a,b)=>b-a)
// points array => array of all points, index = id of nft
//sortedpoints array => sorted array of all points  index = ranking of NFT
const sortedPointsSet=Array.from(new Set(sortedPointsArray))

console.log(sortedPointsSet)
let idRankedArray = pointsArray.map((element,i)=>{
return  [sortedPointsArray.indexOf(element)+1,i]
}) 
idRankedArray.sort((a,b)=>a[0]-b[0])
idRankedArray = idRankedArray.map(element=>element[1])
console.log(idRankedArray)
console.log(pointsArray)
console.log(traitsList)
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