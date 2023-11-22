import React from 'react';

import { BaseTypes } from 'shared/types';
import { Document } from 'shared/ui';

import styles from './styles.module.scss';
import { UseEasyStateReturnType } from '../../../../../../shared/hooks';
import { File } from '../../../../model/types';

type Props = {
    documents: File[];
    clickedFile: UseEasyStateReturnType<{ blob: Blob; name: string } | null>;
} & BaseTypes.Statuses;

function DocumentsMessage(props: Props) {
    const { documents, clickedFile } = props;

    return (
        <div className={styles.wrapper}>
            {documents.map((i, index) => (
                <div key={i.id} className={styles.item}>
                    <Document clickedFile={clickedFile} url={i.url} name={i.name} extension={i.extension} />
                </div>
            ))}
        </div>
    );
}

export default DocumentsMessage;
