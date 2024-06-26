import React from 'react';

import { contactApi, ContactProfileView, contactProxy } from 'entities/contact';
import { useRouter } from 'shared/hooks';

import ChangeNameContactModal from './modals/change-name';
import { useCall } from '../../../entities/call';
import { chatApi, chatProxy } from '../../../entities/chat';
import { Modal, Notification } from '../../../shared/ui';

function ContactProfile() {
    const { params, navigate } = useRouter();

    const changeNameModal = Modal.use();

    const meet = useCall();

    const notifications = Notification.use();

    const { data: contactData, isLoading } = contactApi.handleGetContact({ contactId: Number(params.contact_id) });
    const { data: chatData } = chatApi.handleGetChatWithUser({ userId: contactData?.user.id });

    const { mutate: handleDeleteContact } = contactApi.handleDeleteContact();
    const { mutate: handleUpdateName } = contactApi.handleUpdateName();
    const { mutate: handleMuteContact } = contactApi.handleMuteContact();
    const { mutate: handleCreatePersonalChat } = chatApi.handleCreatePersonalChat();

    const getChat = () => {
        if (chatData) {
            navigate(`/chats/personal/chat/${chatData?.id}`);
        } else if (contactData?.user.id) {
            handleCreatePersonalChat(
                { user_ids: [contactData?.user.id], is_group: false },
                {
                    onSuccess: (res) => {
                        navigate(`/chats/personal/chat/${res?.data.data.id}`);
                    },
                }
            );
        }
    };

    const getCall = () => {
        if (chatData) {
            meet.openCreateMeet(chatProxy(chatData));
        } else if (contactData?.user.id) {
            handleCreatePersonalChat(
                { user_ids: [contactData?.user.id], is_group: false },
                {
                    onSuccess: (res) => {
                        meet.openCreateMeet(chatProxy(res?.data.data));
                    },
                }
            );
        }
    };

    const deleteContact = () => {
        handleDeleteContact({ contactId: Number(params.contact_id) }, { onSuccess: () => navigate('/contacts/personal') });
    };

    const muteContact = () => {
        contactData?.id && handleMuteContact({ contactId: contactData?.id, mute: !contactData?.muted });
    };

    const updName = (name: string) => {};

    const clickAvatar = () => {};

    return (
        <>
            <ChangeNameContactModal {...changeNameModal} />
            <ContactProfileView
                actions={{
                    getChat,
                    delete: deleteContact,
                    audioCall: getCall,
                    videoCall: notifications.inDev,
                    mute: muteContact,
                    openChangeNameModal: changeNameModal.open,
                }}
                updName={updName}
                clickAvatar={clickAvatar}
                back={() => navigate('/contacts')}
                contact={contactProxy(contactData)}
                loading={isLoading}
            />
        </>
    );
}

export default ContactProfile;
