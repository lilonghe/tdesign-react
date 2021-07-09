import React, { CSSProperties, ReactNode, useRef, useLayoutEffect, useState, PropsWithChildren } from 'react';
import classnames from 'classnames';
import get from 'lodash/get';
import { BaseTableCol, DataType } from '../../_type/components/base-table';
import useConfig from '../../_util/useConfig';
import { useTableContext } from './TableContext';

interface CellProps<D extends DataType> extends BaseTableCol<DataType> {
  columns?: BaseTableCol[];
  type?: 'cell' | 'title';
  record?: D;
  style?: CSSProperties;
  rowIndex?: number;
  colIndex?: number;
}

const TableCell = <D extends DataType>(props: PropsWithChildren<CellProps<D>>) => {
  const {
    style = {},
    width,
    type,
    record,
    colKey,
    render,
    colIndex,
    fixed,
    align,
    ellipsis,
    columns,
    rowIndex,
  } = props;

  const { classPrefix } = useConfig();
  const { flattenColumns } = useTableContext();
  const [offset, setOffset] = useState(0);
  const [isBoundary, setIsBoundary] = useState(false);

  const ref = useRef<HTMLTableDataCellElement | HTMLTableHeaderCellElement>();

  useLayoutEffect(() => {
    if (ref.current) {
      let offset = 0;
      const { clientWidth } = ref.current;
      const fixedColumns = flattenColumns.filter((column) => column.fixed === fixed);
      const indexInFixedColumns = fixedColumns.findIndex(({ colKey: key }) => key === colKey);

      fixedColumns.forEach((_, cur) => {
        if ((fixed === 'right' && cur > indexInFixedColumns) || (fixed === 'left' && cur < indexInFixedColumns)) {
          offset += clientWidth;
        }
      });
      setOffset(offset);

      const isBoundary = fixed === 'left' ? indexInFixedColumns === fixedColumns.length - 1 : indexInFixedColumns === 0;
      setIsBoundary(isBoundary);
    }
  }, [ref, flattenColumns, colKey, fixed]);

  const value = get(record, colKey);
  let cellNode: ReactNode = value;
  if (render) {
    cellNode = render({ type, row: record, rowIndex, col: columns?.[colIndex], colIndex });
  }

  // ==================== styles ====================
  const cellStyle = { ...style };
  if (fixed) {
    cellStyle.position = 'sticky';
    cellStyle[fixed] = offset;
  }
  if (width) {
    style.overflow = 'hidden';
  }

  // 样式依靠 td，之后实现请改为 th
  const Component = type === 'title' ? 'td' : 'td';

  return (
    <Component
      ref={ref}
      style={cellStyle}
      className={classnames({
        [`${classPrefix}-table__cell--fixed-${fixed}`]: fixed,
        [`${classPrefix}-table__cell--fixed-${fixed}-${fixed === 'left' ? 'last' : 'first'}`]: fixed && isBoundary,
        [`align-${align}`]: align,
        'text-ellipsis': ellipsis,
      })}
    >
      {cellNode}
    </Component>
  );
};

export default TableCell;