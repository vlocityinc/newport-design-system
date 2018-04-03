/**
 * Helper function that takes in a string  and capitalize the FIRST letter
 * @param {String} string will be convert to an capitalized FIRST Letter of the string
 * @returns {String} the capitalized First letter of the string
 */
export const capitalizeFirstLetter = (string) => {
    if ((string)  && (typeof string === 'string')) {
        return string.replace(/\w\S*/g, (str) => {
            return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        });
    }
    return null;
};
