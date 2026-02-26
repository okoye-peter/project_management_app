import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const dataGridClassNames = "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200"

// export const 

export const dataGridSxStyles = (isDarkMode: boolean) => {
    return {
        "border": "none",
        "backgroundColor": isDarkMode ? "#1d1f21" : "#ffffff",
        "color": isDarkMode ? "#e5e7eb" : "#374151",
        "& .MuiDataGrid-main": {
            backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
        },
        "& .MuiDataGrid-columnHeaders": {
            backgroundColor: isDarkMode ? "#1d1f21" : "#f9fafb",
            color: isDarkMode ? "#e5e7eb" : "#374151",
            borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
            '& [role="row"] > *': {
                backgroundColor: isDarkMode ? "#1d1f21" : "#f9fafb",
                borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
                fontWeight: "600",
            },
        },
        "& .MuiDataGrid-columnSeparator": {
            display: "none",
        },
        "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
            backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
            "&:hover": {
                backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
            }
        },
        "& .MuiDataGrid-cell": {
            borderBottom: "none",
            color: isDarkMode ? "#9ca3af" : "#4b5563",
        },
        "& .MuiDataGrid-cell:focus": {
            outline: "none",
        },
        "& .MuiDataGrid-row:focus": {
            outline: "none",
        },
        "& .MuiDataGrid-columnHeader:focus": {
            outline: "none",
        },
        "& .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
        },
        "& .MuiDataGrid-cell:focus-within": {
            outline: "none",
        },
        "& .MuiIconButton-root": {
            color: isDarkMode ? "#a3a3a3" : "#6b7280",
        },
        "& .MuiTablePagination-root": {
            color: isDarkMode ? "#a3a3a3" : "#4b5563",
            borderTop: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
            backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
        },
        "& .MuiTablePagination-selectIcon": {
            color: isDarkMode ? "#a3a3a3" : "#6b7280",
        },
        "& .MuiDataGrid-withBorderColor": {
            borderColor: isDarkMode ? "#2d3135" : "#e5e7eb",
            border: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
            "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
            },
            "&::-webkit-scrollbar-track": {
                background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
                background: isDarkMode ? "#3b3d40" : "#d1d5db",
                borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: isDarkMode ? "#4b5563" : "#9ca3af",
            },
        },
        "& .MuiDataGrid-footerContainer": {
            backgroundColor: isDarkMode ? "#1d1f21" : "#ffffff",
            borderTop: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`,
        }
    };
};
