import contactProxy from './lib/proxy';
import contactService from './lib/service';
import useContactsTabsAndLists from './lib/useTabsAndLists';
import contactApi from './model/api';
import contactGateway from './model/gateway';
import contactStore, { ContactSoreTypes } from './model/store';
import * as contactTypes from './model/types';
import ContactsListView from './ui/list';
import AddContactModalView from './ui/modals/add-contact';
import ContactProfileView from './ui/profile';

export type { ContactSoreTypes };
export {
    contactService,
    contactStore,
    contactTypes,
    contactApi,
    useContactsTabsAndLists,
    contactProxy,
    ContactsListView,
    contactGateway,
    AddContactModalView,
    ContactProfileView,
};
