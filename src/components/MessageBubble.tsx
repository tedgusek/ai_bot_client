import { MessageBubbleInterface } from '@/Interface';
import React from 'react';

const MessageBubble: React.FC<MessageBubbleInterface> = ({ message, user }) => {
  const userStyling =
    'ml-auto text-right m-2 px-4 py-2 max-w-xs bg-blue-300 rounded-xl drop-shadow-md';

  const botStyling =
    'mr-auto text-left m-2 px-4 py-2 max-w-xs bg-slate-300 rounded-xl drop-shadow-md';

  return <div className={user ? userStyling : botStyling}> {message} </div>;
};

export default MessageBubble;
