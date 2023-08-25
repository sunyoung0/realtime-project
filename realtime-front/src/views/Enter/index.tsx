import React from 'react'
import './style.css';

export default function Enter() {
	return (
		<div id='enter-wrapper'>
			<div className='enter-back-button'> 뒤로가기 </div>
			<div className='enter-input-box'>
				<input className='enter-input' type='text' placeholder='방 번호를 입력하세요.' />
				<div className='enter-button'> 들어가기 </div>
			</div>
		</div>
	)
}