package com.topaz.store.domain.model;

public enum ProductCategory {
    BEAUTY("beauty"),
    FRAGRANCES("fragrances"),
    FURNITURE("furniture"),
    GROCERIES("groceries"),
    HOME_DECORATION("home-decoration"),
    KITCHEN_ACCESSORIES("kitchen-accessories"),
    LAPTOPS("laptops"),
    MENS_SHIRTS("mens-shirts"),
    MENS_SHOES("mens-shoes"),
    MENS_WATCHES("mens-watches"),
    MOBILE_ACCESSORIES("mobile-accessories"),
    MOTORCYCLE("motorcycle"),
    SKIN_CARE("skin-care"),
    SMARTPHONES("smartphones"),
    SPORTS_ACCESSORIES("sports-accessories"),
    SUNGLASSES("sunglasses"),
    TABLETS("tablets"),
    TOPS("tops"),
    VEHICLE("vehicle"),
    WOMENS_BAGS("womens-bags"),
    WOMENS_DRESSES("womens-dresses"),
    WOMENS_JEWELLERY("womens-jewellery"),
    WOMENS_SHOES("womens-shoes"),
    WOMENS_WATCHES("womens-watches"),
    OTHER("other");

    private final String value;

    ProductCategory(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static ProductCategory fromValue(String value) {
        if (value == null || value.isBlank()) {
            return OTHER;
        }
        String normalized = value.trim();
        for (ProductCategory category : values()) {
            if (category.value.equalsIgnoreCase(normalized)) {
                return category;
            }
        }
        return OTHER;
    }
}
