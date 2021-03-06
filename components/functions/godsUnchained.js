import { SignalCellularConnectedNoInternet4BarRounded } from "@mui/icons-material";
import cards from "./godsUnchainedCards.json";
export const getAllCards = async () => {


  try {
    let data = await (
      await fetch("https://api.godsunchained.com/v0/proto?perPage=2000")
    ).json();
  } catch (err) {
    console.log(err);
  }


 
};

export const getAllNumberOfCards = async () => {
  const newArray = await Promise.all(
    cards.slice(0, 5).map(async (card) => {
      let fullData = [];
      let data = await (
        await fetch(`https://api.x.immutable.com/v1/assets?name=${card.name}`)
      ).json();
      let cursor = data.cursor;
      let i = 0;
      while (cursor !== "") {
        fullData.push(...data.result);
        data = await (
          await fetch(
            `https://api.x.immutable.com/v1/assets?name=${card.name}&cursor=${cursor}`
          )
        ).json();
        cursor = data.cursor;
        i++;
      
      }

      return { ...card, numberOfCards: fullData.length };
    })
  );
  
};
