import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, EnterCommand, SpaceCommand } from '../../commands';
import { createShortcut, Keys } from '../keyboardInteractions';
import { BaseKeyboardInteraction } from './BaseKeyboardInteraction';

interface GridSelectors {
    grid: string | null;
    row: string;
    column: string;
}

type GridIndex = [number, number];

export const TABLE_SELECTORS = {
    grid: 'table',
    row: 'tr',
    column: 'td'
};

export const ARIA_GRID_SELECTORS = {
    grid: null,
    row: 'row',
    column: 'gridcell'
};

enum TabIndex {
    Active = '0',
    Inactive = '-1'
}

/**
 * Formats a grid index as a string
 *
 * @param gridIndex - A grid index [row, column] tuple
 * @returns The formatted grid index
 */
function formatDataGridIndex(gridIndex: GridIndex) {
    const [row, column] = gridIndex;
    return `${row}-${column}`;
}

/**
 * Parses a formatted grid index
 *
 * @param gridIndexStr - The grid index string
 * @returns An [row, column] tuple for the grid index
 */
function parseDataGridIndex(gridIndexStr: string) {
    return gridIndexStr.split('-').map((n: string) => parseInt(n, 10)) as GridIndex;
}

/**
 *  Keyboard interaction class for navigating a grid using the arrow keys.
 *  Uses a selector to query a rootElement to find the HTML elements that make up the grid.
 *  It is assumed that each grid row will have the same amount of columns.
 *
 *  @see https://www.w3.org/TR/wai-aria-practices-1.2/#grid
 */
export class GridKeyboardInteraction extends BaseKeyboardInteraction {
    // number of grid rows
    private numRows = 0;

    // number of grid columns
    private numCols = 0;

    // false until the interaction's content has been rendered once
    private initialized = false;

    // the active grid cell, if any
    private activeCell: HTMLElement | undefined;

    /**
     * Constructs a new GridKeyboardInteraction
     *
     * @param rootElement - The rootElement that contains the elements
     * @param selectors - The selectors to query for the rows and columns of the grid
     */
    constructor(private rootElement: HTMLElement, private selectors: GridSelectors = TABLE_SELECTORS) {
        super([
            createShortcut(Keys.ArrowDown, new ArrowDown(() => this.handleArrowKey(Keys.ArrowDown))),
            createShortcut(Keys.ArrowUp, new ArrowUp(() => this.handleArrowKey(Keys.ArrowUp))),
            createShortcut(Keys.ArrowLeft, new ArrowLeft(() => this.handleArrowKey(Keys.ArrowLeft))),
            createShortcut(Keys.ArrowRight, new ArrowRight(() => this.handleArrowKey(Keys.ArrowRight))),
            createShortcut(Keys.Enter, new EnterCommand(() => this.handleEnterOrSpace())),
            createShortcut(Keys.Space, new SpaceCommand(() => this.handleEnterOrSpace()))
        ]);
    }

    /**
     * Return the active cell's grid index
     *
     * @returns The grid index for the active cell, or undefined if no cell is active
     */
    private getActiveCellIndices(): GridIndex | undefined {
        const dataGridIndex = this.activeCell?.dataset.gridIndex;

        if (dataGridIndex != null) {
            return parseDataGridIndex(dataGridIndex);
        }

        return undefined;
    }

    /**
     * Adds attribues and event listerners to a cell
     *
     * @param cell - The cell to update
     * @param row - The row index
     * @param column - The column index
     */
    private updateCell(cell: HTMLElement, row: number, column: number) {
        const dataGridIndex = formatDataGridIndex([row, column]);

        // only update the cell if its index has changed
        if (cell.dataset.gridIndex !== dataGridIndex) {
            cell.setAttribute('role', 'gridcell');
            cell.dataset.gridIndex = dataGridIndex;
            this.updateTabIndex(cell, TabIndex.Inactive);
        }
    }

    private getGridElement() {
        return this.rootElement.querySelector(this.selectors.grid!) || this.rootElement;
    }

    /**
     * The html may have changed after a render cycle.
     * This function takes care of adding/remove the grid interaction attributes as needed.
     */
    override onRendered() {
        const gridElement = this.getGridElement();
        if (!gridElement) {
            return;
        }

        let numRows = 0;
        let numCols = 0;

        if (!this.initialized) {
            gridElement.setAttribute('role', 'grid');
            gridElement.addEventListener('focusin', this.handleFocus);
            gridElement.addEventListener('click', this.handleClick);
            this.initialized = true;
        }

        const rows = this.getRows();
        rows.forEach((row, i) => {
            row.setAttribute('role', 'row');

            numCols = 0;
            this.getCells(row).forEach((cell, j) => {
                this.updateCell(cell, i, j);
                numCols++;
            });

            numRows++;
        });

        this.numRows = numRows;
        this.numCols = numCols;

        const activeCellIndex = this.getActiveCellIndices();
        if (activeCellIndex) {
            this.activeCell = this.getCellAt(activeCellIndex);
        }

        if (!this.activeCell) {
            this.activeCell = this.getCellAt([0, 0]);
        }

        if (this.activeCell) {
            this.updateTabIndex(this.activeCell, TabIndex.Active);
        }
    }

    override destroy() {
        const gridElement = this.getGridElement();
        if (!gridElement) {
            return;
        }
        gridElement.removeEventListener('focusin', this.handleFocus);
        gridElement.removeEventListener('click', this.handleClick);
        this.activeCell = undefined;
    }

