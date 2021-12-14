const Calls = () => {
const getData = async () => {
  let i = 0
    let roll = true
    let cursor=""
    const dataArray = []
        while(roll) {
            const data = cursor? await (await fetch(`https://api.x.immutable.com/v1/orders?order_by=buy_quantity&status=active&sell_token_type=ERC721&cursor=${cursor}&sell_token_address=0x5f32923175e13713242b3ddd632bdee82ab5f509`)).json()
            :await (await fetch(`https://api.x.immutable.com/v1/orders?order_by=created_at&status=active&sell_token_type=ERC721&sell_token_address=0x5f32923175e13713242b3ddd632bdee82ab5f509`)).json()
            dataArray.push(data)
            cursor=data.cursor
          
        
            if (!cursor) roll=false
        }

}
const getSingleData= async () =>{
const dataArray = []
    for(let i = 0; i<=2500;i++){
 const data = await (await fetch(`https://api.x.immutable.com/v1/orders?sell_token_address=0x5f32923175e13713242b3ddd632bdee82ab5f509&status=active`))
        dataArray.push(data)
}

}
getData()
    return <p>test</p>
}

export default Calls