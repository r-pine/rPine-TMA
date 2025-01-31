import React, { useEffect, useState } from 'react';

const AvailableNFT: React.FC = () => {
	const [nextItemIndex, setNextItemIndex] = useState<string>('0/300');
	const API_URL = 'https://tonapi.io/v2/nfts/collections/0:0f93122c0c5cf6b26d6642fe8d215821643ec762603f95def02ada2fb6730d67';

	useEffect(() => {
		let isMounted = true;

		const fetchAvailableNFT = async () => {
			try {
				const response = await fetch(API_URL);
				if (!response.ok) throw new Error('Network response was not ok');

				const data: { next_item_index: number } = await response.json();
				if (isMounted && typeof data.next_item_index === 'number') {
					setNextItemIndex(`${300 - data.next_item_index}/300`);
				}
			} catch (error) {
				if (isMounted) setNextItemIndex('0/300');
				console.error('Fetch error:', error);
			}
		};

		fetchAvailableNFT();

		return () => {
			isMounted = false;
		};
	}, [API_URL]);

	return <div>{nextItemIndex}</div>;
};

export default AvailableNFT;
