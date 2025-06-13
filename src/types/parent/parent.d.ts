
export interface ParentFilterParams {
    id: string;
}

export interface Parent {
	id: string;
	name: string;
	phone: string;
	birthDate: number;
	gender: 'male' | 'female';
	region: string;
	remark: string;
}

export interface ParentFormResult {
	data: Parent[];
	code: number;
	message: string;
}
