import { FC } from "react";
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css';
import styles from './ProductSlideshow.module.css'

interface Props{
    images: string[];
}

export const ProductSlideshow:FC<Props> = ({images}) => {
  return (
    <Slide
        easing="ease"
        duration={3500}
        indicators
    >
        {
            images.map(image => {
            
                return (
                    <div key={image} className={styles['each-slide']}>
                        <div style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                        }}>

                        </div>
                    </div>
                )
            })
        }
    </Slide>
  )
}
