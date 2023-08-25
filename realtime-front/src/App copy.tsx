import { useEffect, useState } from "react";
import "./App.css";

import { socket } from "./utils/socket";

function App() {

  const [room, setRoom] = useState<string>('');
  const [roomFlag, setRoomFlag] = useState<boolean>(false);

  const [roomMessage, setRoomMessage] = useState<string>('');
  const [roomMessageList, setRoomMessageList] = useState<string[]>([]);

  const [message, setMessage] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [messageList, setMessageList] = useState<any[]>([]);

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const onJoinButtonHandler = () => {
    socket.emit('join', room);
    setRoomFlag(true);
  }

  const onRoomEmitButtonHandler = () => {
    socket.emit('sendRoom', {room, message:roomMessage});
  }

  const onEmitButtonHandler = () => {
    socket.emit("send", {nickname, message});
  };

  // 복사한 메시지리스트에 받은 메시지를 추가해서 setRoomMessageList를 셋팅해줌
  const onRoomReceive = (message: string) => {
    const newRoomMessageList = roomMessageList.map(message => message);
    newRoomMessageList.push(message);
    setRoomMessageList(newRoomMessageList);
  }
  const onReceive = (data:any) => {
    const newMessageList = messageList.map(message => message);
    newMessageList.push(data);
    setMessageList(newMessageList);
  }

  socket.on('roomReceive', onRoomReceive);
  socket.on('receive', onReceive);

  let effectFlag = false;

  useEffect(() => {
    if (effectFlag) return;
    effectFlag = true;

    const onConnected = () => {
      console.log(socket.id);
      setIsConnected(true);
    };

    const onDisConnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnected);
    socket.on('disconnect', onDisConnect);
  }, []);

  return (
    <div>
      { roomFlag ? (
        <div>
          <h2> { room } </h2>
          <input onChange={(event) => setRoomMessage(event.target.value)} />
          <button onClick={onRoomEmitButtonHandler}> 전송 </button>
          <div>
            { roomMessageList.map(message => <div style={ {color: 'rgba(0, 0, 255, 0.7)'} }> { message } </div>) }
          </div>
        </div>
      ) : (
        <div>
          <input onChange={(event) => setRoom(event.target.value)} />
          <button onClick={onJoinButtonHandler} >조인</button>
        </div>
      ) }
      
      <input onChange={(event) => setNickname(event.target.value)}/>
      <input onChange={(event) => setMessage(event.target.value)} />
      <button onClick={onEmitButtonHandler}> 전송 </button>
      <div>
        {messageList.map(message => <div> {message.nickname} {message.message} </div>)}
      </div>
    </div>
  );
}

export default App;
