import React, { ForwardRefExoticComponent } from 'react';

import useAudioStore from './store';
import * as Types from './types';
import Base from './ui/base';
import List from './ui/list';
import Voice from './ui/voice';

type CompoundedComponent = ForwardRefExoticComponent<Types.BaseAudioProps> & {
    List: typeof List;
    Voice: typeof Voice;
    store: typeof useAudioStore;
};

const Audio = Base as CompoundedComponent;

Audio.List = List;
Audio.Voice = Voice;
Audio.store = useAudioStore;

export { Types };

export default Audio;
