import { PropsWithChildren } from 'react';
import SideNav from 'shared/navigation/sideNav';

const Layout: React.FC<PropsWithChildren> = (props) => {
	return (
		<div id='wrapper'>
			<SideNav />
			<div id='page-wrapper' className='width--full'>
				{props.children}
			</div>
		</div>
	);
};

export default Layout;
