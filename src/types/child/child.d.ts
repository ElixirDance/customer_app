
export interface ChildFilterParams {
    id: string;
}

export interface ChildFormResult {
	data: {
		id: string;
		name: string;
		birthDate: number;
		gender: 'male' | 'female';
		region: string;
		hobbies: string[];
		remark: string;
	}[],
	code: number;
	message: string;
}

export interface AddOrUpdateChildParams {
	id: string;
	name: string;
	birthDate: number;
	gender: 'male' | 'female';
	region: string;
	hobbies: string[];
	remark: string;
}