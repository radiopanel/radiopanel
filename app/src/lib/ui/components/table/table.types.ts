export interface TableColumn {
	id: string;
	label?: string;
	value?: string;
	format?: (value: any, key: string, item: any, index: number) => any;
	sticky?: boolean;
	disableSorting?: boolean;
	sort?: string;
	width?: string;
	component?: any;
	extraComponentProps?: Record<string, any>;
}
