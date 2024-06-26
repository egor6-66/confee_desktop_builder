import React, { createRef, MouseEventHandler, TouchEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from 'react-cropper';
import { mergeRefs } from 'react-merge-refs';
import { useUpdateEffect } from 'react-use';

import { useEasyState, useInView } from 'shared/hooks';
import { fileConverter } from 'shared/lib';
import { Box, Button, Canvas, Card, ContextMenu, ContextMenuTypes, Icons, Image, Video } from 'shared/ui';
import VideoPlayerWithControls from 'shared/ui/media-content/video/ui/with-controls';

import styles from './styles.module.scss';
import size from '../../../../../pages/warning/widgets/size';
import { PhotoAndVideoSwiperType, PhotoAndVideoSwiperItemsType } from '../../../model/types';

import 'cropperjs/dist/cropper.css';

type Props = {
    data?: PhotoAndVideoSwiperType;
    close: () => void;
    downloads: (items: any) => void;
    deleteMessage: () => void;
    forward: (items: any) => void;
    deleteImage: (id: string | number) => void;
    replaceImage: (id: number | string, file: File, url: string) => void;
};

function PhotoVideoSwiperView(props: Props) {
    const { forward, data, close, downloads, deleteMessage, deleteImage, replaceImage } = props;

    const cropperRef = useRef<ReactCropperElement>(null);

    const activeSlideRef = useRef<any>(null);
    const bottomSwiperRef = useRef<any>(null);

    const visibleFullscreenBtn = useEasyState(false);
    const visibleLeftBtn = useEasyState(true);
    const visibleRightBtn = useEasyState(true);

    const activeItem = useEasyState<PhotoAndVideoSwiperItemsType | null>(null);
    const imgSize = useEasyState({ naturalWidth: 0, naturalHeight: 0, containedWidth: 0, containedHeight: 0 });

    const fullScreen = useEasyState(false);
    const visibleContextMenu = useEasyState<'forward' | 'upload' | null>(null);

    const activeCrop = useEasyState(false);
    const activeDraw = useEasyState(false);
    const rotate = useEasyState(0);

    const { drawCanvas, drawControl } = Canvas.useDraw({
        imageUrl: activeItem.value?.url,
        onClose: () => activeDraw.set(false),
        getResult: (data) => {
            if (activeItem.value) {
                activeItem.set({ ...activeItem.value, url: data.url });
                replaceImage(activeItem.value?.id, data.file, data.url);
                activeDraw.set(false);
            }
        },
    });

    const { ref: firsItemRef, inView: inViewFirsItemRef } = useInView({ threshold: 0.5 });
    const { ref: lastItemRef, inView: inViewLastItemRef } = useInView({ threshold: 0.5 });

    const nextSlide = () => {
        const foundIndex: any = data?.items.findIndex((i) => i.id === activeItem.value?.id);
        if (foundIndex !== -1) {
            const next = data?.items[foundIndex + 1];
            next && activeItem.set(next);
        }
    };

    const prevSlide = () => {
        const foundIndex: any = data?.items.findIndex((i) => i.id === activeItem.value?.id);
        if (foundIndex !== -1) {
            const next = data?.items[foundIndex - 1];
            next && activeItem.set(next);
        }
    };

    const onCrop = async () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            return new Promise((resolve, reject) => {
                cropper.getCroppedCanvas().toBlob((blob) => {
                    if (blob && activeItem.value) {
                        const blobUrl = fileConverter.blobLocalPath(blob);
                        const file = new File([blob as any], activeItem.value?.name || 'img.jpg', { type: 'image/jpeg' });
                        activeItem.set({ ...activeItem.value, url: blobUrl });
                        replaceImage(activeItem.value.id, file, blobUrl);
                        activeCrop.set(false);
                    }
                }, 'image/jpeg');
            });
        }
    };

    const downloadAndForwardMenuItems: ContextMenuTypes.ContextMenuItem[] = [
        {
            id: 0,
            title: data?.type === 'img' ? 'Все фото' : 'Все видео',
            callback: () => {
                if (visibleContextMenu.value === 'upload') {
                    downloads(data?.items);
                } else {
                    forward([]);
                }

                visibleContextMenu.set(null);
            },
        },
        {
            id: 1,
            title: 'Только это',
            callback: () => {
                if (visibleContextMenu.value === 'upload') {
                    downloads([activeItem.value]);
                } else {
                    forward([activeItem.value]);
                }

                visibleContextMenu.set(null);
            },
        },
    ];

    const actions = [
        {
            id: 0,
            icon: <Icons variant="upload" />,
            onClick: () => (multiple ? visibleContextMenu.set('upload') : downloads([activeItem.value])),
        },
        {
            id: 1,
            icon: <Icons variant="redirect" />,
            onClick: () => (multiple ? visibleContextMenu.set('forward') : forward([activeItem.value])),
        },
        { id: 2, icon: <Icons variant="delete" />, onClick: deleteMessage },
    ];

    const actionsImgUpdate = [
        { id: 0, icon: <Icons variant="crop" />, onClick: () => activeCrop.set(true) },
        { id: 1, icon: <Icons variant="edit" />, onClick: () => activeDraw.set(true) },
        {
            id: 2,
            icon: <Icons variant="delete" />,
            onClick: () => {
                visibleLeftBtn.value ? prevSlide() : nextSlide();
                deleteImage(activeItem.value?.id || 0);
            },
        },
    ];

    const actionsCrop = [
        { id: 0, icon: null, title: 'Отмена', onClick: () => activeCrop.set(false) },
        { id: 1, icon: <Icons variant="rotate-img" />, onClick: () => rotate.set(rotate.value + 45) },
        { id: 2, icon: null, title: 'Готово', onClick: onCrop, active: true },
    ];

    useEffect(() => {
        activeSlideRef?.current?.scrollIntoView();
        visibleLeftBtn.set(activeItem.value?.id !== data?.items[0].id);
        visibleRightBtn.set(activeItem.value?.id !== data?.items[data?.items.length - 1].id);
    }, [activeItem.value?.id]);

    useEffect(() => {
        const found = data?.items.find((i, index) => index === data?.startIndex);
        found && activeItem.set(found);
    }, [data?.startIndex]);

    const multiple = data?.items?.length && data.items.length > 1;

    const bottomSwiperRefs = (item: any, index: number) => {
        const refs = [];
        if (item.id === activeItem.value?.id) refs.push(activeSlideRef);
        if (index === 0) refs.push(firsItemRef);
        if (data?.items.length && index === data?.items.length - 1) refs.push(lastItemRef);
        return refs;
    };

    const scroll = (scrollOffset: number) => {
        if (bottomSwiperRef.current) {
            bottomSwiperRef.current.scrollLeft += scrollOffset;
        }
    };

    const actionItems: any = activeCrop.value ? actionsCrop : data?.update ? actionsImgUpdate : actions;

    useEffect(() => {
        if (cropperRef.current) {
            cropperRef.current.cropper.rotateTo(rotate.value);
        }
    }, [rotate.value]);

    return (
        <div className={styles.wrapper} onContextMenu={(e) => e.preventDefault()}>
            <ContextMenu
                y={-100}
                trigger="mouseup"
                clickAway={() => visibleContextMenu.set(null)}
                items={downloadAndForwardMenuItems}
                visible={!!visibleContextMenu.value}
            />
            <div className={styles.closeIcon} onClick={close}>
                <Icons variant="close" />
            </div>
            <div className={styles.swiperTop} style={{ margin: fullScreen.value ? '0' : '20px 0', height: `calc(100% - ${multiple ? '230px' : '130px'})` }}>
                {data?.type === 'img' && !activeCrop.value && visibleFullscreenBtn.value && !activeDraw.value && (
                    <div
                        className={styles.fullscreen}
                        // style={{ bottom: fullScreen.value ? 30 : 290 }}
                        onClick={fullScreen.toggle}
                        onMouseEnter={(e) => {
                            visibleFullscreenBtn.set(true);
                        }}
                    >
                        <Icons.Player variant={fullScreen.value ? 'no-full' : 'full'} />
                    </div>
                )}
                {visibleLeftBtn.value && (
                    <div className={styles.btnLeft} onClick={prevSlide}>
                        {multiple && <Icons variant="arrow-drop-left" />}
                    </div>
                )}
                {activeItem.value && (
                    <div
                        className={styles.slideTop}
                        onMouseEnter={(e) => {
                            visibleFullscreenBtn.set(true);
                        }}
                        onMouseLeave={() => visibleFullscreenBtn.set(false)}
                    >
                        {activeDraw.value && <Canvas.Draw {...drawCanvas} size={imgSize.value} />}
                        {activeCrop.value ? (
                            <Cropper
                                src={activeItem.value.url}
                                ref={cropperRef}
                                style={{ height: '100%', width: '100%' }}
                                zoomTo={0}
                                initialAspectRatio={0}
                                // preview=".img-preview"
                                viewMode={0}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive
                                autoCropArea={1}
                                checkOrientation
                                guides
                            />
                        ) : (
                            <>
                                {data?.type === 'img' && (
                                    <Image
                                        getSize={(size) => {
                                            imgSize.set(size);
                                        }}
                                        visibleDropdown={false}
                                        url={activeItem.value?.url}
                                        objectFit="contain"
                                    />
                                )}
                                {data?.type === 'video' && (
                                    <VideoPlayerWithControls
                                        autoPlay
                                        clickFull={() => fullScreen.toggle()}
                                        visibleDropdown={false}
                                        url={activeItem.value.url}
                                    />
                                )}
                            </>
                        )}
                    </div>
                )}
                {visibleRightBtn.value && (
                    <div className={styles.btnRight} onClick={nextSlide}>
                        {multiple && <Icons variant="arrow-drop-right" />}
                    </div>
                )}
            </div>
            <div className={`${styles.footer} ${fullScreen.value ? styles.footer_hidden : ''}`}>
                {activeDraw.value ? (
                    <Canvas.DrawControl {...drawControl} />
                ) : (
                    <div className={styles.actions}>
                        {actionItems.map((i: any) => (
                            <div key={i.id} className={styles.item} onClick={i.onClick} style={{ color: i?.active ? 'var(--text-action)' : '' }}>
                                {i?.icon}
                                {i?.title}
                            </div>
                        ))}
                    </div>
                )}
                {multiple && (
                    <div className={styles.swiperContainer}>
                        {!inViewFirsItemRef && (
                            <div className={styles.btnLeft} onClick={() => scroll(-220)}>
                                <Icons variant="arrow-drop-left" />
                            </div>
                        )}
                        <div className={styles.swiper} ref={bottomSwiperRef}>
                            {data?.items?.map((i, index) => (
                                <div
                                    ref={mergeRefs(bottomSwiperRefs(i, index))}
                                    key={i.id}
                                    className={`${styles.slideBottom} ${activeItem.value?.id === i.id ? styles.slideBottom_active : ''}`}
                                >
                                    {data?.type === 'img' && (
                                        <Image
                                            height="80px"
                                            width="56px"
                                            visibleDropdown={false}
                                            url={i.url}
                                            onClick={() => activeItem.set(i)}
                                            objectFit="cover"
                                        />
                                    )}
                                    {data?.type === 'video' && (
                                        <Video height="80px" width="56px" visibleDropdown={false} url={i.url} onClick={() => activeItem.set(i)} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {!inViewLastItemRef && (
                            <div className={styles.btnRight} onClick={() => scroll(220)}>
                                <Icons variant="arrow-drop-right" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PhotoVideoSwiperView;
