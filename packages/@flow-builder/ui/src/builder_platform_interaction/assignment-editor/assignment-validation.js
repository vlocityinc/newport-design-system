class AssignmentValidation {
    /**
     * @param {string} propName - propertyName
     * @param {string} newValue - new Value for the property
     * @returns {string} string or null after running the rules for the property updated
     */
    validateProperty = (propName, newValue) => {
        if (propName === "name") {
            // Get rules from from a lib may be ?
            // TODO: Run a rule to check if devName is unique, if not return with an error Message
            if (newValue === "") {
            //     return "Cant be empty";
            }
        }
        return null;
    }
    // validate All properties function which runs all assignment editor validations
}

export const assignmentValidation = new AssignmentValidation();