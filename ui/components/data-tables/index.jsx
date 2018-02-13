import React from 'react';
import classNames from 'classnames';
import _ from '../../shared/helpers';

import { ButtonIcon } from '../button-icons/base/example';
import { Checkbox } from '../checkbox/base/example';
import { Tooltip } from '../tooltips/base/example';
import SvgIcon from '../../shared/svg-icon';

export const InlineEditTableContainer = props => (
  <div className="nds-table_edit_container nds-is-relative">
    {props.children}
  </div>
);

/**
 * @name AdvancedDataTable - Base table element for advanced data grids
 * @param {*} props
 * @prop {boolean} isEditable - Sets whether or not the grid is editable
 * @prop {object} style - React based styles object to override base css
 * @prop {string} className - additional table classes
 */
export const AdvancedDataTable = props => (
  <table
    className={classNames(
      'nds-table nds-table_bordered nds-table_resizable-cols nds-table_fixed-layout',
      props.className,
      {
        'nds-table_edit': props.isEditable
      }
    )}
    role="grid"
    style={props.style}
  >
    {props.children}
  </table>
);

/**
 * @name Thead - thead block for both advanced and inline edit grids
 * @param {*} props
 * @prop {array} columns - Grid columns
 * @prop {boolean} actionableMode - Specifies whether the grid is in actionable or navigation mode
 * @prop {boolean} hasErrorColumn - Specifies whether the grid has a errors column
 * @prop {boolean} hasFocus - Specifies whether a cell in the thead is in user focus
 * @prop {boolean} selectAll - Specifies whether the select all checkbox is marked
 * @prop {string} mainColumnWidth - Specifies width of main columns
 * @prop {string} singleColumnWidth - Specifies width of a specific column
 * @prop {string} sortDirection - Specifies the sort direction of a specific column
 */
export const Thead = props => {
  const selectAllColumnWidth = props.hasErrorColumn ? '2rem' : '3.25rem';
  const mainColumnWidth = props.mainColumnWidth || null;

  return (
    <thead>
      <tr className="nds-line-height_reset">
        {props.hasErrorColumn ? <ErrorsTh /> : null}

        <SelectAllTh
          actionableMode={props.actionableMode}
          checked={props.selectAll}
          className={!props.hasErrorColumn ? 'nds-text-align_right' : null}
          style={{ width: selectAllColumnWidth }}
        />

        {_.times(props.columns.length, i => (
          <Th
            actionableMode={props.actionableMode}
            aria-sort={
              i === 0 && props.sortDirection ? props.sortDirection : null
            }
            className={classNames({
              'nds-is-sorted': i === 0 && props.sortDirection,
              'nds-is-sorted_asc':
                i === 0 && props.sortDirection === 'ascending',
              'nds-is-sorted_desc':
                i === 0 && props.sortDirection === 'descending',
              'nds-has-focus': i === 0 && props.hasFocus
            })}
            columnName={props.columns[i]}
            key={i}
            style={{
              width:
                i === 0 && props.singleColumnWidth
                  ? props.singleColumnWidth
                  : mainColumnWidth
            }}
          />
        ))}

        <ActionsTh />
      </tr>
    </thead>
  );
};

/**
 * @name Th - Common th cell for use in advanced data grids that have sorting or interaction
 * @param {*} props
 * @prop {boolean} actionableMode - Specifies whether the grid is in actionable or navigation mode
 * @prop {string} aria-sort
 * @prop {string} className
 * @prop {string} columnName - Display name of the column header
 */
