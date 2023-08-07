import React, { PropsWithChildren } from 'react';
import { Button, Modal } from 'react-bootstrap';

export interface IModalProps extends PropsWithChildren {
	show: boolean;
	handleClose: () => void | undefined;
	className?: string;
	modalTitle?: string;
	modalTitle2?: string | JSX.Element;
	modalTitle3?: string | JSX.Element;
	dataTestId?: string;
	footer?: JSX.Element | boolean;
	loading?: boolean;
}

const CustomModal: React.FC<IModalProps> = (props) => {
	return (
		<Modal show={props.show} onHide={props.handleClose} className={`${props.className || ''} fadeIn`}>
			{props.modalTitle ? (
				<Modal.Header closeButton>
					<Modal.Title>
						&nbsp;&nbsp;{props.modalTitle2}
						{props.modalTitle3}
					</Modal.Title>
				</Modal.Header>
			) : (
				<div className='flex justify-content--end'>
					<Button className='close-btn' onClick={props.handleClose}>
						X
					</Button>
				</div>
			)}
			<Modal.Body>{props.children}</Modal.Body>
			{!!props.footer && <Modal.Footer>{props.footer}</Modal.Footer>}
		</Modal>
	);
};

export default CustomModal;
