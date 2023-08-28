import moment from 'moment';
import { ChangeEvent, useEffect, useState, useRef, KeyboardEvent } from 'react';
import { usePathStore, useRoomStore, useUserStore } from '../../stores';
import { MessageDto } from '../../types';
import { socket } from '../../utils/socket';
import './style.css';

//					component : 채팅방 컴포넌트					//
export default function Room() {

	//										 		state												//
	//					description : Send Button Ref 상태					//
	const sendButtonRef = useRef<HTMLDivElement | null>(null);

	//					description : Room Container Ref 상태					//
	const roomContainerRef = useRef<HTMLDivElement | null>(null);

	//					description : path 상태 변경 함수					//
	const { setPath } = usePathStore();

	//					description : room 상태 및 변경 함수					//
	const { room, setRoom } = useRoomStore();

	//					description : 사용자 정보 상태					//
	const { id, nickname } = useUserStore();

	//					description : 소켓 연결 상태					//
	const [isSocketConnect, setSocketConnected] = useState<boolean>(socket.connected);

	//					description : 메세지 상태 					//
	const [message, setMessage] = useState<string>('');

	//					description : 메세지 리스트 상태 					//
	const [messageList, setMessageList] = useState<MessageDto[]>([]);

	//											event handler											//
	//					description : 메세지 값 변경 처리					//
	const onMessageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		const message = event.target.value;
		setMessage(message);
	}

	//					description : Enter Key 누름 처리					//
	const onEnterKeyDoewnHandler = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== 'Enter') return;
		if (!sendButtonRef.current) return;
		sendButtonRef.current.click();
	}

	//					description : 뒤로가기 버튼 클릭 처리					//
	const onBackButtonClickHandler = () => {
		setPath('/enter');
	}

	//					description : 전송 버튼 클릭 처리					//
	const onSendButtonClickHandler = () => {
		if (!message.trim()) return;

		const datetime = moment().format('YYYY-MM-DD hh:mm:ss a');
		const data: MessageDto = { id, room, nickname, message, datetime };
		socket.emit('send', data);
		setMessage('');
	}


	//					description : Socket Receive 이벤트 처리					//
	const onRecieveHandler = (messageObject: MessageDto) => {
		const newMessageList = [...messageList];
		newMessageList.push(messageObject);
		setMessageList(newMessageList);

	}
	socket.on('receive', onRecieveHandler);

	
	//					component : 채팅 메세지 아이템 컴포넌트					//
	interface ChatMessageItemProps {
		messageItem: MessageDto;
	}

	const ChatMessageItem = ({ messageItem } : ChatMessageItemProps) => {
		const { nickname, message, datetime } = messageItem;

		if (id === messageItem.id)
		return(
		<div className='message-box-mine'>
			<div className='message-mine'>{message}</div>
			<div className='message-datetime'>{datetime}</div>
		</div>
		);

		return(
		<div className='message-box-others'>
			<div className='message-box-wrapper'>
				<div className='message-nickname'> {nickname}</div>
				<div className='message-container-others'>
					<div className='message-other'>{message}</div>
					<div className='message-datetime'>{datetime}</div>
				</div>
			</div>
		</div>
		);

	}

	//					effect : 첫 마운트 시 소켓 연결					//
	let effectFlage = true;			// /effect가 한번만 돌 수 있도록 해주기 위해

	useEffect(() => {
		if (!effectFlage) return;
		effectFlage = false;

		const onConnect = () => {
			console.log(socket.id);
			setSocketConnected(true);
		}

		const onDisConnect = () => {
			setSocketConnected(false);
		}

		// connect 이벤트가 실행 되면 onConnect 실행
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisConnect);

		socket.emit('join', room);

	}, []);

	useEffect(() => {
		if(!roomContainerRef.current) return;
		if(!roomContainerRef.current.scrollHeight) return;
		roomContainerRef.current.scrollTop = roomContainerRef.current.scrollHeight;
	},[messageList]);

	//					render : 채팅방 컴포넌트 렌더링					//
	return (
		<div id='room'>
			<div className='room-header'>
				<div className='room-number'>{room}</div>
				<div className='room-back-button' onClick={onBackButtonClickHandler}> 뒤로가기 </div>
			</div>
			<div ref={roomContainerRef} className='room-container'>
				{messageList.map(messageItem => <ChatMessageItem messageItem={messageItem} />)}
			</div>
			<div className='room-footer'>
				<input className='room-send-input' type='text' value={message} onChange={onMessageChangeHandler} onKeyDown={onEnterKeyDoewnHandler} />
				<div ref={sendButtonRef} className='room-send-button' onClick={onSendButtonClickHandler}> 전송 </div>
			</div>
		</div>
	)
}