    /**
     * The handler for a cell's "onfocus"
     *
     * @param event - The focus event
     */
    private handleFocus = (event: Event) => {
        const cell = event.target as HTMLElement;
        if (cell.dataset.gridIndex != null) {
            this.updateActiveCell(cell);
        }
    };

    /**
     * Find the ancestor cell for an element
     *
     * @param element - The descendent element
     * @returns The ancestor cell of the element
     */
    private findAncestorCell(element: HTMLElement) {
        while (element && element.dataset.gridIndex == null) {
            element = element.parentElement!;
        }
        return element;
    }

    /**
     * The handler for a cell's "onclick"
     *
     * @param event - The click event
     */
    private handleClick = (event: Event) => {
        // @ts-ignore
        let element = event.target as HTMLElement;

        if (element.dataset.gridIndex == null) {
            element = this.findAncestorCell(element);
            this.updateActiveCell(element);
        }

        if (element) {
            this.dispatchCellAction(element);
        }
    };

    /**
     * Updates a cell's tabindex attribute
     *
     * @param cell - The cell
     * @param tabIndex - The tabIndex for the cell
     */
    private updateTabIndex(cell: HTMLElement, tabIndex: TabIndex) {
        cell.setAttribute('tabindex', tabIndex);
    }

    /**
     * Get all the descendent cells of an ancestor element
     *
     * @param ancestor - An ancestor element
     * @returns The cells contained in the ancestor
     */
    private getCells(ancestor: HTMLElement = this.rootElement): HTMLElement[] {
        return Array.from<HTMLElement>(ancestor.querySelectorAll<HTMLElement>(this.selectors.column));
    }

    /**
     * Get the rows for the grid interaction
     *
     * @returns The rows for the grid interaction
     */
    private getRows(): HTMLElement[] {
        return Array.from<HTMLElement>(this.rootElement.querySelectorAll(this.selectors.row));
    }

    /**
     * Get the cell corresponding the specified gridIndex
     *
     * @param gridIndex - The grid index
     * @returns The cell at the specified grid index
     */
    private getCellAt(gridIndex: GridIndex): HTMLElement {
        const attr = formatDataGridIndex(gridIndex);
        return this.rootElement.querySelector<HTMLElement>(`[data-grid-index="${attr}"]`)!;
    }

    /**
     * Updates the active cell
     *
     * @param newActiveCell  - THe new active cell
     */
    private updateActiveCell(newActiveCell: HTMLElement) {
        if (this.activeCell) {
            this.updateTabIndex(this.activeCell, TabIndex.Inactive);
        }

        this.updateTabIndex(newActiveCell, TabIndex.Active);
        this.activeCell = newActiveCell;

        newActiveCell.dispatchEvent(
            new CustomEvent('activecell', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { cell: newActiveCell }
            })
        );
    }
    /**
     * Moves the focus to a grid cell
     *
     * @param gridIndex - The grid index
     */
    private moveFocusToCell(gridIndex: GridIndex): void {
        const newActiveCell = this.getCellAt(gridIndex);
        newActiveCell.focus();
    }

    /**
     * Handles arrow key interactions.
     *
     * @param key - The arrow key pressed
     */
    private handleArrowKey(key: Keys.ArrowDown | Keys.ArrowUp | Keys.ArrowLeft | Keys.ArrowRight): void {
        if (key === Keys.ArrowLeft || key === Keys.ArrowRight) {
            this.handleArrowKeysLeftRight(key);
        } else {
            this.handleArrowKeysUpDown(key);
        }
    }

    /**
     * Handles the ArrowUp and ArrowDown key interactions.
     * The active cell is updated to be the cell either above or below
     * the current active cell, if such a cell is exists.
     *
     * @param key - The key pressed (ArrowUp or ArrowDown)
     */
    private handleArrowKeysUpDown(key: Keys.ArrowDown | Keys.ArrowUp): void {
        const [rowIdx, cellIdx] = this.getActiveCellIndices()!;

        let nextRowIdx: number | null = null;
        if (key === Keys.ArrowUp && rowIdx > 0) {
            nextRowIdx = rowIdx - 1;
        } else if (key === Keys.ArrowDown && rowIdx < this.numRows - 1) {
            nextRowIdx = rowIdx + 1;
        }

        if (nextRowIdx != null) {
            this.moveFocusToCell([nextRowIdx, cellIdx]);
        }
    }

    /**
     * Handles the ArrowLeft and ArrowRight key interactions.
     * The active cell is updated to be the cell either too the left or to the right of
     * the current active cell, if such a cell is exists.
     *
     * @param key - The key pressed (ArrowLeft or ArrowRight)
     */
    private handleArrowKeysLeftRight(key: Keys.ArrowLeft | Keys.ArrowRight): void {
        const [rowIdx, cellIdx] = this.getActiveCellIndices()!;

        let nextCellIdx: number | null = null;
        if (key === Keys.ArrowLeft && cellIdx > 0) {
            nextCellIdx = cellIdx - 1;
        } else if (key === Keys.ArrowRight && cellIdx < this.numCols - 1) {
            nextCellIdx = cellIdx + 1;
        }

        if (nextCellIdx != null) {
            this.moveFocusToCell([rowIdx, nextCellIdx]);
        }
    }

    /**
     * Dispatches an "action" event when a cell is clicked, or activated via the enter or space
     *
     * @param cell - The cell
     */
    private dispatchCellAction(cell: Element) {
        cell.dispatchEvent(
            new CustomEvent('cellaction', { bubbles: true, composed: true, cancelable: true, detail: { cell } })
        );
    }

    private handleEnterOrSpace() {
        if (this.activeCell) {
            this.dispatchCellAction(this.activeCell);
        }
    }
}