export let Th = props => {
  const { columnName, actionableMode, ...rest } = props;
  const tabIndex = actionableMode ? '0' : '-1';
  const uniqueId = _.uniqueId('cell-resize-handle-');

  return (
    <th
      {...rest}
      aria-label={columnName}
      aria-sort={props['aria-sort'] || 'none'}
      className={classNames(
        'nds-is-sortable nds-is-resizable nds-text-title_caps',
        props.className
      )}
      scope="col"
    >
      <a
        className="nds-th__action nds-text-link_reset"
        href="javascript:void(0);"
        role="button"
        tabIndex={tabIndex}
      >
        <span className="nds-assistive-text">Sort by: </span>
        <span className="nds-truncate" title={columnName || 'Column Name'}>
          {columnName || 'Column Name'}
        </span>
        <div className="nds-icon_container">
          <SvgIcon
            className="nds-icon nds-icon_x-small nds-icon-text-default nds-is-sortable__icon"
            sprite="utility"
            symbol="arrowdown"
          />
        </div>
      </a>
      <span
        className="nds-assistive-text"
        aria-live="assertive"
        aria-atomic="true"
      >
        Sorted {props['aria-sort'] ? props['aria-sort'] : 'none'}
      </span>
      <div className="nds-resizable">
        <input
          aria-label={
            columnName + ' column width' || 'Column Name column width'
          }
          className="nds-resizable__input nds-assistive-text"
          id={uniqueId}
          max="1000"
          min="20"
          tabIndex={tabIndex}
          type="range"
        />
        <span className="nds-resizable__handle">
          <span className="nds-resizable__divider" />
        </span>
      </div>
    </th>
  );
};

/**
 * @name SelectAllTh - Common "Select All" column header for all grids
 * @param {*} props
 * @prop {boolean} actionableMode - Specifies whether or not the grid is in actionable or navigation mode
 * @prop {boolean} checked - Specifies whether or not select all has been checked
 * @prop {object} style - React style object
 */
export const SelectAllTh = props => (
  <th style={props.style} className={props.className} scope="col">
    <div className="nds-th__action nds-th__action_form">
      <Checkbox
        tabIndex={props.actionableMode ? '0' : '-1'}
        label="Select All"
        hideLabel
        checked={props.checked ? true : null}
      />
    </div>
  </th>
);

/**
 * @name ActionsTh - Common "Row Level Actions" column header for all grids
 * @param {*} props
 */
export const ActionsTh = props => (
  <th scope="col" style={{ width: '3.25rem' }}>
    <div className="nds-th__action">
      <span className="nds-assistive-text">Actions</span>
    </div>
  </th>
);

/**
 * @name ErrorsTh - Common "Errors" column header for all grids
 * @param {*} props
 */
export const ErrorsTh = props => (
  <th scope="col" style={{ width: '3.75rem' }}>
    <div className="nds-th__action">
      <span className="nds-assistive-text">Errors</span>
    </div>
  </th>
);

/**
 * @name AdvancedDataTableTr - Table row for advanced data table components
 * @param {*} props
 * @prop {boolean} actionableMode - Specifies whether the grid is in actionable or navigation mode
 * @prop {boolean} hasFocus - Specifies whether a specific cell is in focus
 * @prop {boolean} rowSelected
 * @prop {integer} index - Row index in the Grid
 * @prop {string} accountName
 * @prop {string} amount
 * @prop {string} className - CSS classes for the tr element
 * @prop {string} closeDate
 * @prop {string} confidence
 * @prop {string} contact
 * @prop {string} recordName
 * @prop {string} stage
 */
export const AdvancedDataTableTr = props => (
  <tr
    className={classNames('nds-hint-parent', props.className)}
    aria-selected={props.rowSelected}
  >
    <SelectRowTd
      className="nds-text-align_right"
      checkTabIndex={props.actionableMode ? '0' : '-1'}
      checked={props.rowSelected}
      index={props.index}
    />
    <ReadOnlyBodyTh
      actionableMode={props.actionableMode}
      cellLink="javascript:void(0);"
      cellText={props.recordName}
      hasFocus={!props.actionableMode && props.index === 1 && props.hasFocus}
      index={props.index}
      tabIndex={!props.actionableMode && props.index === 1 ? '0' : null}
    />
    <ReadOnlyTd cellText={props.accountName} />
    <ReadOnlyTd cellText={props.closeDate} />
    <ReadOnlyTd cellText={props.stage} />
    <ReadOnlyTd cellText={props.confidence} />
    <ReadOnlyTd cellText={props.amount} />
    <ReadOnlyTd
      actionableMode={props.actionableMode}
      cellLink="javascript:void(0);"
      cellText={props.contact}
    />
    <RowActionsTd actionableMode={props.actionableMode} />
  </tr>
);

