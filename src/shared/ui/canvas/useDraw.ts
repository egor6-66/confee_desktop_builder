import { useRef } from 'react';

import { Tool, UseDraw } from './types';
import { useEasyState } from '../../hooks';

function useDraw(props: UseDraw) {
    const { imageUrl, onClose, getResult } = props;

    const drawRef = useRef<HTMLCanvasElement>(null);
    const color = useEasyState('black');
    const tool = useEasyState<Tool>('pencil');
    const strokeWidth = useEasyState(12);

    const undoList = useEasyState<Array<string>>([]);
    const redoList = useEasyState<Array<string>>([]);

    const undo = () => {
        const ctx = drawRef.current?.getContext('2d');
        if (!ctx || !drawRef.current || !undoList.value.length) return null;
        const copyUndoList = [...undoList.value];
        const src = copyUndoList.pop();
        undoList.set(copyUndoList);
        redoList.set((prev) => [...prev, drawRef.current?.toDataURL()]);

        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            };
        } else {
            ctx.clearRect(0, 0, drawRef.current.width, drawRef.current.height);
        }
    };

    const redo = () => {
        const ctx = drawRef.current?.getContext('2d');
        if (!ctx || !drawRef.current || !redoList.value.length) return null;
        const copyRedoList = [...redoList.value];
        const src = copyRedoList.pop();
        redoList.set(copyRedoList);
        undoList.set((prev) => [...prev, drawRef.current?.toDataURL()]);
        if (src) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight);
                ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            };
        }
    };

    return {
        drawCanvas: {
            color: color.value,
            ref: drawRef,
            tool: tool.value,
            pushToUndoList: (src: string) => undoList.set((prev) => [...prev, src]),
            clearRedoList: () => redoList.set([]),
            strokeWidth: strokeWidth.value,
        },
        drawControl: {
            ref: drawRef,
            color,
            onClose: () => {
                undoList.set([]);
                redoList.set([]);
                onClose();
            },
            getResult: (data: any) => {
                undoList.set([]);
                redoList.set([]);
                getResult(data);
            },
            tool,
            undo,
            redo,
            undoLength: undoList.value.length > 0,
            redoLength: redoList.value.length > 0,
            imageUrl,
            strokeWidth,
        },
    };
}

export default useDraw;
