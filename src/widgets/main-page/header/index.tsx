import React from 'react';

import { MainPageNavigation } from 'features/navbars';
import { ViewerCard } from 'features/viewer';
import { Icons, Box } from 'shared/ui';

import styles from './styles.module.scss';

function HeaderMainPage() {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <Icons.Logo variants="confee" />
            </div>
            <div className={styles.nav}>
                <MainPageNavigation />
            </div>
            <div className={styles.viewer}>
                <ViewerCard />
            </div>
        </div>
    );
}

export default HeaderMainPage;