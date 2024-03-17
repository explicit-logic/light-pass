// import reactLogo from "./assets/react.svg";
import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';
import './App.css';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main className='container'>
      <p>My Quiz App is here!</p>

      <form
        className='row'
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input id='greet-input' onChange={(e) => setName(e.currentTarget.value)} placeholder='Enter a name...' />
        <button type='submit'>Greet</button>
      </form>

      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
