export const MOCK_BREADCRUMBS = [
    { label: 'vFeedItem', name: 'vFeedItem', id: 'vFeedItem' },
    { label: 'CreatedBy (User) ID', name: 'CreatedBy:User', id: 'vFeedItem.CreatedBy:User' },
    { label: 'Account', name: 'Account', id: 'vFeedItem.CreatedBy:User.Account' },
    { label: 'Last Modified By ID', name: 'LastModifiedBy', id: 'vFeedItem.CreatedBy:User.Account.LastModifiedBy' },
    { label: 'Account', name: 'Account', id: 'vFeedItem.CreatedBy:User.Account.LastModifiedBy.Account' }
];
export const MOCK_NEW_BREADCRUMB = {
    label: 'Account Number',
    name: 'AccountNumber',
    id: 'vFeedItem.CreatedBy:User.Account.LastModifiedBy.Account.AccountNumber'
};
