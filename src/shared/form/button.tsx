import React, { MouseEventHandler, CSSProperties, PropsWithChildren } from 'react';

interface IButtonProps extends PropsWithChildren {
	btnType?: 'default' | 'primary' | 'warning' | 'danger' | 'info';
	loading?: boolean;
	disabled?: boolean;
	type?: 'submit' | 'button' | 'reset';
	className?: string;
	onClick?: MouseEventHandler<any>;
	abbr?: string;
	title?: string;
	style?: CSSProperties;
	dataTestId?: string;
}
const Button: React.FC<IButtonProps> = (props) => {
	const onClick: MouseEventHandler<any> = (e) => !props.loading && props.onClick && props.onClick(e);
	const button = (
		<button
			data-testid={props.dataTestId || null}
			title={props.abbr || ''}
			type={props.type || 'button'}
			className={props.className}
			disabled={props.loading || props.disabled}
			style={props.style || {}}
			onClick={!props.disabled && !props.loading ? onClick : () => undefined}
		>
			{props.loading && <i className='bx bxs-spin bx-spinner' />}
		</button>
	);
	return props.abbr ? (
		<abbr title={props.abbr || ''} className='custom-abbr'>
			{button}
		</abbr>
	) : (
		button
	);
};

export default Button;
