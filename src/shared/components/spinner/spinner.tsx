import React from 'react';
import './spinner.scss';

//Spinner - render spinner

const Spinner: React.FC = () => (
	<div className='spinner-wrapper text--center width--full box-size--border-box'>
		<div className='loader position--relative height--full m--0-auto'>
			<svg className='circular' viewBox='25 25 50 50'>
				<circle className='path' cx='50' cy='50' r='20' fill='none' strokeWidth='2' strokeMiterlimit='10' />
			</svg>
		</div>
	</div>
);

export default Spinner;
