import React, { Fragment, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';

import styles from './styles.module.scss';
import { useInView } from '../../../../hooks';
import { Box, Card, Icons } from '../../../index';
import { CardListProps } from '../../types';

function CardList(props: CardListProps) {
    const { items, selected, sortByName, visibleLastItem } = props;

    const getArray = () => {
        if (sortByName && items?.length) {
            const collator = new Intl.Collator('ru');
            return items.sort((a, b) => {
                if (Number.isNaN(a.name) && !Number.isNaN(b.name)) return -1;
                if (!Number.isNaN(a.name) && Number.isNaN(b.name)) return 1;
                return collator.compare(a.name as string, b.name as string);
            });
        }
        return items;
    };
    const arr = getArray();

    const getDelimiter = (arr: any[], index: number) => {
        if (!sortByName) return null;
        const item = <div className={styles.delimiter}>{arr[index].name[0].toUpperCase()}</div>;
        if (!arr[index - 1]) return item;
        return arr[index - 1].name[0] !== arr[index].name[0] && item;
    };

    const { ref: lastCard, inView: inViewLastCard } = useInView({ delay: 200 });

    useEffect(() => {
        visibleLastItem && visibleLastItem(inViewLastCard);
    }, [inViewLastCard]);

    return (
        <div className={styles.wrapper}>
            {arr?.map((i, index) => (
                <Fragment key={i.id}>
                    {getDelimiter(arr, index)}
                    <div className={styles.item} onClick={() => selected && selected.pushOrDelete(i)} ref={index + 1 === arr?.length ? lastCard : null}>
                        <div className={styles.info}>
                            <Card onClick={i.onClick} key={i.id} name={i?.name || ''} title={i?.title || ''} img={i?.img || ''} subtitle={i?.subtitle || ' '} />
                        </div>

                        {selected && (
                            <div className={styles.selectIndicator}>
                                <Box.Animated visible={!!selected && !!selected.findById(i.id)}>
                                    <Icons variant="check" />
                                </Box.Animated>
                            </div>
                        )}
                    </div>
                </Fragment>
            ))}
        </div>
    );
}

export default CardList;
