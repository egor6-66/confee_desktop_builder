import React, { ForwardRefExoticComponent } from 'react';

import * as Types from './types';
import { ArrowAnimated, BroomAnimated, CallAnimated } from './ui/animated';
import Base from './ui/base';
import Canvas from './ui/cancas';
import Countries from './ui/countries';
import Devices from './ui/devices';
import Document from './ui/document';
import Logo from './ui/logo';
import NetworkIndicator from './ui/network-indicator';
import Picture from './ui/picture';
import Player from './ui/player';

type CompoundedComponent = ForwardRefExoticComponent<Types.BaseIconsProps> & {
    Logo: typeof Logo;
    ArrowAnimated: typeof ArrowAnimated;
    BroomAnimated: typeof BroomAnimated;
    Countries: typeof Countries;
    Player: typeof Player;
    Document: typeof Document;
    Picture: typeof Picture;
    NetworkIndicator: typeof NetworkIndicator;
    Devices: typeof Devices;
    Canvas: typeof Canvas;
    CallAnimated: typeof CallAnimated;
};

const Icons = Base as CompoundedComponent;
Icons.NetworkIndicator = NetworkIndicator;
Icons.Countries = Countries;
Icons.Logo = Logo;
Icons.Player = Player;
Icons.Document = Document;
Icons.Picture = Picture;
Icons.ArrowAnimated = ArrowAnimated;
Icons.BroomAnimated = BroomAnimated;
Icons.Devices = Devices;
Icons.CallAnimated = CallAnimated;
Icons.Canvas = Canvas;
export { Types };
export default Icons;
