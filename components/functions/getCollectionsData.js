import badGrandma from "./badGrandma.json"

export const getCollectionsMeta =async  (collection,id) => {
const allData = []
for(let i = 0;i<0 ;i++){
const data = await (await fetch(`https://api.x.immutable.com/v1/assets/0x4ebfb80f9144713a690ec5a6485d0d4ed65194cd/${i}`)).json()
allData.push(data)
console.log(i)
}
getTraitsRarity(badGrandma)
console.log(allData)
}

const getTraitsRarity= (array) => {
  
const allArray = []
const filteredArray = array.map(item=>{
    if(item.metadata){
    delete item.metadata.name
    delete item.metadata.description
    delete item.metadata.image}else{console.log(item)}
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
    
    
    return a+b[1]},49))



}


const badGrandmaArray = [
    [
        "Clothes~Hoodie",
        49
    ],
    [
        "Head~Devil Horn",
        51
    ],
    [
        "Head~Witch",
        51
    ],
    [
        "Clothes~Witch",
        52
    ],
    [
        "Clothes~Leather Jacket",
        98
    ],
    [
        "Eyes~Demon",
        99
    ],
    [
        "Head~Holy",
        99
    ],
    [
        "Pet~Chameleon",
        99
    ],
    [
        "Body~Pink Body Tattoo",
        100
    ],
    [
        "Necklace~Ether",
        100
    ],
    [
        "Clothes~Leopard",
        100
    ],
    [
        "Head~Crown",
        100
    ],
    [
        "Mouth~Golden Teeth",
        100
    ],
    [
        "Earrings~Ether",
        102
    ],
    [
        "Glasses~Tough Life",
        120
    ],
    [
        "Necklace~Crystal",
        199
    ],
    [
        "Body~Dark Brown Body Tattoo",
        200
    ],
    [
        "Pet~Monkey",
        200
    ],
    [
        "Head~Bunny",
        201
    ],
    [
        "Eyes~Insomnia",
        201
    ],
    [
        "Head~80s",
        201
    ],
    [
        "Clothes~Animal Skin",
        201
    ],
    [
        "Earrings~Crystal",
        202
    ],
    [
        "Mouth~Tongue",
        202
    ],
    [
        "Clothes~Bikini",
        202
    ],
    [
        "Nose Piercing~Ether",
        205
    ],
    [
        "Glasses~Eyepatch",
        235
    ],
    [
        "Clothes~80s",
        246
    ],
    [
        "Clothes~Fur Coat",
        249
    ],
    [
        "Clothes~Army Shirt",
        300
    ],
    [
        "Clothes~Mini Dress",
        348
    ],
    [
        "Clothes~Mini Shirt",
        351
    ],
    [
        "Clothes~Sport",
        352
    ],
    [
        "Head~Bandana",
        378
    ],
    [
        "Mouth~Smile Teeth",
        397
    ],
    [
        "Eyes~Glaring",
        400
    ],
    [
        "Earrings~Diamond",
        401
    ],
    [
        "Body~Brown Body Tattoo",
        402
    ],
    [
        "Necklace~Bones",
        402
    ],
    [
        "Pet~Bird",
        402
    ],
    [
        "Nose Piercing~Diamond",
        405
    ],
    [
        "Head~Cat Ear Violet",
        423
    ],
    [
        "Clothes~Rocka Billy",
        449
    ],
    [
        "Glasses~Love",
        475
    ],
    [
        "Clothes~Turtleneck",
        571
    ],
    [
        "Clothes~Apron",
        580
    ],
    [
        "Clothes~Bomber Jacket",
        581
    ],
    [
        "Clothes~Kimono",
        583
    ],
    [
        "Clothes~Sweater",
        583
    ],
    [
        "Clothes~Stripe",
        583
    ],
    [
        "Clothes~Tanktop",
        584
    ],
    [
        "Clothes~Casual",
        584
    ],
    [
        "Clothes~Puffy Jacket",
        588
    ],
    [
        "Clothes~Formal",
        588
    ],
    [
        "Clothes~House Dress",
        588
    ],
    [
        "Clothes~Checkerboard",
        588
    ],
    [
        "Head~Headband",
        723
    ],
    [
        "Background~Apple",
        763
    ],
    [
        "Background~Moonstone",
        766
    ],
    [
        "Background~Deer",
        767
    ],
    [
        "Background~Smitten",
        767
    ],
    [
        "Background~Android Green",
        767
    ],
    [
        "Background~Medium Turquoise",
        767
    ],
    [
        "Background~Ocean Green",
        767
    ],
    [
        "Background~Deep Chestnut",
        769
    ],
    [
        "Background~Ocean Blue",
        771
    ],
    [
        "Background~Brown Sugar",
        772
    ],
    [
        "Background~Royal Purple",
        773
    ],
    [
        "Background~Deep Fuchsia",
        774
    ],
    [
        "Head~Mafia Hat",
        775
    ],
    [
        "Background~Brass",
        775
    ],
    [
        "Earrings~Golden Circle",
        797
    ],
    [
        "Eyes~Think",
        800
    ],
    [
        "Necklace~Skull",
        800
    ],
    [
        "Mouth~Laugh Toothless",
        802
    ],
    [
        "Body~White Body Tattoo",
        802
    ],
    [
        "Pet~Dog",
        805
    ],
    [
        "Nose Piercing~Golden Circle",
        809
    ],
    [
        "Glasses~VR",
        941
    ],
    [
        "Glasses~3D",
        1029
    ],
    [
        "Glasses~HUD",
        1030
    ],
    [
        "Glasses~Ski Goggles",
        1031
    ],
    [
        "Head~Cat Ear Green",
        1135
    ],
    [
        "Glasses~Sunglasses",
        1136
    ],
    [
        "Head~Cat Ear Light Green",
        1142
    ],
    [
        "Head~Cat Ear Yellow",
        1144
    ],
    [
        "Head~None",
        1145
    ],
    [
        "Head~Cat Ear Pink",
        1193
    ],
    [
        "Glasses~Big Glasses",
        1233
    ],
    [
        "Head~Cat Ear Sky Blue",
        1237
    ],
    [
        "Glasses~Small Glasses",
        1334
    ],
    [
        "Hair Band~Iceberg",
        1343
    ],
    [
        "Hair Band~Rich Lilac",
        1343
    ],
    [
        "Hair Band~Super Pink",
        1344
    ],
    [
        "Glasses~None",
        1434
    ],
    [
        "Hair Band~Mantis",
        1445
    ],
    [
        "Hair Band~Slate Blue",
        1447
    ],
    [
        "Necklace~Rose",
        1496
    ],
    [
        "Earrings~Golden Square",
        1499
    ],
    [
        "Pet~Cat",
        1499
    ],
    [
        "Body~Pink Body",
        1500
    ],
    [
        "Eyes~Angry",
        1502
    ],
    [
        "Mouth~Laugh",
        1505
    ],
    [
        "Nose Piercing~Golden Square",
        1516
    ],
    [
        "Hair Band~Fuzzy Wuzzy",
        1538
    ],
    [
        "Hair Band~Chinese Green",
        1538
    ],
    [
        "Earrings~Pearl",
        1576
    ],
    [
        "Necklace~Dollar",
        1665
    ],
    [
        "Earrings~Silver Circle",
        1679
    ],
    [
        "Necklace~None",
        1712
    ],
    [
        "Mouth~Mouth Open",
        1741
    ],
    [
        "Mouth~Flat",
        1749
    ],
    [
        "Mouth~Disappointed",
        1749
    ],
    [
        "Mouth~Close Smile",
        1753
    ],
    [
        "Necklace~Gold",
        1763
    ],
    [
        "Earrings~Silver Square",
        1771
    ],
    [
        "Necklace~Pearls",
        1861
    ],
    [
        "Earrings~None",
        1971
    ],
    [
        "Nose Piercing~Silver Circle",
        2219
    ],
    [
        "Nose Piercing~Silver Square",
        2220
    ],
    [
        "Eyes~Bored",
        2262
    ],
    [
        "Eyes~Worried",
        2263
    ],
    [
        "Body~Dark Brown Body",
        2327
    ],
    [
        "Body~Brown Body",
        2332
    ],
    [
        "Body~White Body",
        2335
    ],
    [
        "Hair~Front Cut Back",
        2346
    ],
    [
        "Hair~Bangs Back",
        2447
    ],
    [
        "Eyes~Open",
        2471
    ],
    [
        "Hair~Bangs",
        2553
    ],
    [
        "Nose Piercing~None",
        2624
    ],
    [
        "Hair~Front Cut",
        2652
    ],
    [
        "Bun~Straight Bun",
        2833
    ],
    [
        "Bun~Curly Bun",
        3328
    ],
    [
        "Bun~Circle Bun",
        3837
    ],
    [
        "Pet~None",
        6993
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