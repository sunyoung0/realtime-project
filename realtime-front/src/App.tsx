import { useEffect, useState } from "react";
import "./App.css";

import { socket } from "./utils/socket";

function App() {
  const [message, setMessage] = useState<string>("");

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

  const onEmitButtonHandler = () => {
    socket.emit("send", message);
  };

  let flag = true;

  useEffect(() => {
    if (flag) {
      flag = false;
      return;
    }
    const onConnected = () => {
      console.log(socket.id);
      setIsConnected(true);
    };

    const onDisConnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnected);
    socket.on("receive", (message) => console.log(message));
  }, []);

  return (
    <div>
      <input onChange={(event) => setMessage(event.target.value)} />
      <button onClick={onEmitButtonHandler}> 전송 </button>
    </div>
  );
}

export default App;
