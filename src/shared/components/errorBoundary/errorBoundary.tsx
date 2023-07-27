import React from 'react';

interface IProps {
	children?: any;
}
class ErrorBoundary extends React.Component<IProps> {
	static getDerivedStateFromError(error: Error | null) {
		return { error };
	}

	state = {
		error: null
	};

	componentDidMount() {
		//window.onerror = this.logError;
	}

	componentDidCatch(error: Error | null) {
		this.logError(error);
	}

	render() {
		if (this.state.error) {
			return 'Application has errors. Please check logs to fix this';
		}
		return this.props.children;
	}

	logError(args: Error | null) {
		console.log(args);
	}
}

export default ErrorBoundary;
