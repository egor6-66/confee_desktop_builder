import { messages_limit } from './constants';
import { useArray } from '../../../shared/hooks';
import { Chat } from '../../chat/model/types';
import { viewerService } from '../../viewer';
import { messageProxy } from '../index';
import { Message } from '../model/types';

class MessageService {
    getUpdatedList(messageData: any) {
        const { getUniqueArr } = useArray({});
        const uniq = getUniqueArr(messageData?.pages?.reduce((messages: any, page: any) => [...[...page.data.data].reverse(), ...messages], []) || [], 'id');
        const firstUnreadMessage = uniq.find((i) => !i.is_read);
        return uniq.map((message: any, index: number) => messageProxy((uniq[index - 1] as Message) || null, message, uniq[index + 1] as Message) || null) || [];
    }

    getInitialPage(chat: Chat | undefined) {
        if (!chat) return undefined;
        if (chat.pending_messages_count === 0) return 1;
        return Math.ceil(chat.pending_messages_count / messages_limit);
    }

    getAuthorName(message: Message | null) {
        if (!message) return '';
        const viewerId = viewerService.getId();
        return message?.author?.id === viewerId ? 'Вы' : message?.author?.first_name;
    }
}

export default new MessageService();
