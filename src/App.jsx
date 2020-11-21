import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
	const [ready, setReady] = useState(false);
	const [video, setVideo] = useState();
	const [gif, setGif] = useState();

  	const load = async () => {
    	await ffmpeg.load();
    	setReady(true);
	}
	  
	useEffect(() => {
		load();
	}, []);

	const convertToGif = async () => {
		// Write file to memory
		ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));

		// Rnu ffmpeg command
		await ffmpeg.run('-i', 'test.mp4', '-t', '60', '-ss', '0', '-f', 'gif', '-vf', 'fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', '-loop', '0', 'output.gif');

		// Read result
		const data = ffmpeg.FS('readFile', 'output.gif');

		// Create a URL
		const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif'}));

		setGif(url);
	}

	return ready ? (
		<div className="App">
			{ video && <video controls width="250" src={URL.createObjectURL(video)}></video> }
			<br/>
			<input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
			<h3>Result</h3>
			<button onClick={convertToGif}>Convert</button>
			{ gif && <img src={gif} width="250" /> }
		</div>
	) : (<p>Loading...</p>);
}

export default App;
