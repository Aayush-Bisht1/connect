import React, { useEffect, useRef, useState } from 'react'
import { useMessageStore } from '../store/useMessageStore';
import EmojiPicker from "emoji-picker-react";
import { Send, Smile } from 'lucide-react';

const MessageInput = ({match}) => {
    const [messages,setMessages] = useState('');
    const [showemojipicker,setShowEmojiPicker] = useState(false);
    const emojipickerRef = useRef(null);
    const {sendMessage,sendingMessage} = useMessageStore();
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messages.trim() || sendingMessage) return;

        try {
            await sendMessage(match._id, messages.trim());
            setMessages('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }
    useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojipickerRef.current && !emojipickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
  return (
    <form onSubmit={handleSendMessage} className='flex relative'>
			<button
				type='button'
				onClick={() => setShowEmojiPicker(!showemojipicker)}
				className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 focus:outline-none'
			>
				<Smile size={24} />
			</button>

			<input
				type='text'
				value={messages}
				onChange={(e) => setMessages(e.target.value)}
				className='flex-grow p-3 pl-12 rounded-l-lg border-2 border-pink-500 
        focus:outline-none focus:ring-2 focus:ring-pink-300'
				placeholder='Type a message...'
			/>

			<button
				type='submit'
				className='bg-pink-500 text-white p-3 rounded-r-lg 
        hover:bg-pink-600 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300'
			>
				<Send size={24} />
			</button>
			{showemojipicker && (
				<div ref={emojipickerRef} className='absolute bottom-20 left-4'>
					<EmojiPicker
						onEmojiClick={(emojiObject) => {
							setMessages((prevMessage) => prevMessage + emojiObject.emoji);
						}}
					/>
				</div>
			)}
		</form> 
  )
}

export default MessageInput