const WATCH_FILTER_REGEX = /^(?!.*(?:___|(?:~|\.tmp|\/\.ds_store)$))/i;

const WATCH_EVENT_TYPE = {
    update: 'update',
    remove: 'remove'
};

module.exports = {
    WATCH_FILTER_REGEX,
    WATCH_EVENT_TYPE
};
