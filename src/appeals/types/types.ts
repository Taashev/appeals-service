export type DateFilter = string;

export type RangeDateFilter = {
	dateFrom: string;
	dateTo: string;
};

export type QueryParamsDateFilter = {
	date: DateFilter;
	range: RangeDateFilter | null;
};
