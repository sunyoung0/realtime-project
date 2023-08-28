import "./App.css";
import { usePathStore } from "./stores";
import Enter from "./views/Enter";
import Main from "./views/Main";
import Room from "./views/Room";

//              component : Root 컴포넌트           //
function App() {

  //          state : Path 전역 상태            //
  const { path } = usePathStore();

  //          render : Root 컴포넌트 렌더링           //
  return (
    <div>
      {
        path === '/' ? (<Main />) :
        path === '/enter' ? (<Enter />) :
        path === '/room' ? (<Room />) :
        (<></>)
      }
    </div>
  );
}

export default App;
