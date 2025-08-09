import moment from 'moment';

/**
 * Formatea un número a un monto.
 *
 * @param {number} mount - El número a formatear.
 * @param {int} [min=2] min - La cantidad mínima de decimales.
 * @param {int} [max=2] - La cantidad máxima de decimales.
 * @returns {String} - Número formateado.
 */
export const formatNumberToMount = (mount, min = 2, max = 2) => {
	return new Intl.NumberFormat("es-AR", {
		style: 'currency',
		currency: 'ARS',
		minimumFractionDigits: min,
		maximumFractionDigits: max
	}).format(mount);
};

/**
 * Formatea una fecha.
 *
 * @param {'Timestamp' | 'Date'} date - Fecha a formatear.
 * @param {string} [format='DD/MM/YYYY'] - Formato de la fecha.
 * @returns {string} - Fecha formateada.
 */
export const formatDate = (date, format = 'DD/MM/YYYY') => {
	return moment(date).format(format);
};

/**
 * Formatea un número a decimales con coma decimal.
 *
 * @param {number} number - El número a formatear.
 * @param {int} [min=2] min - La cantidad mínima de decimales.
 * @param {int} [max=2] - La cantidad máxima de decimales.
 * @returns {String} - Número formateado.
 */
export const formatNumberToDecimal = (number, min = 2, max = 2) => {
	return new Intl.NumberFormat('es-AR', {
		minimumFractionDigits: min,
		maximumFractionDigits: max
	}).format(number);
};

/**
 * Ordena un array de objetos según un campo específico.
 *
 * @param {Array<Object>} array - El array de objetos a ordenar.
 * @param {string} field - El campo por el que se ordena.
 * @param {'asc' | 'desc'} [direction='asc'] - Dirección del orden.
 * @param {'string' | 'number' | 'date'} [type='string'] - Tipo de dato.
 * @returns {Array<Object>} - Array ordenado.
 */
export function sortByField(array, field, direction = 'asc', type = 'string') {
	return [...array].sort((a, b) => {
		let valA = a[field];
		let valB = b[field];

		switch (type) {
				case 'number':
					valA = Number(valA);
					valB = Number(valB);
					break;
				case 'date':
					valA = new Date(valA);
					valB = new Date(valB);
					break;
				case 'string':
				default:
					valA = valA?.toString().toLowerCase();
					valB = valB?.toString().toLowerCase();
					break;
		}

		if (valA < valB) return direction === 'asc' ? -1 : 1;
		if (valA > valB) return direction === 'asc' ? 1 : -1;

		return 0;
	});
}
