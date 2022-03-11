/**
 * Updates state of legal notices passed to Legal Popover component if its dismissed
 *
 * @param legalNotices - Notices handled by the calling component with their state
 * @param noticesToLegalPopover - Notices being passed to legal popover by the calling parent component
 * @returns - legal notices with updated state
 */
export function updateLegalNoticesStateAfterDismiss(
    legalNotices: UI.LegalNotice[],
    noticesToLegalPopover: UI.LegalNotice[]
): UI.LegalNotice[] {
    for (let i = 0; i < legalNotices.length; i++) {
        const header = legalNotices[i].header;
        if (noticesToLegalPopover.some((n) => n.header === header)) {
            legalNotices[i].shown = false;
            legalNotices[i].dismissed = true;
        }
    }
    return legalNotices;
}
