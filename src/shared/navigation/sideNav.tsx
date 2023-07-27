import { Fragment, useState } from 'react';

import { NavLink, useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import { Logo, MenuDropDownClose, MenuDropDownOpen, SideNavIcon, SideNavLogo } from 'shared/components/icons/icons';
import { SIDE_NAV_OPTIONS } from 'shared/constants/constants';

import { ISideNavOpt, ISubMenuType } from './nav.interface';

import './nav.scss';

const SideNav = () => {
	const [sidebarOpen, setSideBarOpen] = useState(false);
	const [isSubMenu, setIsSubMenu] = useState(false);
	const location = useLocation();
	const activeMenu = location.pathname.split('/')[1];

	return (
		<nav className='navbar-wrapper' role='navigation'>
			<div
				className={`navbar-side bg--white flex flex--column height--full position--relative ${
					sidebarOpen ? 'collapsed' : ''
				}`}
			>
				<NavLink className='ml--10' to='/dashboard'>
					{!sidebarOpen && <SideNavLogo height='100' />}
					{sidebarOpen && <Logo width='130' height='100' />}
				</NavLink>
				<button
					className='navbar-side__button flex justify-content--center align-items--center position--absolute border-radius--lg p--10'
					onClick={() => setSideBarOpen(!sidebarOpen)}
				>
					<SideNavIcon
						width='25px'
						height='25px'
						className={`cursor--pointer ${!sidebarOpen ? 'navbar-side__button--icon' : ''}`}
					/>
				</button>
				<div className='cursor--pointer flex flex--column icons mt--20'>
					{SIDE_NAV_OPTIONS.map(({ SvgIcon, urlLink, title, subMenu }: ISideNavOpt, index: number) => {
						return (
							<Fragment key={index}>
								{isEmpty(subMenu) && (
									<NavLink
										to={urlLink}
										className={`navbar-side__link ${
											activeMenu === urlLink ? 'navbar__active--menu' : ''
										}`}
									>
										<div
											className='navbar-side__link--content flex width--full align-items--center bg--twilight-blue'
											onClick={() => setIsSubMenu(!isEmpty(subMenu) && !isSubMenu)}
										>
											<SvgIcon className='navbar-side__link--icon' />
											<p className='navbar-side__link--label font-size--lg hide no-margin'>
												{title}
											</p>
										</div>
									</NavLink>
								)}
								{!isEmpty(subMenu) && (
									<div
										className={`navbar-side__link ${
											activeMenu === urlLink ? 'navbar__active--menu' : ''
										}`}
									>
										<div
											className='navbar-side__link--content flex width--full align-items--center bg--twilight-blue'
											onClick={() => setIsSubMenu(!isEmpty(subMenu) && !isSubMenu)}
										>
											<SvgIcon className='navbar-side__link--icon' />
											<p className='navbar-side__link--label font-size--lg hide no--margin'>
												{title}
												{!isEmpty(subMenu) && (
													<span className='position--absolute navbar-side__submenu--icon'>
														{isSubMenu && (
															<MenuDropDownClose className='pl--15 width--16px ' />
														)}
														{!isSubMenu && (
															<MenuDropDownOpen className='pl--15 width--16px ' />
														)}
													</span>
												)}
											</p>
										</div>
									</div>
								)}

								{isSubMenu &&
									subMenu &&
									subMenu.map((subMenu: ISubMenuType) => {
										const { title, urlLink } = subMenu;
										return (
											<NavLink
												to={urlLink}
												className={`navbar-side__link no--padding ${
													activeMenu === urlLink ? 'navbar__active--menu' : ''
												}`}
											>
												<div className='navbar-side__submenu--content flex width--full ml--60 bg--twilight-blue p--10'>
													<p className='navbar-side__link--label font-size--default hide no--margin'>
														{title}
													</p>
												</div>
											</NavLink>
										);
									})}
							</Fragment>
						);
					})}
				</div>
			</div>
		</nav>
	);
};

export default SideNav;
