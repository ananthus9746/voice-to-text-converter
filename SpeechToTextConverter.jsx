import React, { useEffect, useState } from 'react';

const SpeechToTextConverter = () => {
  const [transcripts, setTranscripts] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [speechRecognizer, setSpeechRecognizer] = useState(null);
  const [speechresult, setSpeechResult] = useState('');


  const startConverting = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognizer = new webkitSpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onstart = () => {
        setIsListening(true);
      };

      recognizer.onresult = (event) => {
        let finalTranscripts = '';
        let interimTranscripts = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          transcript.replace('\n', '<br>');
          if (event.results[i].isFinal) {
            finalTranscripts += transcript;
          } else {
            interimTranscripts += transcript;
          }
        }
        setSpeechResult(finalTranscripts)
        setTranscripts(finalTranscripts + '<span style="color: #999">' + interimTranscripts + '</span>');
      };

      recognizer.onerror = (event) => {
        // Handle error if needed
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognizer.start();
      setSpeechRecognizer(recognizer);
    } else {
      setIsSupported(false);
    }
  };

  const stopConverting = () => {
    if (speechRecognizer) {
      speechRecognizer.stop();
    }
  };

  useEffect(() => {
    // You can put any initialization logic here if needed
    return () => {
      stopConverting(); // Clean up the recognizer when the component unmounts
    };
  }, [speechRecognizer]);

  return (
    <div>
      <h3 align="center">Speech to text converter JavaScript</h3>
      <div
        id="result"
        className={`listening ${isListening ? 'active' : ''}`}
        dangerouslySetInnerHTML={{ __html: transcripts }}
      ></div>
<p>Result: {speechresult}</p>

      {isSupported ? (
        <div className="controls">
          {isListening ? (
            <button onClick={stopConverting}>Stop</button>
          ) : (
            <button onClick={startConverting}>Start Listening</button>
          )}
        </div>
      ) : (
        <div>Your browser is not supported. Please download Google Chrome or update your Google Chrome!!</div>
      )}
    </div>
  );
};

export default SpeechToTextConverter;
