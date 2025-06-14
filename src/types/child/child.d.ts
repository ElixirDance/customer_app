
export interface ChildFilterParams {
    id: string;
}

export interface Child {
	id: string;
	name: string;
	birthDate: number;
	gender: 'male' | 'female';
	region: string;
	hobbies: string[];
	remark: string;
}

export interface ChildsFormResult {
	data: Child[],
	code: number;
	message: string;
}

export interface ChildFormResult {
	data: Child,
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