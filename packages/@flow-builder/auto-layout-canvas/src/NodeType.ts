/**
 * Enum for the different type of auto-layout-canvas nodes
 */
enum NodeType {
    ROOT = 'root',
    START = 'start',
    END = 'end',
    LOOP = 'loop',
    BRANCH = 'branch',
    // TODO: remove and use default instead
    ORCHESTRATED_STAGE = 'orchestratedstage',
    DEFAULT = 'default'
}

export default NodeType;
