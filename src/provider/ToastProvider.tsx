"use client";

import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastProvider = () => {
	return (
		<ToastContainer
			position="top-right"
			autoClose={4000}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme="light"
			toastStyle={{
				borderRadius: '8px',
				fontSize: '14px',
			}}
			toastClassName={(context) => {
				const type = context?.type || 'default';
				let borderColor = '';
				
				switch(type) {
					case 'success':
						borderColor = '#5CC184';
						break;
					case 'error':
						borderColor = '#E66666';
						break;
					case 'warning':
						borderColor = '#F0934E';
						break;
					case 'info':
						borderColor = '#45C5CD';
						break;
					default:
						borderColor = '#604AE3';
				}
				
				return `relative border-l-4 shadow-lg ${type === 'success' ? 'border-l-mainSuccessV1' : 
						type === 'error' ? 'border-l-mainDangerV1' : 
						type === 'warning' ? 'border-l-mainWarningV1' : 
						type === 'info' ? 'border-l-mainInfoV1' : 'border-l-mainTextHoverV1'}`;
			}}
		/>
	);
};
