export const goldObjectMatchers = {
    toEqualGoldObject(received, expected, toBeUpdated) {
        // we ignore undefined values. We do that because stringifiedReceived uses JSON.stringify ...
        if (this.equals(JSON.stringify(received), JSON.stringify(expected))) {
            return {
                pass: true,
                message: () => ''
            };
        }
        const diffString = this.utils.printDiffOrStringify(
            expected,
            received,
            'Expected',
            'Received',
            this.expand
        );
        const receivedColor = this.utils.RECEIVED_COLOR;
        const stringifiedReceived = receivedColor(
            JSON.stringify(received, null, 2)
        );
        return {
            pass: false,
            message: () =>
                `Received object does not match gold object.\n
Difference:\n${diffString}\n 
You need to update ${toBeUpdated} with : \n${stringifiedReceived}`
        };
    }
};
