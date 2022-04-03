import { AnySchema } from 'yup';

const validateSchema = async (schema: AnySchema, payload: any) => {
	const result = await schema.validate(payload);
	return result;
};

export default validateSchema;
