import styles from "./styles/collectionList.module.css"


const CollectionList = ({collections}) => {

const createCollectionWidget =  (collections) => {
console.log(collections)
    return (collections.map(collection=><>
        <div className={styles.collectionContainer}>
            <div className={styles.iconContainer}>
                <img className={styles.image} src={collection.icon_url} />
            </div>
            <div className={styles.descriptionContainer}>
                <p className={styles.name}>{collection.name}</p>
                <p className={styles.info}>{collection.description}</p>
            </div>
        </div> 
        </>)
    )
}


    return(
        <div className={styles.mainContainer}>
        {createCollectionWidget(collections)}

        </div>

    )
}

export default CollectionList