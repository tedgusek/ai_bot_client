import { MessageBubbleInterface } from '@/Interface';
import React, { useEffect, useState } from 'react';

const MessageBubble: React.FC<MessageBubbleInterface> = ({ message, user }) => {
  //   const [bubbleStyling, setBubbleStyling] = useState(
  //     'text-left m-2 px-2 w-4/5 h-auto bg-slate-300 rounded-xl drop-shadow-md'
  //   );

  const userStyling =
    'text-left m-2 px-2 w-4/5 h-auto bg-slate-300 rounded-xl drop-shadow-md';
  const botStyling =
    'text-right m-2 px-2 w-4/5 h-auto bg-blue-300 rounded-xl drop-shadow-md';
  // If message comes from bot, make bg blue
  // If message comes from user make bg slate
  //   if (!user) {
  //     setBubbleStyling(
  //       'text-left my-2 w-4/5 h-4/5 bg-blue-300 rounded-xl drop-shadow-md'
  //     );
  //   }

  return <div className={user ? userStyling : botStyling}> {message} </div>;
};

export default MessageBubble;
