'use client';

import React, { useEffect, useState, useRef } from 'react';
import MessageBubble from '@/components/MessageBubble';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function Home() {
  const [message, setMessage] = useState('Loading...');
  const [botresponse, setBotresponse] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [messageLog, setMessageLog] = useState<
    { message: string; user: boolean }[]
  >([]);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Retrieves Welcome message from the server on page load
  useEffect(() => {
    fetch(`${apiUrl}/api/home`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  // Saves the bot response to the state
  useEffect(() => {
    if (botresponse !== '') {
      setMessageLog((prevLog) => [
        ...prevLog,
        { message: botresponse, user: false },
      ]);
    }
  }, [botresponse]);

  // Scrolls to the bottom of the Message conatainer when the messageLog is updated
  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messageLog]);

  const handleSendMessage = () => {
    // Prevents empty messages from being sent
    if (!userMessage.trim()) return;

    const alternateTexts: string[] = [
      `HumanMessage(content="`,
      `AIMessage(content="`,
    ];
    const messageHistory: string[] = [];
    // I want to create an array of messages from the messageLog and userMessage to send as the userMessage to save the chat history
    messageLog.forEach((ele, index) => {
      const textToUse: string = alternateTexts[index % alternateTexts.length];
      messageHistory.push(textToUse + ele['message'] + '")');
    });
    messageHistory.push(`HumanMessage(content="${userMessage}"`);
    console.log('messageHistory : ', messageHistory);

    fetch(`${apiUrl}/botresponse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_message: messageHistory }), // swapped out userMessage for messageHistory
    })
      .then((response) => response.json())
      .then((data) => {
        setBotresponse(data.bot_response);
      })
      .catch((error) => console.error('Error sending message: ', error));

    setMessageLog((prevLog) => [
      ...prevLog,
      { message: userMessage, user: true },
    ]);
    setUserMessage('');
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='font-bold text-3xl p-4'>Serverless ChatBot</h1>
      <div className='flex flex-col w-4/5 bg-green-500 h-96 items-center justify-center rounded-xl max-w-lg'>
        <div
          ref={messageContainerRef}
          className='text-center my-2 w-4/5 h-4/5 bg-slate-300 rounded-xl drop-shadow-md overflow-y-scroll'
        >
          <div>{message}</div>
          {messageLog.map((msg, index) => (
            <MessageBubble key={index} message={msg.message} user={msg.user} />
          ))}
        </div>
        <input
          className='rounded-xl  px-4 my-2 bg-slate-300 drop-shadow-xl w-4/5'
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className='rounded-xl px-4 my-2 drop-shadow-xl bg-slate-300'
          onClick={handleSendMessage}
          disabled={!userMessage.trim()}
        >
          Send
        </button>
      </div>
    </main>
  );
}

export default Home;
