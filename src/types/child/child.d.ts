
export interface ChildFilterParams {
    id: number;
}

export interface ChildFormResult {
	data: {
		id: number;
		name: string;
		birthDate: number;
		gender: 'male' | 'female';
		region: string;
		hobbies: string[];
		remark: string;
	},
	code: number;
	message: string;
}