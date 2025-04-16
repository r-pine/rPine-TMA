import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
	width?: string | number;
	height?: string | number;
	className?: string;
	variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
	width = '100%',
	height = '1em',
	className = '',
	variant = 'rect'
}) => {
	const style = {
		width: typeof width === 'number' ? `${width}px` : width,
		height: typeof height === 'number' ? `${height}px` : height,
	};

	return (
		<div
			className={`${styles.skeleton} ${styles[variant]} ${className}`}
			style={style}
		/>
	);
}; 