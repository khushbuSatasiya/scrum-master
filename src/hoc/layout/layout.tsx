import { PropsWithChildren } from 'react';

const Layout: React.FC<PropsWithChildren> = (props) => {
	return (
		<div id='wrapper'>
			{/* <SideNav /> */}
			<div id='page-wrapper' className='width--full overflow--scroll-y overflow--hidden-x'>
				{props.children}
			</div>
		</div>
	);
};

export default Layout;
