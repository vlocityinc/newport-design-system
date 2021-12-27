// @ts-nocheck
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, EnterCommand, SpaceCommand } from '../../../commands';
import { Keys } from '../../keyboardInteractions';
import { GridKeyboardInteraction } from '../GridKeyboardInteraction';

const TOP_LEFT = [0, 0];
const TOP_RIGHT = [0, 1];
const BOTTOM_LEFT = [1, 0];

function selectorForCell([row, column]) {
    return `#cell-${row}-${column}`;
}

function moveAndAssertFocus(interaction, tableElement, gridIndex) {
    const cell = tableElement.querySelector(selectorForCell(gridIndex));
    cell.focus();
    expect(tableElement.querySelector(':focus')).toEqual(cell);
    expect(interaction.getActiveCellIndices()).toEqual(gridIndex);
}

function assertKeyInteraction(interaction, key, cellIndex) {
    interaction.handleArrowKey(key);
    expect(interaction.getActiveCellIndices()).toEqual(cellIndex);
    const cell = interaction.rootElement.querySelector(selectorForCell(cellIndex));
    expect(interaction.rootElement.querySelector(':focus')).toEqual(cell);
}

describe('GridKeyboardInteraction', () => {
    let interaction;
    let tableElement;

    beforeEach(() => {
        tableElement = document.createElement('table');

        // eslint-disable-next-line  @lwc/lwc/no-inner-html
        tableElement.innerHTML = `
            <tr id="row-0">
                <td id="cell-0-0">cell</td><td id="cell-0-1">cell</td>
            </tr>
            <tr id="row-1">
                <td id="cell-1-0">cell</td><td id="cell-1-1">cell</td>
            </tr>
`;
        document.body.appendChild(tableElement);
        interaction = new GridKeyboardInteraction(tableElement);
        interaction.onRendered();
    });

    afterEach(() => {
        tableElement.remove();
    });

    it('initial state', async () => {
        const firstCell = tableElement.querySelector('#cell-0-0');
        expect(firstCell).toBeTruthy();

        expect(interaction.getActiveCellIndices()).toEqual(TOP_LEFT);
        expect(interaction.numRows).toEqual(2);
        expect(interaction.numCols).toEqual(2);
    });

    it('key right moves the focus to cell to the right', async () => {
        // move to top-left
        moveAndAssertFocus(interaction, tableElement, TOP_LEFT);

        // move to the right
        assertKeyInteraction(interaction, Keys.ArrowRight, TOP_RIGHT);

        // no-op since we're already on the right most cell
        assertKeyInteraction(interaction, Keys.ArrowRight, TOP_RIGHT);
    });

    it('key left moves the focus to cell to the left', async () => {
        // move to top-right
        moveAndAssertFocus(interaction, tableElement, TOP_RIGHT);

        // move to the left
        assertKeyInteraction(interaction, Keys.ArrowLeft, TOP_LEFT);

        // no-op since we're already on the left most cell
        assertKeyInteraction(interaction, Keys.ArrowLeft, TOP_LEFT);
    });

    it('key down moves the focus down', async () => {
        // move to top-left
        moveAndAssertFocus(interaction, tableElement, TOP_LEFT);

        // move down
        assertKeyInteraction(interaction, Keys.ArrowDown, BOTTOM_LEFT);

        // no-op since we're already on the bottom most cell
        assertKeyInteraction(interaction, Keys.ArrowDown, BOTTOM_LEFT);
    });

    it('resets the focus when a row is deleted', () => {
        // move to bottom-left
        moveAndAssertFocus(interaction, tableElement, BOTTOM_LEFT);

        // remove the second row
        const row1 = tableElement.querySelector('#row-1');
        row1.remove();
        interaction.onRendered();

        expect(interaction.getActiveCellIndices()).toEqual(TOP_LEFT);
        expect(interaction.numRows).toEqual(1);
        expect(interaction.numCols).toEqual(2);
    });

    it('key up moves the focus up', async () => {
        // move to bottom-left
        moveAndAssertFocus(interaction, tableElement, BOTTOM_LEFT);

        // move up
        assertKeyInteraction(interaction, Keys.ArrowUp, TOP_LEFT);

        // no-op since we're already on the top most cell
        assertKeyInteraction(interaction, Keys.ArrowUp, TOP_LEFT);
    });

    it('handle enter or space on active cell', () => {
        const callback = jest.fn();

        tableElement.addEventListener('cellaction', callback);
        interaction.handleEnterOrSpace();

        expect(callback).toHaveBeenCalled();
    });

    it('has the correct bindings', () => {
        const bindings = interaction
            .getBindings()
            .map((binding) => ({ shortcut: binding.key, cmdId: binding.command.id }));

        expect(bindings).toEqual([
            { shortcut: { key: Keys.ArrowDown }, cmdId: ArrowDown.COMMAND_NAME },
            { shortcut: { key: Keys.ArrowUp }, cmdId: ArrowUp.COMMAND_NAME },
            { shortcut: { key: Keys.ArrowLeft }, cmdId: ArrowLeft.COMMAND_NAME },
            { shortcut: { key: Keys.ArrowRight }, cmdId: ArrowRight.COMMAND_NAME },
            { shortcut: { key: Keys.Enter }, cmdId: EnterCommand.COMMAND_NAME },
            { shortcut: { key: Keys.Space }, cmdId: SpaceCommand.COMMAND_NAME }
        ]);
    });
});
