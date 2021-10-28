import badGrandma from "./badGrandma.json"

export const getCollectionsMeta =async  (collection,id) => {
const allData = []
for(let i = 0;i<=0 ;i++){
const data = await (await fetch(`https://api.x.immutable.com/v1/assets/0x4ebfb80f9144713a690ec5a6485d0d4ed65194cd/${i}`)).json()
allData.push(data)
console.log(i)

}
console.log(badGrandma)
getTraitsRarity(badGrandma)
}

const getTraitsRarity= (array) => {
  
const allArray = []
const filteredArray = array.map(item=>{
    if(item.metadata){
    delete item.metadata.name
    delete item.metadata.description
    delete item.metadata.image}
    return item.metadata})

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
    
    
    return a+b[1]},32)/7882)



}


const badGrandmaArray = [
    [
        "Hoodie",
        42,
        "Clothes"
    ],
    [
        "Devil Horn",
        43,
        "Head"
    ],
    [
        "Witch",
        68,
        "Clothes"
    ],
    [
        "Leather Jacket",
        73,
        "Clothes"
    ],
    [
        "Crown",
        74,
        "Head"
    ],
    [
        "Demon",
        76,
        "Eyes"
    ],
    [
        "Holy",
        77,
        "Head"
    ],
    [
        "Leopard",
        77,
        "Clothes"
    ],
    [
        "Golden Teeth",
        77,
        "Mouth"
    ],
    [
        "Chameleon",
        82,
        "Pet"
    ],
    [
        "Pink Body Tattoo",
        83,
        "Body"
    ],
    [
        "Tough Life",
        87,
        "Glasses"
    ],
    [
        "Dark Brown Body Tattoo",
        135,
        "Body"
    ],
    [
        "Bunny",
        147,
        "Head"
    ],
    [
        "Animal Skin",
        152,
        "Clothes"
    ],
    [
        "Monkey",
        157,
        "Pet"
    ],
    [
        "Tongue",
        158,
        "Mouth"
    ],
    [
        "Bikini",
        161,
        "Clothes"
    ],
    [
        "Insomnia",
        162,
        "Eyes"
    ],
    [
        "Eyepatch",
        173,
        "Glasses"
    ],
    [
        "Fur Coat",
        200,
        "Clothes"
    ],
    [
        "Army Shirt",
        237,
        "Clothes"
    ],
    [
        "Mini Dress",
        251,
        "Clothes"
    ],
    [
        "Sport",
        267,
        "Clothes"
    ],
    [
        "Mini Shirt",
        267,
        "Clothes"
    ],
    [
        "Bandana",
        296,
        "Head"
    ],
    [
        "Glaring",
        303,
        "Eyes"
    ],
    [
        "Smile Teeth",
        308,
        "Mouth"
    ],
    [
        "Ether",
        309,
        "Earrings"
    ],
    [
        "Brown Body Tattoo",
        313,
        "Body"
    ],
    [
        "Bones",
        315,
        "Necklace"
    ],
    [
        "Crystal",
        315,
        "Earrings"
    ],
    [
        "Bird",
        322,
        "Pet"
    ],
    [
        "Cat Ear Violet",
        329,
        "Head"
    ],
    [
        "Rocka Billy",
        331,
        "Clothes"
    ],
    [
        "80s",
        353,
        "Clothes"
    ],
    [
        "Love",
        354,
        "Glasses"
    ],
    [
        "Sweater",
        434,
        "Clothes"
    ],
    [
        "Stripe",
        441,
        "Clothes"
    ],
    [
        "Bomber Jacket",
        443,
        "Clothes"
    ],
    [
        "Turtleneck",
        446,
        "Clothes"
    ],
    [
        "House Dress",
        446,
        "Clothes"
    ],
    [
        "Apron",
        447,
        "Clothes"
    ],
    [
        "Kimono",
        450,
        "Clothes"
    ],
    [
        "Casual",
        451,
        "Clothes"
    ],
    [
        "Tanktop",
        453,
        "Clothes"
    ],
    [
        "Checkerboard",
        455,
        "Clothes"
    ],
    [
        "Puffy Jacket",
        457,
        "Clothes"
    ],
    [
        "Formal",
        459,
        "Clothes"
    ],
    [
        "Headband",
        557,
        "Head"
    ],
    [
        "Ocean Blue",
        573,
        "Background"
    ],
    [
        "Android Green",
        577,
        "Background"
    ],
    [
        "Deep Chestnut",
        581,
        "Background"
    ],
    [
        "Deer",
        587,
        "Background"
    ],
    [
        "Smitten",
        588,
        "Background"
    ],
    [
        "Brown Sugar",
        590,
        "Background"
    ],
    [
        "Apple",
        592,
        "Background"
    ],
    [
        "Ocean Green",
        594,
        "Background"
    ],
    [
        "Mafia Hat",
        595,
        "Head"
    ],
    [
        "Moonstone",
        595,
        "Background"
    ],
    [
        "Royal Purple",
        595,
        "Background"
    ],
    [
        "Medium Turquoise",
        599,
        "Background"
    ],
    [
        "Deep Fuchsia",
        601,
        "Background"
    ],
    [
        "Laugh Toothless",
        603,
        "Mouth"
    ],
    [
        "Brass",
        606,
        "Background"
    ],
    [
        "Dog",
        607,
        "Pet"
    ],
    [
        "Think",
        615,
        "Eyes"
    ],
    [
        "Diamond",
        619,
        "Earrings"
    ],
    [
        "Skull",
        620,
        "Necklace"
    ],
    [
        "White Body Tattoo",
        629,
        "Body"
    ],
    [
        "VR",
        703,
        "Glasses"
    ],
    [
        "HUD",
        792,
        "Glasses"
    ],
    [
        "Ski Goggles",
        792,
        "Glasses"
    ],
    [
        "3D",
        814,
        "Glasses"
    ],
    [
        "Cat Ear Light Green",
        850,
        "Head"
    ],
    [
        "Cat Ear Green",
        853,
        "Head"
    ],
    [
        "Cat Ear Yellow",
        871,
        "Head"
    ],
    [
        "Sunglasses",
        887,
        "Glasses"
    ],
    [
        "Cat Ear Sky Blue",
        935,
        "Head"
    ],
    [
        "Cat Ear Pink",
        939,
        "Head"
    ],
    [
        "Big Glasses",
        941,
        "Glasses"
    ],
    [
        "Rich Lilac",
        1011,
        "Hair Band"
    ],
    [
        "Super Pink",
        1022,
        "Hair Band"
    ],
    [
        "Iceberg",
        1026,
        "Hair Band"
    ],
    [
        "Small Glasses",
        1029,
        "Glasses"
    ],
    [
        "Slate Blue",
        1106,
        "Hair Band"
    ],
    [
        "Mantis",
        1145,
        "Hair Band"
    ],
    [
        "Cat",
        1147,
        "Pet"
    ],
    [
        "Laugh",
        1159,
        "Mouth"
    ],
    [
        "Pink Body",
        1160,
        "Body"
    ],
    [
        "Rose",
        1168,
        "Necklace"
    ],
    [
        "Angry",
        1175,
        "Eyes"
    ],
    [
        "Chinese Green",
        1175,
        "Hair Band"
    ],
    [
        "Pearl",
        1190,
        "Earrings"
    ],
    [
        "Fuzzy Wuzzy",
        1199,
        "Hair Band"
    ],
    [
        "Golden Circle",
        1218,
        "Earrings"
    ],
    [
        "Dollar",
        1283,
        "Necklace"
    ],
    [
        "Mouth Open",
        1327,
        "Mouth"
    ],
    [
        "Disappointed",
        1335,
        "Mouth"
    ],
    [
        "Gold",
        1342,
        "Necklace"
    ],
    [
        "Close Smile",
        1344,
        "Mouth"
    ],
    [
        "Flat",
        1371,
        "Mouth"
    ],
    [
        "Pearls",
        1414,
        "Necklace"
    ],
    [
        "Bored",
        1708,
        "Eyes"
    ],
    [
        "Worried",
        1745,
        "Eyes"
    ],
    [
        "White Body",
        1762,
        "Body"
    ],
    [
        "Brown Body",
        1762,
        "Body"
    ],
    [
        "Front Cut Back",
        1793,
        "Hair"
    ],
    [
        "Dark Brown Body",
        1839,
        "Body"
    ],
    [
        "Bangs Back",
        1877,
        "Hair"
    ],
    [
        "Open",
        1899,
        "Eyes"
    ],
    [
        "Bangs",
        1974,
        "Hair"
    ],
    [
        "Front Cut",
        2043,
        "Hair"
    ],
    [
        "Straight Bun",
        2144,
        "Bun"
    ],
    [
        "Golden Square",
        2330,
        "Nose Piercing"
    ],
    [
        "Curly Bun",
        2594,
        "Bun"
    ],
    [
        "Circle Bun",
        2950,
        "Bun"
    ],
    [
        "Silver Circle",
        2993,
        "Earrings"
    ],
    [
        "Silver Square",
        3113,
        "Nose Piercing"
    ],
    [
        "None",
        12226,
        "Pet"
    ]
]



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