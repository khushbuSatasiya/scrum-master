import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import ErrorHandler from 'hoc/withErrorHandler/errorHandler';
import ErrorBoundary from 'shared/components/errorBoundary/errorBoundary';

import App from './app';
import store from './store';

import 'assets/styles/app.scss';

const Root: React.FC = (props) => {
	return (
		<Provider store={store}>
			<ErrorHandler />
			<ErrorBoundary>
				<BrowserRouter>
					<App {...props} />
				</BrowserRouter>
			</ErrorBoundary>
		</Provider>
	);
};

export default Root;
