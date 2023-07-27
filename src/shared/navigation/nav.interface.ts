import { FC } from 'react';
import { IIconProps } from 'shared/components/icons/icons';

export interface ISideNavOpt {
	SvgIcon: FC<IIconProps>;
	urlLink: string;
	title: string;
	subMenu?: ISubMenuType[] | [];
}

export interface ISubMenuType {
	title: string;
	urlLink: string;
}
