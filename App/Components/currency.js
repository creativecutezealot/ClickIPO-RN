/**
 * Get number with commas
 *
 * @param {number} num
  @param decimals
  @returns {string}
 */
export const getNumberWithCommas = (num: number, decimals?: number): string => {
    console.log(num.toFixed(decimals));
	return num.toFixed(decimals);//.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}