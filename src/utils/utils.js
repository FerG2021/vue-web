import moment from 'moment';

export const formatNumberToMount = (mount, min = 2, max = 2) => {
	return new Intl.NumberFormat("es-AR", {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: min,
		maximumFractionDigits: max
	}).format(mount);
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
	return moment(date).format(format);
};

export const formatNumberToDecimal = (number, min = 2, max = 2) => {
	return new Intl.NumberFormat('es-AR', {
		minimumFractionDigits: min,
		maximumFractionDigits: max
	}).format(number);
};