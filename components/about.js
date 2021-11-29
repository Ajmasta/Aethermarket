import styles from "./styles/about.module.css";
import Image from "next/image";
import TwitterIcon from "@mui/icons-material/Twitter";
import Link from "next/link";

const About = () => {
  return (
    <div className={styles.mainContainer} id="about">
      <div className={styles.title}> About </div>
      <div className={styles.contentContainer}>
        <div className={styles.textContainer}>
          <p className={styles.text}>
            The Aethercraft marketplace is the first project of Aethercraft. Our
            goal is to build multiple decentralized platforms that will create
            strong NFT communities.
          </p>

          <p className={styles.text}>
            {" "}
            We plan to turn this marketplace into a fully community-led platform
            through a system of governance NFTs, which will give their holders
            the ability to vote on important decisions. Once IMX puts fees in
            place for marketplaces, we also place to redistribute a portion of
            our profits to our community and to sponsor artists to create new
            art. During Beta, we are collecting feedback from our community to
            continuously improve our marketplace.
            <br /> <br /> Near the end of the beta, we will announce our NFT
            collection with many utilities for our holders to give you an edge
            in trading NFTs on IMX.
          </p>
        </div>
        <div className={styles.imageContainer}>
          <Image src={"/images/nameLogo.svg"} width={300} height={300} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <a href="https://aethercraft.io">
          <button className={styles.button}>Learn more</button>
        </a>
        <a href="https://forms.gle/FHMjyNwXK5G9mk2s8">
          <button className={styles.button}>Give Feedback</button>
        </a>
      </div>
      <Link href="https://twitter.com/aethercraftIMX">
        <a className={styles.twitterIcon}>
          <TwitterIcon />
        </a>
      </Link>
    </div>
  );
};

export default About;
