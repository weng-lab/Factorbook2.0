import { useState } from "react";
import { BackendMessage, BackendResponse, Conversation } from "./types";
import { exampleResponse } from "./exampleResponse";
import { defaultPrompt1 } from "./helpers";

export function useFactorChat() {
  const [messages, setMessages] = useState<Conversation>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [apiVersion, setApiVersion] = useState<1 | 2>(1)
  const [systemPrompt, setSystemPrompt] = useState<string>(defaultPrompt1)

  // handles text box state
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()

    // append user message to end of array
    const newMessages: Conversation = [...messages, { role: 'user', contents: input }]
    setMessages(newMessages)

    // clear text box
    setInput('')

    //try getting response. If successful push new message, if not display error
    try {
      setLoading(true)

      // const endpoint = 'http://127.0.0.1:8000/api/chat'
      // const endpoint = 'https://factorchat.staging.wenglab.org/api/chat'
      const endpoint =
        apiVersion === 1 ? 'https://factorchat.staging.wenglab.org/api/chat_tools'
          : 'https://factorchat.staging.wenglab.org/chat_interpreter'

      const prompt = {role: "system", contents: systemPrompt }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([prompt, ...newMessages])
      })

      if (!res.ok) {
        throw new Error(`HTTP error status: ${res.status}`);
      }

      const backendResponse: BackendResponse = await res.json()

      setMessages([...newMessages, ...backendResponse])

      // setMessages([...newMessages, ...exampleResponse])

    } catch (error) {
      console.error('Error:\n', error)
      const errorMsg: BackendMessage = {
        text: "Something went wrong",
        figures: [],
        files: [],
        error: error instanceof Error ? error.message : 'Unexpected error',
      }
      setMessages([...newMessages, { role: "assistant", contents: errorMsg }])
    }
    
    setLoading(false)
  }

  const handleClearMessages = () => {
    setMessages([])
  }

  //this is giving security warnings
  const handleDownloadMessages = () => {
    const element = document.createElement("a");
    const jsonData = JSON.stringify({ messages }, null, 2);
    const file = new Blob([jsonData], { type: 'application/json;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    element.download = `messages_${timestamp}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    setMessages,
    apiVersion,
    setApiVersion,
    systemPrompt,
    setSystemPrompt,
    handleClearMessages,
    handleDownloadMessages,
    loading
  }
}
