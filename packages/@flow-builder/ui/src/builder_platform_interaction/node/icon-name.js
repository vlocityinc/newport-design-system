import { Element } from 'engine';
import {ELEMENT_TYPE} from 'builder_platform_interaction-constant';

/**
 * Map to associate each node type with it's respective icon-name.
 *
 * @ScrumTeam Process UI
 * @author Priya Mittal
 * @since 214
 */

export const nodeIconMap = new Map([
    [ELEMENT_TYPE.ASSIGNMENT, 'standard:lead_list']
]);

export class IconName extends Element {}