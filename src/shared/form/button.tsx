import React, { MouseEventHandler, CSSProperties, PropsWithChildren } from 'react';
import classnames from 'classnames';
import loading from 'assets/images/loding.gif';

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
	defaultClass?: boolean;
}
const Button: React.FC<IButtonProps> = (props) => {
	const onClick: MouseEventHandler<any> = (e) => !props.loading && props.onClick && props.onClick(e);
	const button = (
		<button
			data-testid={props.dataTestId || null}
			title={props.abbr || ''}
			type={props.type || 'button'}
			className={classnames(
				`${props.defaultClass && `btn btn-${props.btnType || 'default'}`}`,
				'ignore-text-capitalize',
				props.className
			)}
			disabled={props.loading || props.disabled}
			style={props.style || {}}
			onClick={!props.disabled && !props.loading ? onClick : () => undefined}
		>
			{props.loading ? <img className='loading-img' src={loading} /> : props.children}
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
