import React, { useEffect } from 'react';

const Boat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.defer = true;
    script.setAttribute('chatbotId', '6IZUVhbxMkYTrE7_08Qrz');
    script.setAttribute('domain', 'www.chatbase.co');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <iframe
        src="https://www.chatbase.co/chatbot-iframe/6IZUVhbxMkYTrE7_08Qrz"
        title="Chatbot"
        width="80%"
        style={{ height: '0%', minHeight: '5px' }}
        frameBorder="0"
      ></iframe>
    </>
  );
};

export default Boat;
