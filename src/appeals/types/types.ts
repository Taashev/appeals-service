export type QueryDateFilter = string;

export type QueryDateRangeFilter = {
	dateFrom: string;
	dateTo: string;
};

export type DateFilter = {
	date: QueryDateFilter;
	range: QueryDateRangeFilter | null;
};
