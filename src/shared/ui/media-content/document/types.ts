import { BaseTypes } from 'shared/types';

import { File } from '../../../../entities/message/model/types';
import { UseEasyStateReturnType } from '../../../hooks';

export type BaseDocumentProps = {
    url: string;
    name?: string;
    size?: number;
    extension?: string;
    disableDownload?: boolean;
    clickedFile?: UseEasyStateReturnType<{ blob: Blob; name: string } | null>;
};

export type DocumentsListItemProps = {
    id: number | string;
} & BaseDocumentProps;

export type DocumentsListProps = {
    items: DocumentsListItemProps[] | BaseTypes.Empty;
};
