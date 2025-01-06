import { useState } from "react";
import axios from "axios";
function App()
{
  const[messages, setmessages] = useState([]);
  const[input, setInput] = useState("");
  const[loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { user: true, text: input };
      setmessages([...messages, userMessage]);
      setInput("");
      setLoading(true);
  
      const maxRetries = 3; // Number of retries
      let retryCount = 0;
      let success = false;
  
      while (retryCount < maxRetries && !success) {
        try {
          // Call OpenAI API
          const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [
                ...messages.map((msg) => ({
                  role: msg.user ? "user" : "assistant",
                  content: msg.text,
                })),
                { role: "user", content: input },
              ],
            },
            {
              headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer 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`
              }
            }
          );
  
          const botReply = response.data.choices[0].message.content;
          setmessages((prev) => [...prev, { user: false, text: botReply }]);
          success = true; // Mark as successful
        } catch (error) {
          if (error.response && error.response.status === 429) {
            retryCount++;
            console.warn(
              `Request throttled. Retrying (${retryCount}/${maxRetries})...`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
          } else {
            console.error("Error fetching response from OpenAI:", error);
            setmessages((prev) => [
              ...prev,
              { user: false, text: "Oops! Something went wrong. Please try again." },
            ]);
            break;
          }
        }
      }
  
      if (!success) {
        setmessages((prev) => [
          ...prev,
          { user: false, text: "Failed after multiple attempts. Try again later." },
        ]);
      }
  
      setLoading(false);
    }
  };
 return (
  <div className="flex items-center justify-center h-screen bg-yellow-600">
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold text-black">AI ChatBot</h1>

      </div>
      <div className="p-4 space-y-4 h-96 overflow-y-auto">
        {messages.map((msg, index)=> (
          <div key={index} 
          className={`flex ${msg.user ? "justify-end":"justify-start"}`}
            >
            <div className={`px-4 py-2 rounded-lg ${msg.user ? "bg-blue-500 text-white":
            "bg-gray-200 text-gray-800"}`}
            >
              {msg.text}
             </div>
             </div>
          ))}
         {loading && (<div className="text-center text-gray-500">Typing</div>)}
          
      </div>
      <div className="p-4 border-t">
        <div className="flex-space-x-2">
          <input type="text"
          value={input}
          onChange={(e) =>
           setInput(e.target.value)} className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300" placeholder="type your message here"
           />
          <button
            onClick={sendMessage} className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" disabled={loading}
            >
              {loading ? "Sending...": "Send"}
            </button>
            
          </div>
      </div>
    </div>
  </div>
 )

 
}
export default App;