/**
 * @name AdvancedDataTableTd
 * @param {*} props
 * @prop {*} children
 * @prop {boolean} hasError - Determines where or not the cell is in an error state
 * @prop {boolean} hasFocus - Determines where or not the cell has user focus
 * @prop {boolean} isEditable - Determines where or not the cell is editable
 * @prop {boolean} isEdited - Determines where or not the cell has been edited
 * @prop {boolean} isEditing - Determines where or not the cell is being edited
 * @prop {boolean} isLocked - Determines where or not the cell is locked from editing
 * @prop {integer} tabIndex - Sets the tabindex on the cell
 * @prop {string} className - Sets additional classnames to the cell
 */
export const AdvancedDataTableTd = props => {
  const {
    children,
    className,
    hasError,
    hasFocus,
    isEditable,
    isEdited,
    isEditing,
    isLocked,
    tabIndex
  } = props;

  let classes = null;

  if (className || isEditable || hasFocus || isEdited || hasError) {
    classes = classNames(className, {
      'nds-cell-edit': isEditable,
      'nds-has-focus': hasFocus,
      'nds-is-edited': isEdited,
      'nds-has-error': hasError
    });
  }

  return (
    <td
      aria-readonly={isLocked}
      aria-selected={isEditing}
      className={classes}
      role="gridcell"
      tabIndex={tabIndex}
    >
      {children}
    </td>
  );
};

/**
 * @name AdvancedDataTableBodyTh
 * @param {*} props
 * @prop {*} children
 * @prop {boolean} hasFocus - Determines where or not the cell has user focus
 * @prop {boolean} isEditable - Determines where or not the cell is editable
 * @prop {integer} tabIndex - Sets the tabindex on the cell
 */
export const AdvancedDataTableBodyTh = props => {
  const { children, hasFocus, isEditable, tabIndex } = props;

  let classes = null;

  if (isEditable || hasFocus) {
    classes = classNames({
      'nds-cell-edit': isEditable,
      'nds-has-focus': hasFocus
    });
  }

  return (
    <th className={classes} scope="row" tabIndex={tabIndex}>
      {children}
    </th>
  );
};

/**
 * @name SelectRowTd - Common table cell for selecting a row in a grid
 * @param {*} props
 * @prop {boolean} checked - Set checked on the cell checkbox
 * @prop {boolean} hasFocus - Determines whether the cell is in user focus
 * @prop {boolean} isEditable - Determines whether the cell is editable
 * @prop {integer} cellTabIndex - Set tabindex on the cell
 * @prop {integer} checkTabIndex - Set tabindex on the checkbox
 * @prop {integer} index - Grid row index
 * @prop {string} className
 */
export const SelectRowTd = props => (
  <AdvancedDataTableTd
    className={props.className}
    hasFocus={props.hasFocus}
    isEditable={props.isEditable}
    tabIndex={props.cellTabIndex}
  >
    <Checkbox
      checked={props.checked}
      hideLabel
      id={`checkbox-0${props.index}`}
      label={`Select item ${props.index}`}
      tabIndex={props.checkTabIndex}
    />
  </AdvancedDataTableTd>
);

/**
 * @name RowActionsTd - Common cell for holding Row Level Actions in a Grid
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the Grid is in Actionable or Navigation mode
 * @prop {boolean} hasFocus - Determines whether or not the cell is in user focus
 * @prop {boolean} isEditable - Determines whether or not the cell is editable
 * @prop {string} className - Sets and class name on the cell
 */
export const RowActionsTd = props => (
  <AdvancedDataTableTd
    className={props.className}
    hasFocus={props.hasFocus}
    isEditable={props.isEditable}
  >
    <ButtonIcon
      assistiveText="Show More"
      className="nds-button_icon-border-filled nds-button_icon-x-small"
      iconClassName="nds-button__icon_hint nds-button__icon_small"
      symbol="down"
      tabIndex={props.actionableMode ? '0' : '-1'}
      title="Show More"
    />
  </AdvancedDataTableTd>
);

