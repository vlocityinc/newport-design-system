export default 'A transaction is a set of operations that are executed as a single unit. If an error occurs with one operation, the entire transaction is rolled back. A callout can be an HTTP request, a SOAP API call, or any web services call. Pending operations come from elements executed earlier in the flow that send email or access Salesforce records. Within one transaction, callouts can be made only before performing these types of operations.';