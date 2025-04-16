import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const ModalOutlet: React.FC = () => {
	const location = useLocation();
	if (location.pathname === '/') {
		return <Outlet />;
	}
	return (
		<div className="modal-container">
			<Outlet />
		</div>
	);
}; 