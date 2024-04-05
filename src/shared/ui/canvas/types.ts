import { Drawable, Options } from 'roughjs/bin/core';

import { UseEasyStateReturnType } from '../../hooks';

export type Tool = 'arrow' | 'rect' | 'circle' | 'pencil';
export type Tag = 'rough' | 'arrow';
export type UseDraw = {
    imageUrl?: string;
    onClose: () => void;
    getResult: (data: { file: File; url: string }) => void;
};

export type DrawCanvasProps = {
    size: {
        naturalWidth: number;
        naturalHeight: number;
        containedWidth: number;
        containedHeight: number;
    };
    elements?: UseEasyStateReturnType<Item[]>;
    color?: string;
    tool?: Tool;
};

export type DrawControlProps = {
    imageUrl?: string;
    elements?: UseEasyStateReturnType<Item[]>;
    canceledElements?: UseEasyStateReturnType<Item[]>;
    color: UseEasyStateReturnType<string>;
    onClose: () => void;
    getResult: (data: { file: File; url: string }) => void;
    tool?: UseEasyStateReturnType<Tool>;
};

export type Coords = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
};

export type Item = {
    coords: Coords;
    points: Array<[number, number]>;
    el: Drawable;
    tag: Tag;
};
