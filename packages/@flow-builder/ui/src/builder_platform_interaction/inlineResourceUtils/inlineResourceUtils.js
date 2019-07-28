/**
 * Find the resource from the menudata and return it
 * @param {*} resourceGuid new inline resource Guid
 * @param {*} menuData menuData of the comobobox
 */
export const getInlineResource = (resourceGuid, menuData = []) => {
    if (!resourceGuid) {
        throw new Error('Resource is not defined');
    }
    let inlineItem;
    for (let i = 0; i < menuData.length; i++) {
        const { items } = menuData[i];
        if (items) {
            inlineItem = items.find(
                currentItem => currentItem.value === resourceGuid
            );
            if (inlineItem) {
                return inlineItem;
            }
        }
    }
    return inlineItem;
};
