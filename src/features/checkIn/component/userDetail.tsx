import { FC } from 'react';

import isEmpty from 'lodash/isEmpty';

import { ProfileIcon } from 'shared/components/icons/icons';
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
						<p className='text--white font--medium font-size--25 line-height--30px'>No Data Found</p>
					</div>
				)}

				{!isLoading && !isEmpty(userDetail) && (
					<div className='flex' style={{ height: '150px' }}>
						<div className='user-img'>
							<img src={userDetail.avtar} alt='avtar' className='image' />
						</div>
						<div>
							<h2>{userDetail.realName}</h2>
							<div>
								<div className='flex'>
									<ProfileIcon />
									<p>{userDetail.bio}</p>
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
