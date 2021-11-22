import styles from "./styles/about.module.css"
import Image from 'next/image'

const About = () => {


return (

<div className={styles.mainContainer} id="about">
    <div className={styles.title}> About </div>
<div className={styles.contentContainer}>
<div className={styles.textContainer}>

    <p className={styles.text}>
        The Aethercraft marketplace is the first project of Aethercraft. Our goal is to build multiple
        decentralized platforms that will create strong NFT communities.</p>
        
        <p className={styles.text}> We plan to turn this marketplace into a fully community-led platform through a system of governance NFTs, 
        which will give their holders the ability to vote on important decisions.
        Once IMX puts fees in place for marketplaces, we also place to redistribute a 
        portion of our profits to our community and to sponsor artists to create new art. 
        For now, we are collecting feedback from our community to continuously improve our 

        marketplace.

    </p>

</div>
<div className={styles.imageContainer}>
    <Image src={"/images/nameLogo.svg"} width={300} height={300} />
</div>
    </div>
    <div className={styles.buttonContainer}>
    <button className={styles.button}>Learn more</button> <button className={styles.button}>Give Feedback</button>
    </div>
</div>


)

}


export default About