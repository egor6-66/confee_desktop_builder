import { UserTypes } from 'entities/user';

export type ModalName = 'personal-info' | 'change-name' | 'change-nickname' | 'change-birth' | 'change-email';
export type Viewer = {} & UserTypes.User;