/**
 * @name ErrorTd - Common table cell to be used for a row errors
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {boolean} hasError - Determines whether or not the row has an error
 * @prop {boolean} hasFocus - Determines whether or not the cell has user focus
 * @prop {integer} index - Row index in the grid
 * @prop {integer} tabIndex - Sets tabindex on the cell
 */
export const ErrorTd = props => (
  <AdvancedDataTableTd
    className="nds-cell-error"
    hasFocus={props.hasFocus}
    isEditable
    tabIndex={props.tabIndex}
  >
    <ButtonIcon
      aria-describedby={
        props.hasError && props.hasFocus ? 'error-tooltip-01' : null
      }
      aria-hidden={props.hasError ? null : 'true'}
      assistiveText={`Item ${props.index} has errors`}
      className={classNames(
        'nds-button_icon-error nds-m-horizontal_xxx-small',
        {
          'nds-hidden': !props.hasError
        }
      )}
      id={'error-0' + props.index}
      symbol="warning"
      tabIndex={props.actionableMode && props.hasError ? null : '-1'}
      title={`Item ${props.index} has errors`}
    />
    <span className="nds-row-number nds-text-body_small nds-text-color_weak" />
  </AdvancedDataTableTd>
);

/**
 * @name ReadOnlyTd - Cell container for a readonly cell
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {string} cellText
 * @prop {string} cellLink - URL cell text can link to
 */
export const ReadOnlyTd = props => (
  <AdvancedDataTableTd>
    <ReadOnlyCellContent
      actionableMode={props.actionableMode}
      cellLink={props.cellLink}
      cellText={props.cellText}
    />
  </AdvancedDataTableTd>
);

/**
 * @name ReadOnlyBodyTh - Cell container for a readonly row header
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {boolean} hasFocus - Determines whether the cell has user focus
 * @prop {integer} index - Grid row index
 * @prop {string} cellText
 * @prop {string} cellLink - URL cell text can link to
 */
export const ReadOnlyBodyTh = props => (
  <AdvancedDataTableBodyTh hasFocus={props.hasFocus} tabIndex={props.tabIndex}>
    <ReadOnlyCellContent
      actionableMode={props.actionableMode}
      cellLink={props.cellLink}
      cellText={props.cellText}
    />
  </AdvancedDataTableBodyTh>
);

/**
 * @name ReadOnlyCellContent - Cell content common to all readonly data grid cell
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {string} cellLink - URL the cell content should link to
 * @prop {string} cellText
 */
export const ReadOnlyCellContent = props => (
  <div className="nds-truncate" title={props.cellText}>
    {props.cellLink ? (
      <a href={props.cellLink} tabIndex={props.actionableMode ? '0' : '-1'}>
        {props.cellText}
      </a>
    ) : (
      props.cellText
    )}
  </div>
);

/**
 * @name InlineEditTr - Common table row for inline edit data grids
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {boolean} focusableCell - Name of the focusable cell in the grid
 * @prop {boolean} rowSelected - Set whether the row is selected
 * @prop {boolean} showCellError - Show an errored cell
 * @prop {boolean} showEdit - Show the edit dialog
 * @prop {boolean} showEditError - Show cell editing error
 * @prop {boolean} showEditRequired - Show required cell edit
 * @prop {boolean} showEditedCell - Show that a cell was edited
 * @prop {boolean} showRowError - Show the row has an error
 * @prop {integer} index - Grid row index
 * @prop {string} accountName
 * @prop {string} amount
 * @prop {string} closeDate
 * @prop {string} confidence
 * @prop {string} contact
 * @prop {string} focusedCell
 * @prop {string} recordName
 * @prop {string} stage
 */
