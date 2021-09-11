export const convertTableSortingToShorthand = ({ key, order }: {
	key: string;
	order: string;
}): string =>
	`${order === 'desc' ? '-' : ''}${key}`;
