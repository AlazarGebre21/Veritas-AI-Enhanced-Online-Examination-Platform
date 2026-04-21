import { cn } from "@/lib/utils/cn.js";
import { Skeleton } from "@/components/ui/Skeleton.jsx";

/**
 * Reusable data table component.
 *
 * @param {Object} props
 * @param {Array<{header: string, accessor: string|function, className?: string}>} props.columns
 * @param {Array<any>} props.data
 * @param {boolean} [props.isLoading]
 * @param {string} [props.emptyMessage]
 * @param {function(any): void} [props.onRowClick]
 */
export function DataTable({ columns, data, isLoading, emptyMessage = "No records found.", onRowClick }) {
  return (
    <div className="w-full overflow-x-auto bg-white rounded-standard border border-whisper shadow-sm">
      <table className="w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-whisper bg-warm-white/50 text-warm-gray-500">
            {columns.map((col, idx) => (
              <th key={idx} className={cn("px-4 py-3 font-medium tracking-wide whitespace-nowrap", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-whisper text-notion-black">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-3">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : !data || data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-warm-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={row.id || rowIdx} 
                onClick={() => onRowClick?.(row)}
                className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-warm-white/60")}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn("px-4 py-3", col.className)}>
                    {typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