export const InlineEditTr = props => (
  <tr className="nds-hint-parent" aria-selected={props.rowSelected}>
    <ErrorTd
      tabIndex={props.focusableCell === 'error' && props.index === 1 ? 0 : null}
      hasFocus={
        props.focusedCell === 'error' && props.index === 1 ? true : null
      }
      index={props.index}
      hasError={props.showRowError && props.index === 1 ? true : null}
      actionableMode={props.actionableMode}
    />
    <SelectRowTd
      cellTabIndex={
        !props.actionableMode &&
        props.focusableCell === 'selectRow' &&
        props.index === 1 ? (
          '0'
        ) : null
      }
      checkTabIndex={props.actionableMode ? '0' : '-1'}
      checked={props.rowSelected}
      hasFocus={props.focusedCell === 'selectRow' && props.index === 1}
      isEditable
      index={props.index}
    />
    <EditableBodyTh
      buttonText={'Edit Name: Item ' + props.index}
      cellLink="javascript:void(0);"
      cellText={props.recordName}
      index={props.index}
      actionableMode={props.actionableMode}
      tabIndex={
        !props.actionableMode &&
        props.focusableCell === 'recordName' &&
        props.index === 1 ? (
          '0'
        ) : null
      }
      hasFocus={props.focusedCell === 'recordName' && props.index === 1}
    />
    <EditableTd
      buttonText={'Edit Account Name: Item ' + props.index}
      cellText={props.accountName}
      index={props.index}
      actionableMode={props.actionableMode}
      tabIndex={
        !props.actionableMode &&
        props.focusableCell === 'accountName' &&
        props.index === 1 ? (
          '0'
        ) : null
      }
      hasFocus={props.focusedCell === 'accountName' && props.index === 1}
      isEditing={props.showEdit && props.index === 1}
      isEdited={props.showEditedCell && props.index === 1 ? true : null}
      hasError={props.showCellError && props.index === 1 ? true : null}
    >
      {props.showEdit && props.index === 1 ? (
        <EditPopover
          isRequired={props.showEditRequired}
          hasError={props.showEditError}
        />
      ) : null}
    </EditableTd>
    <EditableTd
      buttonText={'Edit Close Date: Item ' + props.index}
      cellText={props.closeDate}
      index={props.index}
      actionableMode={props.actionableMode}
    />
    <EditableTd
      buttonText={'Edit Stage: Item ' + props.index}
      cellText={props.stage}
      index={props.index}
      actionableMode={props.actionableMode}
    />
    <EditableTd
      buttonText={'Edit Confidence: Item ' + props.index}
      cellText={props.confidence}
      index={props.index}
      actionableMode={props.actionableMode}
      isLocked
    />
    <EditableTd
      buttonText={'Edit Amount: Item ' + props.index}
      cellText={props.amount}
      index={props.index}
      actionableMode={props.actionableMode}
    />
    <EditableTd
      buttonText={'Edit Contact: Item ' + props.index}
      cellText={props.contact}
      index={props.index}
      actionableMode={props.actionableMode}
    />
    <RowActionsTd actionableMode={props.actionableMode} isEditable />
  </tr>
);

/**
 * @name EditableTd - A common cell container for an editable cell
 * @param {*} props
 * @prop {*} children
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {boolean} hasError - Shows the cell in error state
 * @prop {boolean} hasFocus - Shows the cell is in user focus
 * @prop {boolean} isEdited - Shows that the cell has been edited
 * @prop {boolean} isEditing - Shows that the cell is being edited
 * @prop {boolean} isLocked - Shows that the cell is locked from editing
 * @prop {integer} index - Row index the cell is displayed in
 * @prop {integer} tabIndex - Sets tabindex on the cell
 * @prop {string} buttonText
 * @prop {string} cellText
 */
export const EditableTd = props => (
  <AdvancedDataTableTd
    hasError={props.hasError}
    hasFocus={props.hasFocus}
    isEditable
    isEdited={props.isEdited}
    isEditing={props.isEditing}
    isLocked={props.isLocked}
    tabIndex={props.tabIndex}
  >
    <EditableCellContent
      actionableMode={props.actionableMode}
      buttonText={props.buttonText}
      cellText={props.cellText}
      index={props.index}
      isLocked={props.isLocked}
    />
    {props.children}
  </AdvancedDataTableTd>
);

