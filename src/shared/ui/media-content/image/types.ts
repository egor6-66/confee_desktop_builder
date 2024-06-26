import { CSSProperties } from 'react';

import { BaseTypes } from 'shared/types';

import { MediaContentType } from '../../../../entities/message/model/types';
import { UseEasyStateReturnType } from '../../../hooks';

export type BaseImageProps = {
    id?: number | string;
    url: string;
    name?: string;
    width?: string;
    maxWidth?: string;
    horizontalImgWidth?: string;
    height?: string;
    onClick?: () => void;
    borderRadius?: boolean;
    remove?: (id: number | string) => void;
    objectFit?: 'cover' | 'contain';
    visibleDropdown?: boolean;
    getSize?: (size: { naturalWidth: number; naturalHeight: number; containedWidth: number; containedHeight: number }) => void;
    maxHeight?: string;
} & BaseTypes.Statuses;

export type ImagesListItem = {
    id: number | string;
} & BaseImageProps;

export type ImagesListProps = {
    items: ImagesListItem[] | BaseTypes.Empty;
    style?: CSSProperties;
    imgClick?: (index: number) => void;
    visibleDropdown?: boolean;
} & BaseTypes.Statuses;

export type ImageCardProps = {
    url: string;
    name: string;
    size: number;
} & BaseTypes.Statuses;

export type ImagesSwiperProps = {
    visible: boolean;
    closeClick: () => void;
    initialSlide?: number;
    items: ImagesListItem[] | BaseTypes.Empty;
} & BaseTypes.Statuses;
