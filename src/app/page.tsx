'use client';

import React, { useEffect, useState } from 'react';
import MessageBubble from '@/components/MessageBubble';
import { MessageBubbleInterface } from '@/Interface';

function Home() {
  const [message, setMessage] = useState('Loading...');
  const [botresponse, setBotresponse] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [messageLog, setMessageLog] = useState<
    { message: string; user: boolean }[]
  >([]);
  const [user, setUser] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/home')
      .then((response) => response.json())
      .then((data) => setMessage(data.message));
  }, []);

  useEffect(() => {
    if (botresponse !== '') {
      setMessageLog((prevLog) => [
        ...prevLog,
        { message: botresponse, user: false },
      ]);
      // console.log('sentMessage : ', sentMessage);
      // console.log('botresponse : ', botresponse);
      // console.log('user : ', user);
    }
  }, [botresponse]);

  const changeUser = (texter: boolean) => {
    setUser(!texter);

    console.log('am i ever here?');
  };
  // useEffect(() => {
  //   fetch('http://localhost:8080/botresponse')
  //     .then((response) => response.json())
  //     .then((data) => setBotresponse(data.bot_response));
  // }, []);

  const handleSendMessage = () => {
    // Prevents empty messages from being sent
    if (!userMessage.trim()) return;

    fetch('http://localhost:8080/botresponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        setBotresponse(data.bot_response);
        // console.log('From response data', data.bot_response);
        // console.log('from state ', botresponse);
      })
      .catch((error) => console.error('Error sending message: ', error));

    setMessageLog((prevLog) => [
      ...prevLog,
      { message: sentMessage, user: true },
    ]);
    // setSentMessage(userMessage);
    // changeUser(user);
    setUserMessage('');
    console.log('from state take 2 ', botresponse);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
      // console.log(botresponse);
    }
  };

  return (
    <main className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='font-bold text-3xl p-4'>Serverless ChatBot</h1>
      <div className='flex flex-col w-4/5 bg-green-500 h-96 items-center justify-center'>
        <div className='text-center my-2 w-4/5 h-4/5 bg-slate-300 rounded-xl drop-shadow-md'>
          <div>{message}</div>
          {messageLog.map((msg, index) => (
            <MessageBubble key={index} message={msg.message} user={msg.user} />
          ))}
          {/* <MessageBubble message={sentMessage} user={user} /> */}
          {/* <div> Your bot says {botresponse}</div> */}
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
