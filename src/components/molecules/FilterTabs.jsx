import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FilterTabs = ({ 
  activeFilter = "hot",
  onFilterChange,
  className 
}) => {
  const filters = [
    { id: "hot", label: "Hot", icon: "TrendingUp" },
    { id: "new", label: "New", icon: "Clock" },
    { id: "top", label: "Top", icon: "Award" },
    { id: "rising", label: "Rising", icon: "Zap" }
  ];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            "hover:bg-white/80 hover:shadow-sm active:scale-95",
            activeFilter === filter.id
              ? "bg-primary text-white shadow-md hover:bg-primary/90"
              : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
          )}
        >
          <ApperIcon name={filter.icon} className="w-4 h-4" />
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;