/**
 * @name EditableBodyTh - Common cell wrapper for inline edit grid row headers
 * @param {*} props
 * @prop {*} children
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {boolean} hasFocus - Shows the cell is in user focus
 * @prop {integer} index - Row index the cell is displayed in
 * @prop {integer} tabIndex - Sets tabindex on the cell
 * @prop {string} buttonText
 * @prop {string} cellLink - URL cell text should link to
 * @prop {string} cellText
 */
export const EditableBodyTh = props => (
  <AdvancedDataTableBodyTh
    isEditable
    hasFocus={props.hasFocus}
    tabIndex={props.tabIndex}
  >
    <EditableCellContent
      actionableMode={props.actionableMode}
      buttonText={props.buttonText}
      cellLink={props.cellLink}
      cellText={props.cellText}
      index={props.index}
    />
    {props.children}
  </AdvancedDataTableBodyTh>
);

/**
 * EditableCellContent - Common cell content for inline edit grids
 * @param {*} props
 * @prop {boolean} actionableMode - Determines whether or not the grid is in actionable or navigation mode
 * @prop {boolean} isLocked - Shows that the cell is locked from editing
 * @prop {integer} index - Row index the cell is displayed in
 * @prop {string} buttonText
 * @prop {string} cellLink - URL cell text should link to
 * @prop {string} cellText
 */
export const EditableCellContent = props => (
  <span className="nds-grid nds-grid_align-spread">
    {props.cellLink ? (
      <a
        href={props.cellLink}
        className="nds-truncate"
        id={`link-0${props.index}`}
        tabIndex={props.actionableMode ? '0' : '-1'}
        title={props.cellText}
      >
        {props.cellText}
      </a>
    ) : (
      <span className="nds-truncate" title={props.cellText}>
        {props.cellText}
      </span>
    )}
    <ButtonIcon
      assistiveText={props.buttonText}
      className="nds-cell-edit__button nds-m-left_x-small"
      disabled={props.isLocked}
      iconClassName={classNames('nds-button__icon_hint', {
        'nds-button__icon_edit': !props.isLocked,
        'nds-button__icon_lock nds-button__icon_small': props.isLocked
      })}
      symbol={props.isLocked ? 'lock' : 'edit'}
      tabIndex={props.actionableMode ? '0' : '-1'}
      title={props.buttonText}
    />
  </span>
);

/**
 * @name EditPopover - Popover used to edit a cell in inline edit grids
 * @param {*} props
 * @prop {boolean} hasError
 * @prop {boolean} isRequired
 */
export const EditPopover = props => (
  <section
    className="nds-popover nds-popover_edit"
    role="dialog"
    style={{ position: 'absolute', top: '0', left: '0.0625rem' }}
  >
    <span id="form-start" tabIndex="0" />
    <div className="nds-popover__body">
      <div
        className={classNames('nds-form-element nds-grid nds-wrap', {
          'nds-has-error': props.hasError
        })}
      >
        <label
          className="nds-form-element__label nds-form-element__label_edit nds-no-flex"
          htmlFor="company-01"
        >
          {props.isRequired ? (
            <abbr className="nds-required" title="required">
              *
            </abbr>
          ) : null}
          <span className="nds-assistive-text">Company</span>
        </label>
        <div className="nds-form-element__control nds-grow">
          <input
            id="company-01"
            className={classNames('nds-input', {
              'input--required': props.isRequired
            })}
            type="text"
            defaultValue="Acme Enterprises"
            required={props.isRequired}
            aria-describedby={props.hasError ? 'error-message-01' : null}
          />
        </div>
        {props.hasError ? (
          <div id="error-message-01" className="nds-form-element__help">
            This field is required
          </div>
        ) : null}
      </div>
    </div>
    <span id="form-end" tabIndex="0" />
  </section>
);

/**
 * @name ErrorTooltip - Tooltip used to display a row error
 * @param {*} props
 */
export const ErrorTooltip = props => (
  <Tooltip
    className="nds-nubbin_bottom-left nds-theme_error"
    id="error-tooltip-01"
    style={{ position: 'absolute', top: '-1rem', left: '0', width: 'auto' }}
  >
    Company encountered an error.
  </Tooltip>
);
