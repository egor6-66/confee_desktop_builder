import React, { useEffect, useState } from 'react';
import { FreeMode, Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';

import styles from './styles.module.scss';
import { Button, Icons, Image, Video } from '../../../../shared/ui';
import VideoPlayer from '../../../../shared/ui/media-content/video';
import VideoPlayerWithControls from '../../../../shared/ui/media-content/video/ui/with-controls';
import { PhotoAndVideoSwiperItemsType, PhotoAndVideoSwiperType } from '../../model/types';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

type Props = {
    data: PhotoAndVideoSwiperType;
};

function PhotoVideoSwiperView(props: Props) {
    const { data } = props;
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [swiper, setSwiper] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState<any>(data.startIndex || 0);

    const onSwiper = (swiper: SwiperClass) => {
        setSwiper(swiper);
        swiper
            ? window.addEventListener('keydown', function (event) {
                  switch (event.code) {
                      case 'ArrowRight':
                          return swiper?.slideNext(400);
                      case 'ArrowLeft':
                          return swiper?.slidePrev(400);
                  }
              })
            : window.removeEventListener('keydown', () => '');
    };

    useEffect(() => {
        swiper?.slideTo(data.startIndex || 0);
    }, [data.startIndex]);

    const multiple = data?.items?.length && data.items.length > 1;

    return (
        <div className={styles.wrapper}>
            <Swiper
                onActiveIndexChange={(e) => {
                    setActiveIndex(e.activeIndex);
                }}
                onSwiper={onSwiper}
                spaceBetween={10}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className={styles.swiperTop}
            >
                {data.items?.map((i) => (
                    <SwiperSlide key={i.id}>
                        {data.type === 'img' && <Image visibleDropdown={false} url={i.url} objectFit="contain" />}
                        {data.type === 'video' && <VideoPlayerWithControls visibleDropdown={false} url={i.url} />}
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className={styles.footer}>
                <div className={styles.actions}>dwad</div>
                {multiple && (
                    <div className={styles.swiperContainer}>
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            onActiveIndexChange={(e) => {
                                setActiveIndex(e.activeIndex);
                            }}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode
                            watchSlidesProgress
                            modules={[FreeMode, Navigation, Thumbs]}
                            className={styles.swiperBottom}
                        >
                            {data.items?.map((i, index) => (
                                <SwiperSlide key={i.id} className={`${styles.sliderBottom} ${activeIndex === index ? styles.sliderBottom_active : ''}`}>
                                    {data.type === 'img' && <Image visibleDropdown={false} url={i.url} onClick={() => ''} />}
                                    {data.type === 'video' && <Video height="100%" width="100%" visibleDropdown={false} url={i.url} />}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PhotoVideoSwiperView;
