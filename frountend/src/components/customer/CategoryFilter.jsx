import "./CategoryFilter.css";

export default function CategoryFilter({
    categories = [],
    selectedCategory,
    onSelectCategory,
}) {
    if (categories.length === 0) {
        return null;
    }

    return (
        <div className="category-filter-container">
            <div className="category-list">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={
                            selectedCategory === category
                                ? "category-button active"
                                : "category-button"
                        }
                        onClick={() => onSelectCategory(category)}
                        aria-pressed={selectedCategory === category}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}