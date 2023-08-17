import { FC } from 'react';

import isEmpty from 'lodash/isEmpty';

import { EmailIcon, ProfileIcon } from 'shared/components/icons/icons';
import Spinner from 'shared/components/spinner/spinner';

interface IProps {
	userDetail: any;
	isLoading: boolean;
}

const UserDetail: FC<IProps> = ({ userDetail, isLoading }) => {
	return (
		<>
			<div className='user-details check-in__form mt--50'>
				{isLoading && (
					<div style={{ height: '150px', display: 'flex', justifyContent: 'center' }}>
						<Spinner />
					</div>
				)}

				{!isLoading && isEmpty(userDetail) && (
					<div
						className='display-flex-center min-height--380px'
						style={{ height: '150px', display: 'flex', justifyContent: 'center' }}
					>
						<p className='font--medium font-size--25 line-height--30px'>No Data Found</p>
					</div>
				)}

				{!isLoading && !isEmpty(userDetail) && (
					<div className='flex' style={{ height: '150px' }}>
						<div className='user-img'>
							<img src={userDetail.avtar} alt='avtar' className='image border-radius--md' />
						</div>
						<div className='ml--15'>
							<h2 className='font-size--lg mb--10 font--semi-bold'>{userDetail.realName}</h2>
							<div className='flex'>
								<div className='flex mr--10'>
									<ProfileIcon />
									<p>{userDetail.bio}</p>
								</div>

								<div className='flex mr--10'>
									<EmailIcon />
									<p>{userDetail.email}</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default UserDetail;
