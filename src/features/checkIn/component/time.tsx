import { FC, useEffect, useState } from 'react';
import TimePicker from 'react-time-picker';
import { getCurrentTimeString } from 'shared/util/utility';

interface IProps {
	values: any;
	name: string;
	onChange: (time: any) => void;
	format?: string;
	clockIcon?: any;
}

const Time: FC<IProps> = ({ values, onChange, name, format = 'HH:mm' }) => {
	const [maxTime, setMaxTime] = useState('23:59');

	const updateMaxTime = () => {
		setMaxTime(getCurrentTimeString());
	};

	useEffect(() => {
		updateMaxTime();
		const intervalId = setInterval(updateMaxTime, 10000);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<TimePicker
			value={values.time}
			maxTime={maxTime}
			className='time-input font--regular border-radius--sm text--black'
			name={name}
			onChange={onChange}
			format={format}
			clockIcon={null}
			autoFocus
		/>
	);
};

export default Time;
