import { resolveReferenceFromIdentifier } from './mergeFieldLib';
import { recursiveSwap, getSwapValueFunction } from 'builder_platform_interaction/translatorLib';

/**
 * Resolve all references present in given object (generally a ElementUi in UI model format)
 *
 * @param {Object} object in UI model format (non hydrated). References are uids like 'a4451815-988d-4f17-883d-64b6ad9fab7e.Account.User.Name'
 * @returns {Promise} the promise is resolved once all references have been resolved (description retrieved from server if necessary)
 */
export function loadReferencesIn(object) {
    const promises: Promise<unknown>[] = [];
    let firstError;
    const loadReferenceFromUid = (uid) => {
        promises.push(
            resolveReferenceFromIdentifier(uid).catch((error) => {
                firstError = error;
            })
        );
        return uid;
    };
    recursiveSwap(object, getSwapValueFunction(loadReferenceFromUid, true));
    return Promise.all(promises).then((result) => {
        if (firstError) {
            throw firstError;
        } else {
            return result;
        }
    });
}
