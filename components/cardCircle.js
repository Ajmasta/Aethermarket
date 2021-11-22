import styles from "./styles/cardCircle.module.css"
import Image from 'next/image'
const CardCircle = () => {


const generateCard=(image) =>{


    return(
        <div className={styles.imageContainer}>
            <Image src={`/images/${image}`} width={100} height={100} alt="card image"/>
        </div>
    )
}
    return(
        <div className={styles.mainContainer}>
   

            

        </div>

    )
}

export default CardCircle