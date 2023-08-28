import React, { memo, useState } from 'react';

import styles from './styles.module.scss';
import { ImagesListProps } from '../../types';
import Image from '../base';

function ImageList(props: ImagesListProps) {
    const { items } = props;

    return (
        <div className={styles.wrapper}>
            {items?.map((i) => (
                <Image key={i.id} {...i} borderRadius={false} />
            ))}
        </div>
    );
}
export default ImageList;